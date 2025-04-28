<script lang="ts">
	import { archiveNotification, readNotification } from '$lib/api/notification';
	import type { Notification } from '$lib/types';
	import { IconArrowRight } from '@tabler/icons-svelte';
	import { get } from 'svelte/store';
	import { user } from '$lib/store';

	const { notification }: { notification: Notification } = $props();

	const convertTime = (time: string) => {
		const date = new Date(time);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	};

	const handleClick = () => {
		readNotification(get(user)?.id.toString(), notification.id);
		window.open(notification.link, '_blank');
	};

	const handleArchive = () => {
		archiveNotification(get(user)?.id.toString(), notification.id);
	};
</script>

<div class="notification-item">
	<button class="notification-item-button" onclick={handleClick}>
		<div class="notification-item-header">
			<div class="notification-item-header-title">{notification.title}</div>
			<div class="notification-item-header-created-at">{convertTime(notification.created_at)}</div>
		</div>
		<div class="notification-item-body">
			<div class="notification-item-message">{notification.message}</div>
		</div>
	</button>
</div>

<style>
	.notification-item-header {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
	}
	.notification-item-header-title {
		color: var(--color-white);
		font-weight: 600;
		align-self: start;
		text-align: left;
	}
	.notification-item-header-created-at {
		color: var(--color-primary-light-gray);
		font-size: 12px;
		align-self: start;
		text-align: left;
	}
	.notification-item-message {
		color: var(--color-primary-light-gray);
		font-size: 14px;
		padding-block: 4px;
		text-align: left;
	}
	.notification-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 4px;
	}
	.notification-item-body {
		justify-content: start;
		align-items: start;
	}
	.notification-item-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		gap: 10px;
		color: var(--color-primary-light-gray);
		font-size: 14px;
		padding-block: 2px;
		padding-inline: 4px;
		border-radius: 6px;
	}
	.notification-item-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
