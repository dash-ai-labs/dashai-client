<script lang="ts">
	import { page } from '$app/stores';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import '@material/web/button/filled-tonal-button';
	import '@material/web/button/text-button';
	import '@material/web/icon/icon';
	import LogoutButton from './LogoutButton.svelte';
	import Logo from '$lib/assets/Logo.svelte';
	import { Inbox } from 'lucide-svelte';

	let { handleNavigation = (path: string) => {} } = $props();
	const navItems = [
		{
			label: 'Inbox',
			path: '/inbox',
			badge: 24,
			icon: Inbox
		}
		// {
		//   label: "Finance",
		//   path: "/finance",
		//   icon: SelectedFinance,
		// },
	];

	let isActive = $derived((path: string) => $page.url.pathname === path);
</script>

<div class="nav-drawer">
	<Logo class="logo" />
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
		padding-left: 0.75rem; /* px-3 */
		padding-right: 0.75rem; /* px-3 */
		width: 180px; /* w-[180px] */
		background-color: var(--color-secondary-container); /* bg-secondary-container */
		border-radius: 16px; /* rounded-[16px] */
		margin-top: 0.5rem; /* my-2 */
		margin-bottom: 0.5rem; /* my-2 */
	}

	:global(.logo) {
		fill: var(--color-primary-gray); /* fill-primary-gray */
	}

	.logout-container {
		margin-bottom: 0.5rem; /* mb-2 */
		margin-top: auto; /* mt-auto */
		display: flex; /* flex */
		align-self: center; /* self-center */
	}
</style>
