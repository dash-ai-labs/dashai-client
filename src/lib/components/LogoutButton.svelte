<script lang="ts">
	import { goto } from '$app/navigation';
	import Power from '$lib/assets/Power.svelte';
	import {
		user,
		emailAccount,
		emailList,
		emailServiceState,
		emailLabels,
		emailSearchList
	} from '$lib/store';

	let { isCollapsed } = $props();
	const handleLogout = async () => {
		// First, clear or reset all stores with proper initial values
		// Using empty arrays instead of null where expected
		emailList.set([]);
		emailLabels.set([]);
		emailSearchList.set([]);
		emailAccount.set({ email: 'All Emails' });
		emailServiceState.set({});
		// Wait a small amount to allow store updates to propagate
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Clear localStorage to prevent stale data
		if (typeof window !== 'undefined') {
			localStorage.clear();
		}

		// Finally set user to null (this might trigger components to reset)
		user.set(null);

		// Small delay before navigation to ensure store changes have propagated
		setTimeout(() => {
			goto('/auth');
		}, 10);
	};
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
		width: 160px;
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
