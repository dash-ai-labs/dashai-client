<script lang="ts">
	import Power from '$lib/assets/Power.svelte';
	import { handleLogout } from '$lib/actions/user';

	let { isCollapsed } = $props();
</script>

<div class="logout-container">
	<button class="logout-button {isCollapsed ? 'collapsed' : ''}" on:click={handleLogout}>
		<Power fill="text-font-gray" />
		{#if !isCollapsed}
			Logout
		{/if}
	</button>
</div>

<style>
	.logout-container {
		margin-left: auto;
		margin-right: auto;
		display: flex;
		justify-content: center;
	}

	.logout-button {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 0.5rem;
		border-radius: 0.25rem;
		padding-inline: 20px;
		padding-block: 10px;
		text-align: left;
		color: var(--color-font-gray);
		width: 200px;
		margin-block: 4px;
	}

	.logout-button.collapsed {
		padding: 4px;
		justify-content: center;
		width: 40px;
	}

	.logout-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
