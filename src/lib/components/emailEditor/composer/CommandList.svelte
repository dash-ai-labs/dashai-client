<script lang="ts">
	const { items, command, editor }: { items: any; command: any; editor: any } = $props();

	let selectedIndex = $state(0);

	// Reset selectedIndex when items change
	$effect(() => {
		console.log('items', items);
		if (items) {
			selectedIndex = 0;
		}
	});

	function onKeyDown({ event }: { event: KeyboardEvent }) {
		if (event.key === 'ArrowUp') {
			upHandler();
			return true;
		}

		if (event.key === 'ArrowDown') {
			downHandler();
			return true;
		}

		if (event.key === 'Enter') {
			enterHandler();
			return true;
		}

		return false;
	}

	function upHandler() {
		selectedIndex = (selectedIndex + items.length - 1) % items.length;
	}

	function downHandler() {
		selectedIndex = (selectedIndex + 1) % items.length;
	}

	function enterHandler() {
		selectItem(selectedIndex);
	}

	function selectItem(index: number) {
		const item = items[index];

		if (item) {
			command(item);
		}
	}
</script>

<div class="dropdown-menu">
	{#if items.length}
		{#each items as item, index}
			<button class:is-selected={index === selectedIndex} on:click={() => selectItem(index)}>
				{item.title}
			</button>
		{/each}
	{:else}
		<div class="item">No result</div>
	{/if}
</div>

<style>
	/* Dropdown menu */
	.dropdown-menu {
		background: var(--white);
		border: 1px solid var(--gray-1);
		border-radius: 0.7rem;
		box-shadow: var(--shadow);
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		overflow: auto;
		padding: 0.4rem;
		position: relative;
	}

	button {
		align-items: center;
		background-color: transparent;
		display: flex;
		gap: 0.25rem;
		text-align: left;
		width: 100%;
	}

	button:hover,
	button:hover.is-selected {
		background-color: var(--gray-3);
	}

	button.is-selected {
		background-color: var(--gray-2);
	}
</style>
