<script lang="ts">
	import { page } from '$app/stores';
	import SelectedInbox from '$lib/assets/Inbox.svelte';
	import SelectedFinance from '$lib/assets/Finance.svelte';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import '@material/web/button/filled-tonal-button';
	import '@material/web/button/text-button';
	import '@material/web/icon/icon';

	export let handleNavigation = (path: string) => {};
	const navItems = [
		{
			label: 'Inbox',
			path: '/inbox',
			badge: 24,
			icon: SelectedInbox
		},
		{
			label: 'Finance',
			path: '/finance',
			icon: SelectedFinance
		}
	];

	$: navDrawerClasses = `
        flex 
        flex-col 
        items-start 
        p-3 
        w-[180px] 
        h-full 
        bg-secondary-container
        rounded-[16px]
    `;

	$: isActive = (path: string) => $page.url.pathname === path;
</script>

<div class={navDrawerClasses}>
	<div class={'h-[60px] p-[16px] text-font-gray'}>Dash AI</div>
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
