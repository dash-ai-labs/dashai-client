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

<div class="container">
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
		class="link-button"
		class:active={editor.isActive('link')}
		type="button"
	>
		<IconLink class="link-icon" />
	</button>

	<Dropdown placement="bottom" triggeredBy={buttonElement} class="dropdown">
		<div class="dropdown-content">
			<div class="input-container">
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
			<div class="button-container">
				<button onclick={applyLink} class="apply-button" type="button"> Apply </button>
				{#if editor.isActive('link')}
					<button
						onclick={() => {
							editor.chain().focus().extendMarkRange('link').unsetLink().run();
							dropdownOpen = false;
							isOpen = false;
						}}
						class="remove-button"
						type="button"
					>
						<IconLinkOff class="remove-icon" />
						<span>Remove</span>
					</button>
				{/if}
			</div>
		</div>
	</Dropdown>
</div>

<style>
	.container {
		position: relative;
		height: 100%;
	}

	.link-button {
		display: flex;
		height: 100%;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		color: var(--color-font-light-gray);
	}

	.link-button:hover {
		background-color: var(--color-primary-gray);
	}

	.link-button:active {
		background-color: var(--color-primary-gray);
	}

	.link-button.active {
		color: rgb(59 130 246);
	}

	.link-icon {
		height: 1rem;
		width: 1rem;
	}

	.dropdown {
		z-index: 99999;
		width: 20rem;
		border-radius: 0.375rem;
		padding: 0.25rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
	}

	.dropdown-content {
		padding: 0.5rem;
	}

	.input-container {
		margin-bottom: 0.5rem;
	}

	.button-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.apply-button {
		flex: 1;
		border-radius: 0.25rem;
		background-color: rgb(59 130 246);
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		color: white;
	}

	.apply-button:hover {
		background-color: rgb(37 99 235);
	}

	.remove-button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		color: rgb(239 68 68);
	}

	.remove-button:hover {
		background-color: rgb(254 226 226);
	}

	.remove-icon {
		height: 0.75rem;
		width: 0.75rem;
	}
</style>
