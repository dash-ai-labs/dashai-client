<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let active: boolean = false;
	export let icon: SvelteComponent = null;
	export let path: string = null;
	export let handleNavigation = (path: string) => {};
</script>

<button
	on:click={() => handleNavigation(path)}
	class={`flex h-[56px] w-full flex-row items-center rounded-full px-[20px] ${
		active ? 'bg-secondary-active-button-background' : 'bg-secondary-container'
	}`}
>
	{#if icon}
		<svelte:component
			this={icon}
			fill={active
				? 'fill-secondary-active-button-highlight'
				: 'fill-secondary-inactive-button-highlight'}
		/>
	{/if}
	<div
		class={`mx-[16px] text-center ${
			active ? 'text-secondary-active-button-highlight' : 'text-secondary-inactive-button-highlight'
		}`}
	>
		<slot />
	</div>
</button>
