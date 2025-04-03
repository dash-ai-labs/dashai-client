<script lang="ts">
	import { page } from '$app/stores';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import '@material/web/button/filled-tonal-button';
	import '@material/web/button/text-button';
	import '@material/web/icon/icon';
	import LogoutButton from './LogoutButton.svelte';
	import Logo from '$lib/assets/Logo.svelte';
	import { IconInbox, IconLayoutSidebarLeftCollapse } from '@tabler/icons-svelte';
	let { handleNavigation = (path: string) => {} } = $props();
	const navItems = [
		{
			label: 'Inbox',
			path: '/inbox',
			badge: 24,
			icon: IconInbox
		}
	];

	let isActive = $derived((path: string) => $page.url.pathname === path);
</script>

<div class="nav-drawer">
	<div class="nav-drawer-header">
		<Logo class="logo" />
		<IconLayoutSidebarLeftCollapse class="collapse-icon" />
	</div>
	<div>
		{#each navItems as item}
			<SideBarButton
				{handleNavigation}
				path={item.path}
				active={isActive(item.path)}
				icon={item.icon}
			>
				{item.label}</SideBarButton
			>
		{/each}
	</div>
	<div class="logout-container">
		<LogoutButton />
	</div>
</div>

<style>
	.nav-drawer {
		display: flex;
		flex-direction: column;
		align-items: flex-center;
		padding-left: 0.25rem; /* px-3 */
		padding-right: 0.25rem; /* px-3 */
		width: 200px; /* w-[180px] */
		background-color: var(--color-secondary-container); /* bg-secondary-container */
	}

	.nav-drawer-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.logo {
		fill: '#222C50'; /* fill-primary-gray */
		padding: 0.5rem;
	}

	.collapse-icon {
		fill: '#222C50'; /* fill-primary-gray */
		padding: 0.5rem;
	}

	.logout-container {
		margin-bottom: 0.5rem; /* mb-2 */
		margin-top: auto; /* mt-auto */
		display: flex; /* flex */
		align-self: center; /* self-center */
	}
</style>
