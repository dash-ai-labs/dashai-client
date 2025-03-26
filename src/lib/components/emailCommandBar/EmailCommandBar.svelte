<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import ComposeEmailButton from '../ComposeEmailButton.svelte';
	import EmailButton from '../EmailButton.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import type { Email } from '$lib/types';
	import { IconArchive, IconReload, IconTrash } from '@tabler/icons-svelte';
	import { refreshEmailList } from '$lib/actions';
	import AddEmailLabel from '../AddEmailLabel.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	const {
		removeEmail,
		archiveEmail,
		markEmailAsUnread
	}: {
		removeEmail: (email: Email) => void;
		archiveEmail: (email: Email) => void;
		markEmailAsUnread: (email: Email) => void;
	} = $props();
	// const emailLabels = $derived(get(emailServiceState).emailLabels);
	let email = $state<Email | undefined>(undefined);
	emailServiceState.subscribe((state) => {
		const currentEmail = state.currentEmail;
		if (currentEmail && currentEmail.id !== email?.id) {
			email = currentEmail;
		}
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

<div class="command-bar">
	<ComposeEmailButton />
	<div class="button-group">
		<EmailButton onclick={refreshEmailList} ariaLabel="Refresh" title="Refresh">
			<IconReload size="22" color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div>
	<div class="separator-border" />
	<div class="button-group">
		<EmailButton onclick={() => email && archiveEmail(email)} ariaLabel="Archive" title="Archive">
			<IconArchive size={22} color="var(--color-primary-light-gray)" />
		</EmailButton>
		<EmailButton onclick={() => email && removeEmail(email)} ariaLabel="Delete" title="Delete">
			<IconTrash size={22} color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div>
	<div class="separator-border" />
	<div class="button-group">
		<EmailButton
			onclick={() => email && markEmailAsUnread(email)}
			ariaLabel="Mark as Unread"
			title="Mark as unread"
		>
			<UnreadMail height={22} width={22} />
		</EmailButton>
	</div>
	<div class="right-container">
		<button use:popup={addLabelPopup} class="add-label-button">+ Label</button>
	</div>
	<div data-popup="addLabelPopup">
		<AddEmailLabel {email} />
	</div>
</div>

<style>
	[data-popup] {
		/* Display */
		display: none;
		/* Position */
		z-index: 50;
		position: absolute;
		top: 0;
		left: 1;
	}
	.add-label-button {
		white-space: nowrap;
		border-radius: 0.5rem;
		border: 1px dashed var(--color-primary-gray);
		padding: 0 1rem;
		color: var(--color-primary-gray);
	}
	.command-bar {
		display: flex;
		background-color: var(--color-primary-container);
		padding-inline: 4px;
		padding-block: 4px;
		border-radius: 0.5rem;
		margin-block: 10px;
	}
	.compose-button {
		background-color: var(--color-primary-blue);
	}
	.right-separator {
		border-right: 1px solid var(--color-secondary-inactive-button-highlight);
	}
	.button-group {
		margin: 0 10px;
		display: flex;
		gap: 10px;
	}
	.separator-border {
		display: flex;
		border-left: 1px solid var(--color-secondary-inactive-button-highlight);
		height: 20px;
		width: 1px;
		align-self: center;
	}
	.right-container {
		display: flex;
		align-items: center;
		justify-items: end;
		gap: 10px;
		margin-left: auto;
		padding-inline: 10px;
	}
</style>
