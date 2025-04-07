<script lang="ts">
	// import 'cal-sans';

	import { getPrevText } from '../lib/editor';
	import { Editor } from '@tiptap/core';
	import ImageResizer from './extensions/ImageResizer.svelte';
	import { onMount } from 'svelte';
	import { defaultExtensions } from './extensions/index.svelte';
	import { defaultEditorProps } from './props';
	import EditorBubbleMenu from './bubble-menu/index.svelte';
	import { emailServiceState, user } from '$lib/store';
	import { get } from 'svelte/store';
	import type { EditorType } from '../lib';
	import { ComposeEmailMode, type EmailData } from '$lib/types';
	import { writeEmailSuggestion } from '$lib/api/compose';
	import { generateJSON } from '@tiptap/html';
	/**
	 * The default value to use for the editor.
	 * Defaults to empty string.
	 */
	let {
		email = $bindable()
	}: {
		email: EmailData;
	} = $props();
	/**
	 * Disable local storage read/save.
	 * @default false
	 */
	let editor: EditorType | undefined = $state();
	let element: Element;

	let isLoading = $state(false);

	let prev = '';

	const readStream = async (
		resultReader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>
	) => {
		let buffer = '';
		const decoder = new TextDecoder('utf-8');

		try {
			while (true) {
				const { done, value } = await resultReader!.read();
				if (done) break;
				const chunk = decoder.decode(value);
				buffer += chunk;

				// Add artificial delay
				await new Promise((resolve) => setTimeout(resolve, 50));

				let boundary = buffer.indexOf('\n'); // Assume newline-separated JSON
				while (boundary !== -1) {
					const jsonString = buffer.slice(0, boundary); // Extract one JSON object
					buffer = buffer.slice(boundary + 1); // Remove processed part
					boundary = buffer.indexOf('\n');

					try {
						const { data } = JSON.parse(jsonString);

						editor?.commands.insertContent(data);
					} catch (error) {
						console.error('Error parsing JSON string:', jsonString, error);
					}
				}
			}
		} catch (error) {
			console.error('Error reading search stream:', error);
		} finally {
			isLoading = false;

			// email.body =editor?.getHTML();
		}
	};

	onMount(() => {
		editor = new Editor({
			element: element,
			onTransaction: (props) => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;

				email.body = editor?.getHTML();
			},
			extensions: [...defaultExtensions],
			editorProps: {
				...defaultEditorProps
			},
			onUpdate: (e) => {
				const selection = e.editor.state.selection;
				const lastTwo = getPrevText(e.editor, { chars: 2 });
				if (lastTwo === '++' && !isLoading) {
					isLoading = true;
					e.editor.commands.deleteRange({
						from: selection.from - 2,
						to: selection.from
					});
					const _writeEmailSuggestion = async () => {
						const reader = await writeEmailSuggestion({
							user: get(user)?.id.toString(),
							subject: email?.subject,
							body: e.editor.storage.markdown.getMarkdown()
						});
						if (reader) {
							readStream(reader);
						}
					};
					_writeEmailSuggestion();
				}
			},
			autofocus: 'end'
		});

		const composeMode = get(emailServiceState)?.composeEmailMode;
		const currentEmail = get(emailServiceState)?.currentEmail;

		if (composeMode === ComposeEmailMode.Forward || composeMode === ComposeEmailMode.Reply) {
			if (currentEmail?.raw_content) {
				const doc = generateJSON(currentEmail.raw_content.toString(), [...defaultExtensions]);

				if (doc) {
					const indentedContent = [
						{
							type: 'paragraph'
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text:
										composeMode === ComposeEmailMode.Forward
											? 'Forwarded message:'
											: `On ${new Date(currentEmail?.date).toLocaleString()}, wrote:`
								}
							]
						},
						{
							type: 'blockquote',
							content: doc.content
						}
					];
					// Insert the wrapper and header first
					editor?.commands.insertContent(indentedContent);

					// Then insert the actual content with proper indentation

					// Add a final paragraph after the quoted content
					editor?.commands.insertContent({
						type: 'paragraph'
					});
				} else {
					// Fallback to plain text if parsing fails
					const formattedContent = `\n\n${composeMode === ComposeEmailMode.Forward ? 'Forwarded message:\n' : `On ${new Date(currentEmail?.date).toLocaleString()}, wrote:\n`}${currentEmail?.raw_content}\n\n`;
					editor?.commands.insertContent(formattedContent);
				}
			}
		}
	});
	export function getEmailContentForSend(): string {
		const editorContent = editor?.getHTML() ?? '';
		let originalEmailContent = '';

		const composeMode = get(emailServiceState)?.composeEmailMode;
		const currentEmail = get(emailServiceState)?.currentEmail;

		if (composeMode === ComposeEmailMode.Forward || composeMode === ComposeEmailMode.Reply) {
			originalEmailContent = `
				<br>
				<div class="quoted-email">
					${composeMode === ComposeEmailMode.Forward ? 'Forwarded message:' : `On ${new Date(currentEmail?.date).toLocaleString()}, wrote:`}<br>
					${currentEmail?.raw_content}
				</div>
				<br>
			`;
		}

		return editorContent + originalEmailContent;
	}
</script>

{#if editor && editor.isEditable}
	<EditorBubbleMenu {editor} />
{/if}

<div id="editor" bind:this={element} class="editor-container">
	<slot />

	{#if editor?.isActive('image')}
		<ImageResizer {editor} />
	{/if}

	{#if isLoading}
		<div class="loading-spinner">
			<div class="spinner"></div>
		</div>
	{/if}
</div>

<style>
	.loading-spinner {
		position: absolute;
		bottom: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: #e8e8e8;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	:global(.quoted-email) {
		padding-left: 16px;
		margin-left: 8px;
		border-left: 2px solid #cccccc;
		color: #505050;
	}

	#editor {
		min-height: 300px;
		max-height: 500px;
		overflow-y: auto;
	}
	.email-iframe {
		height: 100%;
		width: 100%;
		background-color: var(--color-primary-white);
	}
	.editor-container {
		padding: 10px;
		border-radius: 10px;
	}

	/* Standard selection styling */
	::selection {
		background-color: var(--color-primary-dark-gray);
	}

	/* Mozilla based browsers */
	::-moz-selection {
		background-color: var(--color-primary-dark-gray);
	}

	/* Apply selection styles to editor content */
	:global(.ProseMirror ::selection) {
		background-color: var(--color-primary-dark-gray);
	}

	:global(.ProseMirror ::-moz-selection) {
		background-color: var(--color-primary-dark-gray);
	}

	/* Remove non-standard selectors that aren't supported */
	/* Note: Only ::selection and ::-moz-selection are standard */

	.iframe-wrapper {
		position: relative;
		padding-bottom: 10px;
		height: 0;
		overflow: hidden;
		width: 100%;
		height: auto;

		iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
