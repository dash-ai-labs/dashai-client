<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import ComposeEmailButton from '../ComposeEmailButton.svelte';
	import EmailButton from '../EmailButton.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import type { Email } from '$lib/types';
	import { IconArchive, IconRefresh, IconTrash } from '@tabler/icons-svelte';
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
</script>

<div class="command-bar">
	<ComposeEmailButton />
	<!-- <div class="button-group">
		<EmailButton>
			<IconRefresh size={24} color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div> -->
	<div class="separator-border" />
	<div class="button-group">
		<EmailButton onclick={() => email && archiveEmail(email)} ariaLabel="Archive" title="Archive">
			<IconArchive size={24} color="var(--color-primary-light-gray)" />
		</EmailButton>
		<EmailButton onclick={() => email && removeEmail(email)} ariaLabel="Delete" title="Delete">
			<IconTrash size={24} color="var(--color-primary-light-gray)" />
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
</div>

<style>
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
</style>
