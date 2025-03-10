<script lang="ts">
	import { IconLink, IconLinkOff } from '@tabler/icons-svelte';
	import type { Editor } from '@tiptap/core';
	import { Dropdown, DropdownItem, Input } from 'flowbite-svelte';

	let { editor, isOpen = $bindable() } = $props();
	let dropdownOpen = false;
	let url = '';
	let buttonElement;

	$effect(() => {
		dropdownOpen = isOpen;
	});

	$effect(() => {
		isOpen = dropdownOpen;
	});

	$effect(() => {
		// Update the URL field when the editor selection changes
		if (editor && editor.isActive('link')) {
			url = editor.getAttributes('link').href;
		}
	});

	function applyLink() {
		if (!url) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
		} else {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: validateUrl(url) })
				.run();
		}
		dropdownOpen = false;
		isOpen = false;
	}

	function validateUrl(url: string) {
		// Add https:// prefix if no protocol is specified
		if (!/^https?:\/\//i.test(url)) {
			return `https://${url}`;
		}
		return url;
	}
</script>

<div class="relative h-full">
	<button
		bind:this={buttonElement}
		onclick={() => {
			dropdownOpen = !dropdownOpen;
			if (editor.isActive('link')) {
				url = editor.getAttributes('link').href;
			} else {
				url = '';
			}
		}}
		class="flex h-full items-center gap-1 p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
		class:text-blue-500={editor.isActive('link')}
		type="button"
	>
		<IconLink class="h-4 w-4" />
	</button>

	<Dropdown
		placement="bottom"
		triggeredBy={buttonElement}
		class="z-[99999] w-80 rounded-md p-1 shadow-lg"
	>
		<div class="p-2">
			<div class="mb-2">
				<Input
					type="url"
					placeholder="Paste link"
					bind:value={url}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							applyLink();
						}
					}}
				/>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={applyLink}
					class="flex-1 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
					type="button"
				>
					Apply
				</button>
				{#if editor.isActive('link')}
					<button
						onclick={() => {
							editor.chain().focus().extendMarkRange('link').unsetLink().run();
							dropdownOpen = false;
							isOpen = false;
						}}
						class="flex items-center gap-1 rounded px-2 py-1 text-sm text-red-500 hover:bg-red-100"
						type="button"
					>
						<IconLinkOff class="h-3 w-3" />
						<span>Remove</span>
					</button>
				{/if}
			</div>
		</div>
	</Dropdown>
</div>
