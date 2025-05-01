<script lang="ts">
	import { refreshNotifications } from '$lib/actions/notification';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import type { Notification } from '$lib/types';
	import NotificationItem from './notificationItem.svelte';

	let _notifications = $state<Notification[]>([]);
	user.subscribe((state) => {
		if (state?.profile?.notifications) {
			_notifications = state.profile.notifications;
		}
	});
	onMount(async () => {
		console.log(user);
		await refreshNotifications();
	});
</script>

<div class="notification-list-container">
	<!-- <div class="notification-list-header"></div> -->
	<div class="notification-list-body">
		{#each _notifications as notification}
			<NotificationItem {notification} />
		{/each}
		{#if _notifications.length === 0}
			<div class="notification-list-empty">No notifications</div>
		{/if}
	</div>
</div>

<style>
	.notification-list-header {
		display: flex;
		justify-content: start;
		align-items: center;
		border-bottom: 1px solid var(--color-primary-light-gray);
		padding: 10px;
	}
	.notification-list-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--color-primary-container);
		border-radius: 10px;
		border: 1px solid var(--color-primary-gray);
		max-width: 300px;
	}
	.notification-list-empty {
		text-align: center;
		color: var(--color-primary-light-gray);
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 10px;
		width: 200px;
	}
</style>
