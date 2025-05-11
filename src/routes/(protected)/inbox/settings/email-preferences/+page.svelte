<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { IconInbox, IconTrashX, IconAlertTriangle } from '@tabler/icons-svelte';
	import { showToast } from '$lib/helpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { ToastType } from '$lib/types';
	import { updateEmailSettingsAction } from '$lib/actions/settings';
	const toastStore = getToastStore();
	let emailSettings = $state(get(emailServiceState).emailSettings);

	// New variables for input fields
	let newInboxEmail = $state('');
	let newSpamEmail = $state('');
	let newTrashEmail = $state('');

	emailServiceState.subscribe((state) => {
		emailSettings = state.emailSettings;
	});

	const removeEmail = (listType: 'inbox' | 'spam' | 'trash', email: string) => {
		showToast(toastStore, 'Saving email preferences...', ToastType.Info);

		const _removeEmail = async () => {
			await updateEmailSettingsAction(emailSettings[0].email_account_id, {
				...emailSettings[0],
				email_list: {
					...emailSettings[0].email_list,
					[listType]: emailSettings[0].email_list[listType].filter((e) => e !== email)
				}
			});
		};
		_removeEmail();
		const updatedSettings = [...emailSettings];
		updatedSettings[0].email_list[listType] = updatedSettings[0].email_list[listType].filter(
			(e) => e !== email
		);
		emailSettings = updatedSettings;
		showToast(toastStore, 'Email preferences saved', ToastType.Success);
	};

	// Function to add email to a specific list
	function addEmail(listType: 'inbox' | 'spam' | 'trash', email: string) {
		if (!email.trim()) return;

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showToast(toastStore, 'Please enter a valid email address', ToastType.Error);
			return;
		}

		const updatedSettings = [...emailSettings];

		// Initialize the list if it doesn't exist
		if (!updatedSettings[0]) {
			updatedSettings[0] = { email_list: { inbox: [], spam: [], trash: [] } };
		}

		if (!updatedSettings[0].email_list) {
			updatedSettings[0].email_list = { inbox: [], spam: [], trash: [] };
		}

		if (!updatedSettings[0].email_list[listType]) {
			updatedSettings[0].email_list[listType] = [];
		}

		// Add email if it's not already in the list
		if (!updatedSettings[0].email_list[listType].includes(email)) {
			updatedSettings[0].email_list[listType].push(email);
			emailSettings = updatedSettings;
			showToast(toastStore, 'Saving Email Preferences...', ToastType.Success);
			const _updateSettings = async () => {
				await updateEmailSettingsAction(emailSettings[0].email_account_id, updatedSettings[0]);
			};
			_updateSettings();
			showToast(toastStore, 'Email Preferences Saved', ToastType.Success);
		}

		// Clear the input field
		if (listType === 'inbox') newInboxEmail = '';
		else if (listType === 'spam') newSpamEmail = '';
		else if (listType === 'trash') newTrashEmail = '';
	}
</script>

