<script lang="ts">
	import { page } from '$app/stores';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import '@material/web/button/filled-tonal-button';
	import '@material/web/button/text-button';
	import '@material/web/icon/icon';
	import LogoutButton from './LogoutButton.svelte';
	import Logo from '$lib/assets/Logo.svelte';
	import {
		IconInbox,
		IconLayoutSidebarLeftCollapse,
		IconFile,
		IconSend2,
		IconTrashX,
		IconLabelFilled,
		IconPlus,
		IconDotsVertical,
		IconLayoutSidebarRightCollapse,
		IconSettings
	} from '@tabler/icons-svelte';
	import { emailServiceState, user } from '$lib/store';
	import { EmailFolder, type EmailServiceState, type Label } from '$lib/types';
	import EditEmailLabel from './labelEditor/EditEmailLabel.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import AddEmailLabel from './AddEmailLabel.svelte';
	import ComposeEmailButton from './ComposeEmailButton.svelte';
	import NewEmailLabelComponent from './NewEmailLabelComponent.svelte';
	import { getEmailFolderCount } from '$lib/api/email';
	import { get } from 'svelte/store';

	let { handleNavigation = (path: string) => {} } = $props();

	let inboxCount = $state(0);
	let draftsCount = $state(0);
	let sentCount = $state(0);
	let trashCount = $state(0);
	const user_id = $derived(get(user)?.id?.toString());

	const getFolderCount = async (folder: EmailFolder) => {
		if (!get(user)?.id) return 0;
		return await getEmailFolderCount({ user: user_id, folder });
	};

	// Load counts when component initializes
	$effect(() => {
		if (get(user)?.id) {
			getFolderCount(EmailFolder.INBOX).then((count) => (inboxCount = count));
			getFolderCount(EmailFolder.DRAFTS).then((count) => (draftsCount = count));
			getFolderCount(EmailFolder.SENT).then((count) => (sentCount = count));
			getFolderCount(EmailFolder.TRASH).then((count) => (trashCount = count));
		}
	});

	let navItems = $derived([
		{
			label: 'Inbox',
			path: '/inbox',
			badge: 20,
			icon: IconInbox,
			count: inboxCount
		},
		{
			label: 'Drafts',
			path: '/inbox/drafts',
			badge: 20,
			icon: IconFile,
			count: draftsCount
		},
		{
			label: 'Sent',
			path: '/inbox/sent',
			badge: 20,
			icon: IconSend2,
			count: sentCount
		},
		{
			label: 'Trash',
			path: '/inbox/trash',
			badge: 20,
			icon: IconTrashX,
			count: trashCount
		}
	]);

	let isActive = $derived((path: string) => $page.url.pathname === path);
	let isCollapsed = $state(false);

	let email_labels: Label[] = $state([]);

	emailServiceState.subscribe((state: EmailServiceState) => {
		email_labels = state.emailLabels;
	});

	const addLabelPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'addLabelPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
		closeQuery: ''
	};
</script>

