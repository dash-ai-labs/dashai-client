<script lang="ts" context="module">
	export interface BubbleMenuItem {
		name: string;
		isActive: () => boolean;
		command: () => void;
		icon: any;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Editor } from '@tiptap/core';
	import {
		IconBold,
		IconCode,
		IconItalic,
		IconStrikethrough,
		IconUnderline
	} from '@tabler/icons-svelte';
	import { writable } from 'svelte/store';
	import ColorSelector from './color-selector.svelte';
	import LinkSelector from './link-selector.svelte';
	import NodeSelector from './node-selector.svelte';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onDestroy, onMount } from 'svelte';

	let element: HTMLElement;

	let isNodeSelectorOpen = writable(false);
	let isColorSelectorOpen = writable(false);
	let isLinkSelectorOpen = writable(false);

	export let editor: Editor;
	export let tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		onHidden: () => {
			isNodeSelectorOpen.set(false);
			isColorSelectorOpen.set(false);
			isLinkSelectorOpen.set(false);
		}
	};
	export let pluginKey: BubbleMenuPluginProps['pluginKey'] = 'SvelteTiptapBubbleMenu';
	export let shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor }) => {
		// don't show if image is selected
		if (editor.isActive('image')) {
			return false;
		}
		return editor.view.state.selection.content().size > 0;
	};
	export let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	const items: BubbleMenuItem[] = [
		{
			name: 'bold',
			isActive: () => editor.isActive('bold'),
			command: () => editor.chain().focus().toggleBold().run(),
			icon: IconBold
		},
		{
			name: 'italic',
			isActive: () => editor.isActive('italic'),
			command: () => editor.chain().focus().toggleItalic().run(),
			icon: IconItalic
		},
		{
			name: 'underline',
			isActive: () => editor.isActive('underline'),
			command: () => editor.chain().focus().toggleUnderline().run(),
			icon: IconUnderline
		},
		{
			name: 'strike',
			isActive: () => editor.isActive('strike'),
			command: () => editor.chain().focus().toggleStrike().run(),
			icon: IconStrikethrough
		},
		{
			name: 'code',
			isActive: () => editor.isActive('code'),
			command: () => editor.chain().focus().toggleCode().run(),
			icon: IconCode
		}
	];

	const reset = () => {
		isNodeSelectorOpen.set(false);
		isColorSelectorOpen.set(false);
		isLinkSelectorOpen.set(false);
	};

	$: if (!$isNodeSelectorOpen) {
		reset();
	}

	$: if (!$isColorSelectorOpen) {
		reset();
	}

	$: if (!$isLinkSelectorOpen) {
		reset();
	}

	if (!editor) {
		throw new Error('Missing editor instance.');
	}

	onMount(() => {
		const plugin = BubbleMenuPlugin({
			pluginKey,
			editor,
			element,
			tippyOptions,
			shouldShow,
			updateDelay
		});

		editor.registerPlugin(plugin);
	});

	onDestroy(() => {
		editor.unregisterPlugin(pluginKey);
	});
</script>

<div bind:this={element} class="bubble-menu">
	<LinkSelector {editor} bind:isOpen={$isLinkSelectorOpen} />
	<div class="button-group">
		{#each items as item, index}
			<button on:click={item.command} class="format-button" type="button">
				<svelte:component this={item.icon} class="format-icon" active={item.isActive()} />
			</button>
		{/each}
	</div>
</div>

<style>
	.bubble-menu {
		display: flex;
		height: 3rem;
		width: fit-content;
		border: 1px solid rgb(231 229 228);
		border-radius: 0.25rem;
		background-color: var(--color-primary-black);
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
	}

	.button-group {
		display: flex;
		border-left: 1px solid rgb(231 229 228);
	}

	.format-button {
		padding: 0.5rem;
		color: var(--color-font-light-gray);
	}

	.format-button:hover {
		background-color: var(--color-primary-gray);
	}

	.format-button:active {
		background-color: var(--color-primary-gray);
	}

	.format-icon {
		height: 1rem;
		width: 1rem;
	}

	.format-icon.active {
		color: rgb(59 130 246);
	}
</style>
