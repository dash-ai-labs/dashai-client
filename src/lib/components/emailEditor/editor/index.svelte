<script lang="ts">
	// import 'cal-sans';
	import './styles/index.css';
	import './styles/prosemirror.css';
	import './styles/tailwind.css';

	import { getPrevText } from '../lib/editor';
	import { createLocalStorageStore } from '../lib/utils';
	import { Editor, Extension, type JSONContent } from '@tiptap/core';
	import type { EditorProps } from '@tiptap/pm/view';
	import ImageResizer from './extensions/ImageResizer.svelte';
	import { onMount } from 'svelte';
	import { useCompletion } from '@ai-sdk/svelte';
	import { defaultExtensions } from './extensions/index.svelte';
	import { defaultEditorProps } from './props';

	import EditorBubbleMenu from './bubble-menu/index.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { user } from '$lib/store';
	import { get } from 'svelte/store';
	import type { EditorType } from '../lib';
	import type { Email } from '$lib/types';

	/**
	 * Additional classes to add to the editor container.
	 * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg".
	 */
	let className = 'relative min-h-[300px] px-1 py-1 selection:bg-primary-gray';
	/**
	 * The default value to use for the editor.
	 * Defaults to empty string.
	 */
	let {
		defaultValue = '',
		extensions,
		editorProps,
		onUpdate,
		onDebouncedUpdate,
		debounceDuration,
		storageKey = 'email_ed',
		disableLocalStorage,
		editor,
		email
	}: {
		defaultValue: JSONContent | string;
		extensions: Extension[];
		editorProps: EditorProps;
		onUpdate: (editor?: Editor) => void | Promise<void>;
		onDebouncedUpdate: (editor?: Editor) => void | Promise<void>;
		debounceDuration: number;
		storageKey: string;
		disableLocalStorage: boolean;
		editor: EditorType;
		email: Email;
	} = $props();
	/**
	 * Disable local storage read/save.
	 * @default false
	 */
	let element: Element;

	const { complete, completion, isLoading, stop } = useCompletion({
		id: 'novel',
		api: `${PUBLIC_API_URL}/user/${get(user)?.id.toString()}/suggestion`,
		credentials: 'include',
		streamProtocol: 'text',
		body: {
			email_id: [email?.email_id ?? ''],
			subject: email?.subject ?? '',
			body: email?.raw_content ?? ''
		},
		onFinish: (_prompt, completion) => {
			editor?.commands.setTextSelection({
				from: editor.state.selection.from - completion.length,
				to: editor.state.selection.from
			});
		},
		onError: (err) => {
			// addToast({
			// 	data: {
			// 		text: err.message,
			// 		type: 'error'
			// 	}
			// });
			// if (err.message === 'You have reached your request limit for the day.') {
			// 	va.track('Rate Limit Reached');
			// }
		}
	});

	const content = createLocalStorageStore(storageKey, defaultValue);
	let hydrated = false;
	$effect(() => {
		if (editor && !hydrated) {
			const value = disableLocalStorage ? defaultValue : $content;

			if (value) {
				editor.commands.setContent(value);
			}

			hydrated = true;
		}
	});

	let prev = '';

	completion.subscribe((value) => {
		if (value) {
			const diff = value.slice(prev.length);
			prev = value;
			editor?.commands.insertContent(diff);
		}
	});

	onMount(() => {
		editor = new Editor({
			element: element,
			onTransaction: (props) => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			extensions: [...defaultExtensions],
			editorProps: {
				...defaultEditorProps,
				...editorProps
			},
			onUpdate: (e) => {
				const selection = e.editor.state.selection;
				const lastTwo = getPrevText(e.editor, {
					chars: 2
				});
				if (lastTwo === '++' && !$isLoading) {
					e.editor.commands.deleteRange({
						from: selection.from - 2,
						to: selection.from
					});
					complete(
						getPrevText(e.editor, {
							chars: 5000
						})
					);
					// complete(e.editor.storage.markdown.getMarkdown());
				} else {
					// onUpdate(e.editor);
					// debouncedUpdates(e);
				}
			},
			autofocus: 'end'
		});
	});
</script>

{#if editor && editor.isEditable}
	<EditorBubbleMenu {editor} />
{/if}

<div id="editor" class={className} bind:this={element}>
	<slot />

	{#if editor?.isActive('image')}
		<ImageResizer {editor} />
	{/if}

	{#if $isLoading}
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
</style>
