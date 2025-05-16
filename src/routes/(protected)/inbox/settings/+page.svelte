<script lang="ts">
	import { onMount } from 'svelte';
	import { emailServiceState } from '$lib/store';
	import AccountSettings from './account/+page.svelte';
	import EmailPreferences from './email-preferences/+page.svelte';
	import ComposePreferences from './compose-preferences/+page.svelte';
	const settingsNav = [
		// {
		// 	label: 'Primary Preferences'
		// },
		// {
		// 	label: 'Notifications'
		// },
		{
			label: 'Compose Preferences',
			component: ComposePreferences
		},
		{
			label: 'Email Preferences',
			component: EmailPreferences
		},
		{
			label: 'Account',
			component: AccountSettings
		}
	];
	let currentNavItem = $state(settingsNav[0]);

	onMount(() => {
		emailServiceState.update((state) => ({
			...state,
			showEmailHeader: false
		}));
	});
</script>

<div class="settings-detail-container">
	<div class="settings-nav">
		{#each settingsNav as navItem}
			<div
				class={`settings-nav-item ${currentNavItem.label === navItem.label ? 'active' : ''}`}
				onclick={() => (currentNavItem = navItem)}
			>
				{navItem.label}
			</div>
		{/each}
	</div>
	<div class="settings-detail">
		<svelte:component this={currentNavItem.component} />
	</div>
</div>

<style>
	.settings-detail-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 10px;
	}
	.settings-nav {
		display: flex;
		flex-direction: row;
		gap: 14px;
		margin-top: 20px;
	}
	.settings-nav-item {
		padding-block: 8px;
		padding-inline: 14px;
		border-radius: 8px;
		cursor: pointer;
		color: var(--color-primary-gray);
	}
	.settings-nav-item.active {
		background-color: var(--color-primary-light-container);
		border: 1px solid var(--color-primary-dark-gray);
		color: var(--color-primary-white);
	}
	.settings-nav-item:hover {
		background-color: var(--color-primary-gray);
	}
</style>
