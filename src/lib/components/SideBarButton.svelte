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
		height: 48px;
		width: 100%;
		flex-direction: row;
		align-items: center;
		border-radius: 8px;
		padding: 0 16px;
		margin: 2px 0;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
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
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateX(2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.active {
		color: var(--color-secondary-active-button);
		background-color: var(--color-primary-dark-gray);
		border-color: var(--color-secondary-active-button);
		box-shadow: 0 0 0 1px rgba(139, 69, 19, 0.2);
	}

	.inactive {
		color: var(--color-secondary-inactive-button-highlight);
		transition: color 0.2s ease;
	}

	:global(.icon-active) {
		fill: var(--color-secondary-active-button-highlight);
	}

	:global(.icon-inactive) {
		fill: var(--color-secondary-inactive-button-highlight);
	}

	.button-content {
		align-self: center;
		padding-left: 12px;
		font-size: 14px;
		font-weight: 500;
		width: 100%;
		text-align: left;
		transition: all 0.2s ease;
	}

	.content-active {
		color: var(--color-secondary-active-button);
	}

	.content-inactive {
		color: var(--color-secondary-inactive-button-highlight);
	}
</style>
