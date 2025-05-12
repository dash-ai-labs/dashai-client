<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import ToggleTaskListButton from '$lib/components/taskList/ToggleTaskListButton.svelte';
	import { IconBell } from '@tabler/icons-svelte';
	import NotificationList from '$lib/components/notifications/notificationList.svelte';
	import { emailServiceState } from '$lib/store';

	interface Props {
		children?: import('svelte').Snippet;
	}
	let { children }: Props = $props();

	const notificationPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'notificationPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom-end',
		closeQuery: ''
	};
</script>

<div>
	{#if $emailServiceState.showEmailHeader}
		<div class="inbox-header">
			<InboxSearchBar />
			<div class="header-buttons-container">
				<button class="notification-button" use:popup={notificationPopup}>
					<IconBell size="22" color="var(--color-primary-gray)" />
				</button>
				<ToggleTaskListButton />
			</div>
			<div data-popup="notificationPopup">
				<NotificationList />
			</div>
		</div>
	{/if}
	{@render children?.()}
</div>

<style>
	.inbox-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.header-buttons-container {
		align-self: center;
		gap: 10px;
		display: flex;
		justify-content: flex-end;
	}
	.notification-button {
		background-color: var(--color-primary-light-container);
		border-radius: 10px;
		padding-inline: 10px;
		padding-block: 5px;
		border: 1px solid var(--color-primary-dark-gray);
	}
	.notification-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
