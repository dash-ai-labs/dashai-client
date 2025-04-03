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
	on:click={() => handleNavigation(path)}
	class="sidebar-button {active ? 'active' : 'inactive'}"
>
	{#if icon}
		<!-- svelte-ignore svelte_component_deprecated -->
		<svelte:component this={icon} class="button-content" size={24} />
	{/if}
	<div class="button-content {active ? 'content-active' : 'content-inactive'}">
		{@render children?.()}
	</div>
</button>

<style>
	.sidebar-button {
		display: flex;
		height: 56px;
		width: 100%;
		flex-direction: row;
		align-items: center;
		border-radius: 9999px; /* rounded-full */
		padding-left: 20px;
		padding-right: 20px;
	}

	.sidebar-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.active {
		color: var(--color-primary-button);
	}

	.inactive {
		color: var(--color-secondary-container);
	}

	:global(.icon-active) {
		fill: var(--color-secondary-active-button-highlight);
	}

	:global(.icon-inactive) {
		fill: var(--color-secondary-inactive-button-highlight);
	}

	.button-content {
		margin-left: 10px;
		margin-right: 10px;
		text-align: center;
		align-content: center;
	}

	.content-active {
		color: var(--color-primary-button);
	}

	.content-inactive {
		color: var(--color-secondary-inactive-button-highlight);
	}
</style>
