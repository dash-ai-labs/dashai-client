<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	interface Props {
		active?: boolean;
		icon?: SvelteComponent;
		path?: string;
		handleNavigation?: any;
		children?: import('svelte').Snippet;
		isCollapsed?: boolean;
	}

	let {
		active = false,
		icon = null,
		path = null,
		handleNavigation = (path: string) => {},
		children,
		isCollapsed = false
	}: Props = $props();
</script>

<button
	on:click={() => handleNavigation(path)}
	class="sidebar-button {active ? 'active' : 'inactive'} {isCollapsed ? 'collapsed' : ''}"
>
	{#if icon}
		<!-- svelte-ignore svelte_component_deprecated -->
		<svelte:component this={icon} class="button-content" size={28} />
	{/if}
	{#if !isCollapsed}
		<div class="button-content {active ? 'content-active' : 'content-inactive'}">
			{@render children?.()}
		</div>
	{/if}
</button>

<style>
	.sidebar-button {
		display: flex;
		height: 56px;
		width: 100%;
		flex-direction: row;
		align-items: center;
		border-radius: 4px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.collapsed {
		padding-left: 0px;
		padding-right: 0px;
		justify-content: center;
		justify-self: center;
		height: 40px;
	}

	.sidebar-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.active {
		color: var(--color-secondary-active-button);
	}

	.inactive {
		color: var(--color-secondary-inactive-button-highlight);
	}

	:global(.icon-active) {
		fill: var(--color-secondary-active-button-highlight);
	}

	:global(.icon-inactive) {
		fill: var(--color-secondary-inactive-button-highlight);
	}

	.button-content {
		text-align: center;
		align-self: center;
		padding-left: 10px;
		padding-right: 10px;
		font-size: 14px;
		width: 100%;
	}

	.content-active {
		color: var(--color-secondary-active-button);
	}

	.content-inactive {
		color: var(--color-secondary-inactive-button-highlight);
	}
</style>
