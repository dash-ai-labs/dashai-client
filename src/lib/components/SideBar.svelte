<script lang="ts">
	import { page } from '$app/stores';
	import SelectedInbox from '$lib/assets/Inbox.svelte';
	import SelectedFinance from '$lib/assets/Finance.svelte';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import '@material/web/button/filled-tonal-button';
	import '@material/web/button/text-button';
	import '@material/web/icon/icon';
	import LogoutButton from './LogoutButton.svelte';
	import Logo from '$lib/assets/Logo.svelte';

	let { handleNavigation = (path: string) => {} } = $props();
	const navItems = [
		{
			label: 'Inbox',
			path: '/inbox',
			badge: 24,
			icon: SelectedInbox
		}
		// {
		//   label: "Finance",
		//   path: "/finance",
		//   icon: SelectedFinance,
		// },
	];

	let navDrawerClasses = $derived(
		`flex flex-col items-start px-3 w-[180px] bg-secondary-container rounded-[16px] my-2`
	);

	let isActive = $derived((path: string) => $page.url.pathname === path);
</script>

<div class={navDrawerClasses}>
	<Logo color="fill-primary-gray" />
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
	<div class="mb-2 mt-auto flex self-center">
		<LogoutButton />
	</div>
</div>
