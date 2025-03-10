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
	<div class="relative h-full">
		<button
			bind:this={buttonElement}
			onclick={() => (dropdownOpen = !dropdownOpen)}
			class="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
			type="button"
		>
			<span>{activeItem?.name}</span>
			<IconChevronDown class="h-4 w-4" />
		</button>

		<Dropdown
			placement="bottom"
			triggeredBy={buttonElement}
			class="z-[99999] w-48 rounded-md p-1 shadow-lg"
		>
			{#each items as item, index}
				<DropdownItem
					on:click={() => {
						item.command();
						dropdownOpen = false;
						isOpen = false;
					}}
					class="flex items-center justify-between px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
				>
					<div class="flex items-center space-x-2">
						<div class="rounded-sm border border-stone-200 p-1">
							<svelte:component this={item.icon} class="h-3 w-3" />
						</div>
						<span>{item.name}</span>
					</div>
					{#if activeItem.name === item.name}
						<IconCheck class="h-4 w-4" />
					{/if}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
</div>
