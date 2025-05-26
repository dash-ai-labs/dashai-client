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
		IconSettings,
		IconMessage2,
		IconAlertTriangle
	} from '@tabler/icons-svelte';
	import { emailServiceState, user } from '$lib/store';
	import { EmailFolder, type EmailServiceState, type Label } from '$lib/types';
	import EditEmailLabel from './labelEditor/EditEmailLabel.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import ComposeEmailButton from './ComposeEmailButton.svelte';
	import NewEmailLabelComponent from './NewEmailLabelComponent.svelte';
	import { getEmailFolderCount } from '$lib/api/email';
	import { get } from 'svelte/store';

	let { handleNavigation = (path: string) => {} } = $props();

	let inboxCount = $state(0);
	let draftsCount = $state(0);
	let sentCount = $state(0);
	let trashCount = $state(0);
	let spamCount = $state(0);
	let isSettingsActive = $state(false);

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
			getFolderCount(EmailFolder.SPAM).then((count) => (spamCount = count));
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
			label: 'Spam',
			path: '/inbox/spam',
			badge: 20,
			icon: IconAlertTriangle,
			count: spamCount
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

	const newLabelPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'newLabelPopup',
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
				handleNavigation={() => {
					isSettingsActive = false;
					emailServiceState.update((state) => ({
						...state,
						showEmailHeader: true
					}));
					handleNavigation(item.path);
				}}
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
			<button class="new-labels-button" use:popup={newLabelPopup}>
				<IconPlus size={16} />
			</button>
			<div data-popup="newLabelPopup">
				<NewEmailLabelComponent />
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
	<div class="bottom-container">
		<button
			class="feedback-button"
			onclick={() => window.open('https://dashai.featurebase.app/', '_blank')}
		>
			<IconMessage2 size={24} />
			{#if !isCollapsed}
				<div>Feedback</div>
			{/if}
		</button>

		<button
			class="settings-button {isCollapsed ? 'collapsed' : ''} {isSettingsActive ? 'active' : ''}"
			onclick={() => {
				isSettingsActive = true;
				handleNavigation('/inbox/settings');
			}}
		>
			<IconSettings size={24} />
			{#if !isCollapsed}
				<div>Settings</div>
			{/if}
		</button>
		<LogoutButton {isCollapsed} />
	</div>
</div>

<style>
	.nav-drawer {
		display: flex;
		flex-direction: column;
		align-items: flex-center;
		padding: 0.75rem;
		width: 260px;
		background-color: var(--color-secondary-container);
		border-right: 1px solid var(--color-primary-dark-gray);
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
		transition:
			width 0.3s ease,
			padding 0.3s ease,
			box-shadow 0.2s ease;
	}

	.nav-drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.nav-drawer-divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-primary-dark-gray), transparent);
		margin: 0.75rem 0;
		opacity: 0.6;
	}

	.nav-drawer-items-container {
		padding: 8px 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.01);
		margin-bottom: 16px;
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
		border-radius: 12px;
		background-color: var(--color-secondary-active-button);
		color: white;
		padding: 2px 8px;
		font-size: 12px;
		font-weight: 600;
		min-width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
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
		fill: '#222C50';
		padding: 8px;
		border-radius: 8px;
		align-self: center;
		height: 40px;
		width: 40px;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.collapse-icon:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: var(--color-primary-dark-gray);
		transform: scale(1.05);
	}

	.logout-container {
		margin-bottom: 0.5rem; /* mb-2 */
		display: flex; /* flex */
		align-self: center; /* self-center */
		width: 100%;
	}

	.bottom-container {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding-top: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
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
	.feedback-button {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 12px;
		border-radius: 8px;
		padding: 12px 16px;
		text-align: left;
		color: var(--color-font-gray);
		width: 100%;
		margin: 4px 0;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.settings-button {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 12px;
		border-radius: 8px;
		padding: 12px 16px;
		text-align: left;
		color: var(--color-font-gray);
		width: 100%;
		margin: 4px 0;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.settings-button.collapsed {
		padding: 4px;
		justify-content: center;
		width: 40px;
	}

	.settings-button.active {
		background-color: var(--color-primary-dark-gray);
	}

	.settings-button:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateX(2px);
	}

	.feedback-button:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateX(2px);
	}

	.labels-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: var(--color-primary-light-gray);
		padding: 16px 0;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.01);
		border: 1px solid rgba(255, 255, 255, 0.02);
		margin-bottom: 16px;
	}

	.labels-header {
		font-size: 14px;
		font-weight: 600;
		flex-direction: row;
		align-items: center;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 12px 16px;
		margin-bottom: 8px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		color: var(--color-primary-light-gray);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.labels-header.collapsed {
		justify-content: center;
	}

	.new-labels-button {
		border-radius: 6px;
		padding: 6px;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.new-labels-button:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.1);
		transform: scale(1.05);
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
		gap: 12px;
		font-size: 14px;
		padding: 8px 16px;
		width: 100%;
		border-radius: 6px;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		margin: 2px 0;
	}

	.label-item:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.05);
		transform: translateX(2px);
	}

	.label-item-name {
		width: 100%;
	}

	.menu-button {
		align-self: center;
		padding: 6px;
		border-radius: 50%;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-button:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.1);
		transform: scale(1.1);
	}

	.compose-email-button-container {
		padding: 8px 4px;
		display: flex;
		justify-content: flex-start;
		margin-bottom: 12px;
	}

	.compose-email-button-container.collapsed {
		padding: 8px 4px;
		display: flex;
		justify-content: center;
		margin-bottom: 12px;
	}
</style>
