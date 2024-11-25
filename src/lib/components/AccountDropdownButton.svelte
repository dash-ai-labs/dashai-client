<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let icon: string;
	export let selected: boolean = false;
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click'); // Forward the click event
	}
</script>

<div
	on:click={handleClick}
	class="flex h-[42px] w-full flex-row px-1 py-[6px] hover:cursor-pointer {selected
		? 'bg-secondary-active-button-background text-primary-active-button-highlight hover:bg-secondary-active-button-background-hover'
		: 'hover:bg-secondary-active-button-background'}"
>
	<img src={icon} alt={label} class="h-6 w-6 rounded-full" />
	<p class="ml-2 self-center">{label}</p>
</div>
