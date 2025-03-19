<script lang="ts" context="module">
	export interface BubbleColorMenuItem {
		name: string;
		color: string;
	}
</script>

<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { IconCheck, IconChevronDown } from '@tabler/icons-svelte';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	let { editor, isOpen = $bindable() } = $props();

	let activeColorItem: BubbleColorMenuItem | null = null;
	let activeHighlightItem: BubbleColorMenuItem | null = null;
	let buttonElement;

	const TEXT_COLORS: BubbleColorMenuItem[] = [
		{
			name: 'Default',
			color: 'var(--novel-black)'
		},
		{
			name: 'Purple',
			color: '#9333EA'
		},
		{
			name: 'Red',
			color: '#E00000'
		},
		{
			name: 'Yellow',
			color: '#EAB308'
		},
		{
			name: 'Blue',
			color: '#2563EB'
		},
		{
			name: 'Green',
			color: '#008A00'
		},
		{
			name: 'Orange',
			color: '#FFA500'
		},
		{
			name: 'Pink',
			color: '#BA4081'
		},
		{
			name: 'Gray',
			color: '#A8A29E'
		}
	];

	const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
		{
			name: 'Default',
			color: 'var(--novel-highlight-default)'
		},
		{
			name: 'Purple',
			color: 'var(--novel-highlight-purple)'
		},
		{
			name: 'Red',
			color: 'var(--novel-highlight-red)'
		},
		{
			name: 'Yellow',
			color: 'var(--novel-highlight-yellow)'
		},
		{
			name: 'Blue',
			color: 'var(--novel-highlight-blue)'
		},
		{
			name: 'Green',
			color: 'var(--novel-highlight-green)'
		},
		{
			name: 'Orange',
			color: 'var(--novel-highlight-orange)'
		},
		{
			name: 'Pink',
			color: 'var(--novel-highlight-pink)'
		},
		{
			name: 'Gray',
			color: 'var(--novel-highlight-gray)'
		}
	];

	// Use reactive statement to track the active color
	$effect(() => {
		activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive('textStyle', { color }));
	});

	// Use reactive statement to track the active highlight
	$effect(() => {
		activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
			editor.isActive('highlight', { color })
		);
	});

	let dropdownOpen = false;
</script>

<div class="color-selector">
	<button
		type="button"
		bind:this={buttonElement}
		onclick={() => {
			dropdownOpen = !dropdownOpen;
			isOpen = !isOpen;
		}}
		class="color-button"
	>
		<span
			class="color-preview"
			style:color={activeColorItem?.color}
			style:background-color={activeHighlightItem?.color}
		>
			A
		</span>

		<IconChevronDown class="icon" />
	</button>

	<Dropdown placement="bottom" triggeredBy={buttonElement} class="color-dropdown">
		<div class="section-label">Color</div>
		{#each TEXT_COLORS as { name, color }, index}
			<DropdownItem
				on:click={() => {
					editor.commands.unsetColor();
					name !== 'Default' &&
						editor
							.chain()
							.focus()
							.setColor(color || '')
							.run();
					dropdownOpen = false;
					isOpen = false;
				}}
				class="dropdown-item"
			>
				<div class="item-content">
					<div class="color-sample" style:color>A</div>
					<span>{name}</span>
				</div>
				{#if editor.isActive('textStyle', { color })}
					<IconCheck class="icon" />
				{/if}
			</DropdownItem>
		{/each}

		<div class="section-label background">Background</div>

		{#each HIGHLIGHT_COLORS as { name, color }, index}
			<DropdownItem
				on:click={() => {
					editor.commands.unsetHighlight();
					name !== 'Default' && editor.commands.setHighlight({ color });
					dropdownOpen = false;
					isOpen = false;
				}}
				class="dropdown-item"
			>
				<div class="item-content">
					<div class="color-sample" style:background-color={color}>A</div>
					<span>{name}</span>
				</div>
				{#if editor.isActive('highlight', { color })}
					<IconCheck class="icon" />
				{/if}
			</DropdownItem>
		{/each}
	</Dropdown>
</div>

<style>
	.color-selector {
		position: relative;
		height: 100%;
	}

	.color-button {
		display: flex;
		height: 100%;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-font-light-gray);
	}

	.color-button:hover {
		background-color: var(--color-primary-gray);
	}

	.color-button:active {
		background-color: var(--color-primary-gray);
	}

	.color-preview {
		border-radius: 0.125rem;
		padding: 0 0.25rem;
	}

	.icon {
		height: 1rem;
		width: 1rem;
	}

	.color-dropdown {
		z-index: 99999;
		width: 12rem;
		border-radius: 0.375rem;
		padding: 0.25rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
	}

	.section-label {
		margin: 0.25rem 0;
		padding: 0 0.5rem;
		font-size: 0.875rem;
		color: var(--color-font-light-gray);
	}

	.section-label.background {
		margin: 0.5rem 0 0.25rem;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		color: var(--color-font-light-gray);
	}

	.dropdown-item:hover {
		background-color: var(--color-primary-gray);
	}

	.dropdown-item:active {
		background-color: var(--color-primary-gray);
	}

	.item-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.color-sample {
		border-radius: 0.125rem;
		border: 1px solid #e5e7eb;
		padding: 0 0.25rem;
		font-weight: 500;
	}
</style>
