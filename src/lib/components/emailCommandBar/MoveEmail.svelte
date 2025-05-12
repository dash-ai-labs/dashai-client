<script lang="ts">
	import { type PopupSettings } from '@skeletonlabs/skeleton';
	import { IconSwitch3, IconInbox, IconTrashX, IconAlertTriangle } from '@tabler/icons-svelte';
	import EmailButton from '$lib/components/EmailButton.svelte';
	import { EmailFolder, ToastType, type Email, type EmailSettings } from '$lib/types';
	import { get } from 'svelte/store';
	import { emailServiceState, user } from '$lib/store';
	import { updateEmailSettingsAction } from '$lib/actions/settings';
	import { inboxEmailAction, removeEmailAction, spamEmailAction } from '$lib/actions/email';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { showToast } from '$lib/helpers';

	const toastStore = getToastStore();
	const { email }: { email: Email } = $props();
	const userId = get(user)?.id.toString();
	const moveEmailPopup: PopupSettings = {
		event: 'click',
		target: 'moveEmailPopup',
		placement: 'bottom-start',
		closeQuery: 'button'
	};
	let emailSettings: EmailSettings[] = $state([]);
	emailServiceState.subscribe((state) => {
		if (!state || !state.emailSettings || !email) return;
		emailSettings = state.emailSettings?.filter(
			(setting) => setting.email_account_id === email.email_account_id
		);
	});
	const moveEmailToInbox = async () => {
		showToast(toastStore, 'Moving email to inbox...', ToastType.Info);
		await inboxEmailAction(email);
		showToast(toastStore, 'Email moved to inbox successfully', ToastType.Success);
	};
	const moveEmailToTrash = async () => {
		showToast(toastStore, 'Moving email to trash...', ToastType.Info);
		await removeEmailAction(email);
		showToast(toastStore, 'Email moved to trash successfully', ToastType.Success);
	};
	const moveEmailToSpam = async () => {
		showToast(toastStore, 'Moving email to spam...', ToastType.Info);
		await spamEmailAction(email);
		showToast(toastStore, 'Email moved to spam successfully', ToastType.Success);
	};
	const moveEmailFromSenderToInbox = () => {
		moveEmailToInbox();
		if (!emailSettings) return;
		const emailAccountSettings = emailSettings.find(
			(setting) => setting.email_account_id === email.email_account_id
		);

		const _updateSettings = async () => {
			await updateEmailSettingsAction(email.email_account_id, {
				email_list: {
					...emailAccountSettings?.email_list,
					inbox: [...emailAccountSettings?.email_list.inbox, email.sender[0]]
				},
				email_preferences: {
					use_emojis: emailAccountSettings?.email_preferences.use_emojis,
					always_include_greetings: emailAccountSettings?.email_preferences.always_include_greetings
				}
			});
		};
		_updateSettings();
	};
	const moveEmailFromSenderToTrash = () => {
		moveEmailToTrash();
		const emailAccountSettings = emailSettings.find(
			(setting) => setting.email_account_id === email.email_account_id
		);

		const _updateSettings = async () => {
			await updateEmailSettingsAction(email.email_account_id, {
				email_list: {
					...emailAccountSettings?.email_list,
					trash: [...emailAccountSettings?.email_list.trash, email.sender[0]]
				},
				email_preferences: {
					use_emojis: emailAccountSettings?.email_preferences.use_emojis,
					always_include_greetings: emailAccountSettings?.email_preferences.always_include_greetings
				}
			});
		};
		_updateSettings();
	};
	const moveEmailFromSenderToSpam = () => {
		moveEmailToSpam();
		const emailAccountSettings = emailSettings.find(
			(setting) => setting.email_account_id === email.email_account_id
		);
		const _updateSettings = async () => {
			await updateEmailSettingsAction(email.email_account_id, {
				email_list: {
					...emailAccountSettings?.email_list,
					spam: [...emailAccountSettings?.email_list.spam, email.sender[0]]
				},
				email_preferences: {
					use_emojis: emailAccountSettings?.email_preferences.use_emojis,
					always_include_greetings: emailAccountSettings?.email_preferences.always_include_greetings
				}
			});
		};
		_updateSettings();
	};
</script>

<EmailButton title="Move Email" ariaLabel="Move Email" usePopup={moveEmailPopup}>
	<IconSwitch3 size="22" color="var(--color-primary-light-gray)" />
</EmailButton>
<div data-popup="moveEmailPopup" class="move-email-popup">
	<div class="container">
		{#if email && email.folder !== EmailFolder.INBOX && email.folder !== EmailFolder.SENT && email.folder !== EmailFolder.DRAFTS}
			<button class="button" onclick={moveEmailToInbox}>
				Move this email to
				<div class="folder-routing-button">
					<IconInbox size={16} />Inbox
				</div>
			</button>
			<button class="button" onclick={moveEmailFromSenderToInbox}
				>Move emails from this sender to <div class="folder-routing-button">
					<IconInbox size={16} />Inbox
				</div></button
			>
			<div class="divider"></div>
		{/if}
		{#if email && email.folder !== EmailFolder.TRASH}
			<button class="button" onclick={moveEmailToTrash}>
				Move this email to
				<div class="folder-routing-button">
					<IconTrashX size={16} />Trash
				</div>
			</button>
			<button class="button" onclick={moveEmailFromSenderToTrash}
				>Move emails from this sender to <div class="folder-routing-button">
					<IconTrashX size={16} />Trash
				</div></button
			>
			<div class="divider"></div>
		{/if}
		{#if email && email.folder !== EmailFolder.SPAM && email.folder !== EmailFolder.DRAFTS && email.folder !== EmailFolder.SENT}
			<button class="button" onclick={moveEmailToSpam}>
				Move this email to
				<div class="folder-routing-button">
					<IconAlertTriangle size={16} />Spam
				</div>
			</button>
			<button class="button" onclick={moveEmailFromSenderToSpam}
				>Move emails from this sender to <div class="folder-routing-button">
					<IconAlertTriangle size={16} />Spam
				</div></button
			>
		{/if}
		{#if !email}
			<div class="no-email-selected">Need to select an email to move it</div>
		{/if}
	</div>
</div>

<style>
	.divider {
		height: 1px;
		background-color: var(--color-primary-dark-gray);
		margin: 0 10px;
	}
	.move-email-popup {
		z-index: 1000;
	}
	.container {
		display: flex;
		flex-direction: column;
		background-color: var(--color-primary-dark-container);
		border-radius: 10px;
		border: 1px solid var(--color-primary-dark-gray);
		overflow: hidden;
	}
	.no-email-selected {
		padding: 10px;
		text-align: center;
		color: var(--color-primary-gray);
	}
	.button {
		display: flex;
		text-align: left;
		align-items: center;
		flex-direction: row;
		padding: 10px;
		gap: 6px;
		font-size: 14px;
	}
	.button:hover {
		background-color: var(--color-primary-dark-gray);
	}
	.folder-routing-button {
		background-color: var(--color-primary-light-container);
		color: var(--color-primary-white);
		padding: 2px 4px;
		border-radius: 5px;
		flex-direction: row;
		display: flex;
		gap: 5px;
		align-items: center;
		border: 1px solid var(--color-primary-dark-gray);
	}
</style>
