<script lang="ts">
	import {
		IconCheck,
		IconChevronDown,
		IconH1,
		IconH2,
		IconH3,
		IconQuote,
		IconListNumbers,
		IconLetterT,
		IconCode,
		IconSquareCheck
	} from '@tabler/icons-svelte';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	let { editor, isOpen = $bindable() } = $props();
	let dropdownOpen = false;
	let buttonElement;

	$effect(() => {
		dropdownOpen = isOpen;
	});

	$effect(() => {
		isOpen = dropdownOpen;
	});

	const items = $derived([
		{
			name: 'Text',
			icon: IconLetterT,
			command: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
			isActive:
				editor.isActive('paragraph') &&
				!editor.isActive('bulletList') &&
				!editor.isActive('orderedList')
		},
		{
			name: 'Heading 1',
			icon: IconH1,
			command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: editor.isActive('heading', { level: 1 })
		},
		{
			name: 'Heading 2',
			icon: IconH2,
			command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: editor.isActive('heading', { level: 2 })
		},
		{
			name: 'Heading 3',
			icon: IconH3,
			command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: editor.isActive('heading', { level: 3 })
		},
		{
			name: 'To-do List',
			icon: IconSquareCheck,
			command: () => editor.chain().focus().toggleTaskList().run(),
			isActive: editor.isActive('taskItem')
		},
		{
			name: 'Bullet List',
			icon: IconListNumbers,
			command: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive('bulletList')
		},
		{
			name: 'Numbered List',
			icon: IconListNumbers,
			command: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive('orderedList')
		},
		{
			name: 'Quote',
			icon: IconQuote,
			command: () =>
				editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
			isActive: editor.isActive('blockquote')
		},
		{
			name: 'Code',
			icon: IconCode,
			command: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: editor.isActive('codeBlock')
		}
	]);

	const activeItem = $derived(
		items.filter((item) => item.isActive).pop() ?? {
			name: 'Multiple'
		}
	);
</script>

<div>
	<div class="menu-container relative">
		<button
			bind:this={buttonElement}
			onclick={() => (dropdownOpen = !dropdownOpen)}
			class="menu-button"
			type="button"
		>
			<span>{activeItem?.name}</span>
			<IconChevronDown class="chevron-icon" />
		</button>

		<Dropdown placement="bottom" triggeredBy={buttonElement} class="dropdown">
			{#each items as item, index}
				<DropdownItem
					on:click={() => {
						item.command();
						dropdownOpen = false;
						isOpen = false;
					}}
					class="dropdown-item"
				>
					<div class="item-content">
						<div class="icon-container">
							<svelte:component this={item.icon} class="icon" />
						</div>
						<span>{item.name}</span>
					</div>
					{#if activeItem.name === item.name}
						<IconCheck class="check-icon" />
					{/if}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
</div>

<style>
	.menu-container {
		height: 100%;
		background-color: var(--color-primary-black);
		color: var(--color-font-light-gray);
	}

	.menu-button {
		display: flex;
		height: 100%;
		align-items: center;
		gap: 0.25rem;
		white-space: nowrap;
		padding: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-font-light-gray);
	}

	.menu-button:hover {
		background-color: rgb(245 245 244);
	}

	.menu-button:active {
		background-color: rgb(231 229 228);
	}

	.chevron-icon {
		height: 1rem;
		width: 1rem;
	}

	.dropdown {
		z-index: 99999;
		width: 12rem;
		border-radius: 0.375rem;
		background-color: var(--color-primary-black);
		padding: 0.25rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
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
		background-color: rgb(245 245 244);
	}

	.item-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-container {
		border-radius: 0.125rem;
		border: 1px solid rgb(231 229 228);
		padding: 0.25rem;
	}

	.icon {
		height: 0.75rem;
		width: 0.75rem;
	}

	.check-icon {
		height: 1rem;
		width: 1rem;
	}
</style>
