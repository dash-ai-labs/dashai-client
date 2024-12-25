<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	interface Props {
		active?: boolean;
		icon?: SvelteComponent;
		path?: string;
		handleNavigation?: any;
		children?: import('svelte').Snippet;
	}

	let {
		active = false,
		icon = null,
		path = null,
		handleNavigation = (path: string) => {},
		children
	}: Props = $props();
</script>

<button
	onclick={() => handleNavigation(path)}
	class={`flex h-[56px] w-full flex-row items-center rounded-full px-[20px] ${
		active ? 'bg-secondary-active-button-background' : 'bg-secondary-container'
	}`}
>
	{#if icon}
		{@const SvelteComponent_1 = icon}
		<SvelteComponent_1
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
		{@render children?.()}
	</div>
</button>