<div class={`nav-drawer ${isCollapsed ? 'collapsed' : ''}`}>
	{#if !isCollapsed}
		<div class={`nav-drawer-header ${isCollapsed ? 'collapsed' : ''}`}>
			<Logo class="logo" {isCollapsed} />
			<button class="collapse-icon" onclick={() => (isCollapsed = !isCollapsed)}>
				<IconLayoutSidebarLeftCollapse color="var(--color-primary-gray)" />
			</button>
		</div>
	{:else}
		<div class={`nav-drawer-header ${isCollapsed ? 'collapsed' : ''}`}>
			<button class="collapse-icon" onclick={() => (isCollapsed = !isCollapsed)}>
				<IconLayoutSidebarRightCollapse color="var(--color-primary-gray)" />
			</button>
			<Logo class="logo" {isCollapsed} />
		</div>
	{/if}

	<div class="nav-drawer-divider"></div>

	<div class="compose-email-button-container {isCollapsed ? 'collapsed' : ''}">
		<ComposeEmailButton small={isCollapsed} />
	</div>

	<div class="nav-drawer-items-container">
		{#each navItems as item}
			<SideBarButton
				{handleNavigation}
				path={item.path}
				active={isActive(item.path)}
				icon={item.icon}
				{isCollapsed}
			>
				<div class="nav-drawer-item-label-container">
					{item.label}
					{#if item.count > 0}
						<span class="badge">{item.count}</span>
					{/if}
				</div>
			</SideBarButton>
		{/each}
	</div>
	<div class="labels-container">
		<div class="labels-header {isCollapsed ? 'collapsed' : ''}">
			{#if !isCollapsed}
				<div>Labels</div>
			{/if}
			<button class="labels-add-button" use:popup={addLabelPopup}>
				<IconPlus size={16} />
			</button>
			<div data-popup="addLabelPopup">
				<AddEmailLabel />
			</div>
		</div>
		<div class="labels-list">
			{#each email_labels as label, index}
				<div class="label-item">
					<div class="label-item-icon">
						<IconLabelFilled color={label.color} size={22} />
					</div>
					{#if !isCollapsed}
						<div class="label-item-name">{label.name}</div>
						<button
							class="menu-button"
							use:popup={{
								event: 'click',
								target: `editEmailLabelComponentPopup-sidebar-${index}`,
								placement: 'bottom'
							}}
						>
							<IconDotsVertical size={16} />
						</button>
						<div data-popup={`editEmailLabelComponentPopup-sidebar-${index}`}>
							<EditEmailLabel
								closePopupMenu={() => {
									refreshEmailLabels();
								}}
								emailLabel={label}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="settings-container">
		<button class="settings-button {isCollapsed ? 'collapsed' : ''}">
			<IconSettings size={24} />
			{#if !isCollapsed}
				<div>Settings</div>
			{/if}
		</button>
	</div>
	<div class="logout-container">
		<LogoutButton {isCollapsed} />
	</div>
</div>

<style>
	.nav-drawer {
		display: flex;
		flex-direction: column;
		align-items: flex-center;
		padding-left: 0.45rem; /* px-3 */
		padding-right: 0.45rem; /* px-3 */
		width: 260px; /* w-[180px] */
		background-color: var(--color-secondary-container); /* bg-secondary-container */
		transition:
			width 0.3s ease,
			padding 0.3s ease; /* Add smooth transition */
	}

	.nav-drawer-header {
		display: flex;
		justify-items: space-between;
		padding: 0.25rem;
		transition: flex-direction 0.3s ease; /* Add transition for layout changes */
	}

	.nav-drawer-divider {
		border: 1px solid var(--color-primary-dark-gray);
		margin-inline: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.nav-drawer-items-container {
		padding-block: 4px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.nav-drawer-item-label-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		width: 100%;
	}

	.badge {
		border-radius: 10px;
		border: 1px solid var(--color-primary-dark-gray);
		padding-block: 4px;
		padding-inline: 10px;
	}

	.collapsed {
		width: 60px;
		flex-direction: column;
		justify-items: center;
		padding-left: 0px;
		padding-right: 0px;
	}

	.logo {
		fill: '#222C50'; /* fill-primary-gray */
		padding: 4px;
	}

	.collapse-icon {
		fill: '#222C50'; /* fill-primary-gray */
		padding: 2px;
		border-radius: 4px;
		align-self: center;
		height: 40px;
	}

	.collapse-icon:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.logout-container {
		margin-bottom: 0.5rem; /* mb-2 */
		display: flex; /* flex */
		align-self: center; /* self-center */
		width: 100%;
	}

	.settings-container {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0.5rem;
		margin-top: auto;
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.settings-button {
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

	.settings-button.collapsed {
		padding: 4px;
		justify-content: center;
		width: 40px;
	}

	.settings-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.labels-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: var(--color-primary-light-gray);
		padding-block: 1rem;
	}

	.labels-header {
		font-size: 16px;
		flex-direction: row;
		align-items: center;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding-inline: 0.5rem;
		padding-block: 0.65rem;
	}

	.labels-header.collapsed {
		justify-content: center;
	}

	.labels-add-button {
		border-radius: 4px;
		padding: 4px;
	}

	.labels-add-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.labels-list {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
	}

	.label-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 14px;
		font-size: 14px;
		padding-block: 10px;
		width: 100%;
		padding-left: 20px;
		padding-right: 10px;
		border-radius: 4px;
	}

	/* .label-item:hover {
		background-color: var(--color-primary-dark-gray);
	} */

	.label-item-name {
		width: 100%;
	}

	.menu-button {
		align-self: center;
		padding: 4px;
		border-radius: 999px;
	}

	.menu-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.compose-email-button-container {
		padding-inline: 0.25rem;
		display: flex;
		justify-content: start;
	}

	.compose-email-button-container.collapsed {
		padding-inline: 0.25rem;
		display: flex;
		justify-content: center;
	}
</style>
