<script lang="ts">
	// import 'cal-sans';

	import { getPrevText } from '../emailEditorLibs/editor';
	import { Editor } from '@tiptap/core';
	import ImageResizer from './extensions/ImageResizer.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { defaultExtensions } from './extensions/index.svelte';
	import { defaultEditorProps } from './props';
	import EditorBubbleMenu from './bubble-menu/index.svelte';
	import { emailServiceState, user } from '$lib/store';
	import { get } from 'svelte/store';
	import type { EditorType } from '../emailEditorLibs';
	import { ComposeEmailMode, type EmailData } from '$lib/types';
	import { writeEmailSuggestion } from '$lib/api/compose';
	import { generateJSON } from '@tiptap/html';
	import Highlight from '@tiptap/extension-highlight';
	import { composeEmail } from '$lib/store';
	/**
	 * The default value to use for the editor.
	 * Defaults to empty string.
	 */
	let { editor = $bindable() }: { editor: EditorType | undefined } = $props();
	let email: EmailData = $state(get(composeEmail).email);
	/**
	 * Disable local storage read/save.
	 * @default false
	 */
	let element: Element;

	composeEmail.subscribe((state) => {
		if (state.email !== email) {
			email = state.email;
		}
	});

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
			composeEmail.update((state) => ({
				...state,
				isLoadingTextGeneration: false
			}));

			// email.body =editor?.getHTML();
		}
	};

	onMount(() => {
		// Create the editor instance but store it locally first
		const editorInstance = new Editor({
			element: element,
			onTransaction: (props) => {
				// Update our local instance
				editor = props.editor;
				composeEmail.update((state) => ({
					...state,
					email: {
						...state.email,
						body: editorInstance?.getHTML()
					}
				}));
			},
			extensions: [
				...defaultExtensions,
				// Add highlight extension for text generation animation
				Highlight.configure({
					HTMLAttributes: {
						class: 'highlight'
					}
				})
			],
			editorProps: {
				...defaultEditorProps
			},
			onUpdate: (e) => {
				const selection = e.editor.state.selection;
				const lastTwo = getPrevText(e.editor, { chars: 2 });
				if (lastTwo === '++' && !$composeEmail.isLoadingTextGeneration) {
					$composeEmail.isLoadingTextGeneration = true;
					e.editor.commands.deleteRange({
						from: selection.from - 2,
						to: selection.from
					});
					const _writeEmailSuggestion = async () => {
						const reader = await writeEmailSuggestion({
							user: get(user)?.id.toString(),
							subject: email?.subject,
							body: e.editor.storage.markdown.getMarkdown(),
							writingStyle: get(emailServiceState)?.emailSettings[0].email_preferences.writing_style
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

		// After initialization, assign to the bound prop
		editor = editorInstance;

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

	onDestroy(() => {
		if (editor) {
			editor.destroy();
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

	{#if $composeEmail.isLoadingTextGeneration}
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
		max-height: 520px;
		height: 520px;
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
		height: 100%;
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