<div class="settings-detail-container">
	<h2 class="settings-detail-header">Email Preferences</h2>
	<p class="settings-detail-description">Manage your email delivery preferences.</p>
	<div class="separator"></div>
	<div class="folder-routing-container">
		<div class="folder-routing-item">
			<div class="folder-routing-header">
				Always move emails from senders below to
				<div class="folder-routing-header-label-inbox"><IconInbox size={16} />Inbox</div>
			</div>
			<div class="email-list-container">
				<!-- Add email input form -->
				<div class="email-input-container">
					<input
						type="email"
						placeholder="Add email address"
						bind:value={newInboxEmail}
						onkeydown={(e) => {
							if (e.key === 'Enter') addEmail('inbox', newInboxEmail);
						}}
					/>
					<button class="add-button" onclick={() => addEmail('inbox', newInboxEmail)}>Add</button>
				</div>
				{#if emailSettings && emailSettings.length > 0 && emailSettings[0]?.email_list?.inbox?.length > 0}
					<div class="email-list">
						{#each emailSettings[0].email_list.inbox as email}
							<div class="email-item">
								<span class="email-address">{email}</span>
								<button class="delete-button" onclick={() => removeEmail('inbox', email)}>×</button>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-list">No email addresses added yet</div>
				{/if}
			</div>
		</div>
		<div class="folder-routing-item">
			<div class="folder-routing-header">
				Always move emails from senders below to
				<div class="folder-routing-header-label-spam"><IconAlertTriangle size={16} />Spam</div>
			</div>
			<div class="email-list-container">
				<!-- Add email input form -->
				<div class="email-input-container">
					<input
						type="email"
						placeholder="Add email address"
						bind:value={newSpamEmail}
						onkeydown={(e) => {
							if (e.key === 'Enter') addEmail('spam', newSpamEmail);
						}}
					/>
					<button class="add-button" onclick={() => addEmail('spam', newSpamEmail)}>Add</button>
				</div>
				{#if emailSettings && emailSettings.length > 0 && emailSettings[0]?.email_list?.spam?.length > 0}
					<div class="email-list">
						{#each emailSettings[0].email_list.spam as email}
							<div class="email-item">
								<span class="email-address">{email}</span>
								<button class="delete-button" onclick={() => removeEmail('spam', email)}>×</button>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-list">No email addresses added yet</div>
				{/if}
			</div>
		</div>
		<div class="folder-routing-item">
			<div class="folder-routing-header">
				Always move emails from senders below to
				<div class="folder-routing-header-label-trash"><IconTrashX size={16} />Trash</div>
			</div>
			<div class="email-list-container">
				<!-- Add email input form -->
				<div class="email-input-container">
					<input
						type="email"
						placeholder="Add email address"
						bind:value={newTrashEmail}
						onkeydown={(e) => {
							if (e.key === 'Enter') addEmail('trash', newTrashEmail);
						}}
					/>
					<button class="add-button" onclick={() => addEmail('trash', newTrashEmail)}>Add</button>
				</div>
				{#if emailSettings && emailSettings.length > 0 && emailSettings[0]?.email_list?.trash?.length > 0}
					<div class="email-list">
						{#each emailSettings[0].email_list.trash as email}
							<div class="email-item">
								<span class="email-address">{email}</span>
								<button class="delete-button" onclick={() => removeEmail('trash', email)}>×</button>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-list">No email addresses added yet</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.separator {
		width: 100%;
		height: 1px;
		background-color: var(--color-primary-dark-gray);
	}
	.folder-routing-container {
		display: flex;
		flex-direction: column;
		padding-block: 10px;
	}
	.folder-routing-header {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		font-weight: 500;
	}
	.folder-routing-header-label-inbox {
		background-color: var(--color-primary-light-container);
		color: var(--color-primary-white);
		padding: 5px 10px;
		border-radius: 5px;
		width: fit-content;
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		border: 1px solid var(--color-primary-dark-gray);
	}
	.folder-routing-header-label-spam {
		background-color: var(--color-primary-light-container);
		color: var(--color-primary-white);
		padding: 5px 10px;
		border-radius: 5px;
		width: fit-content;
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		border: 1px solid var(--color-primary-dark-gray);
	}
	.folder-routing-header-label-trash {
		background-color: var(--color-primary-light-container);
		color: var(--color-primary-white);
		padding: 5px 10px;
		border-radius: 5px;
		width: fit-content;
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		border: 1px solid var(--color-primary-dark-gray);
	}
	.folder-routing-item {
		display: flex;
		flex-direction: column;
		padding-block: 20px;
		gap: 10px;
		width: 100%;
	}
	.email-list-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		padding: 10px;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-container);
		border-radius: 5px;
	}
	.email-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		color: var(--color-primary-light-gray);
	}
	.empty-list {
		color: var(--color-primary-gray);
		font-weight: 400;
	}
	.email-input-container {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
	}

	.email-input-container input {
		flex: 1;
		padding: 8px;
		border: 1px solid var(--color-primary-dark-gray);
		border-radius: 4px;
		background-color: var(--color-primary-dark-container);
		color: var(--color-primary-white);
	}

	.add-button {
		background-color: var(--color-primary-dark-gray);
		color: var(--color-primary-white);
		border: 1px solid var(--color-primary-dark-gray);
		border-radius: 4px;
		padding: 8px 12px;
		cursor: pointer;
	}

	.add-button:hover {
		background-color: var(--color-primary);
	}

	.email-item {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px;
		background-color: var(--color-primary-dark-gray);
		border-radius: 4px;
		width: fit-content;
		gap: 10px;
	}

	.delete-button {
		background: none;
		border: none;
		color: var(--color-primary-light-gray);
		font-size: 18px;
		cursor: pointer;
	}

	.delete-button:hover {
		color: var(--color-primary-white);
	}
</style>
