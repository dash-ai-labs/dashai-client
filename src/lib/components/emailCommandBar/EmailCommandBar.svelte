<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import EmailButton from '../EmailButton.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import type { Email, EmailServiceState } from '$lib/types';
	import { IconArchive, IconChecklist, IconReload, IconTrash } from '@tabler/icons-svelte';
	import { refreshEmailList } from '$lib/actions/email';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { createTaskAction, toggleTaskListAction } from '$lib/actions/task';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { showToast } from '$lib/helpers';
	import { ToastType, EmailFolder } from '$lib/types';
	import MoveEmail from '$lib/components/emailCommandBar/MoveEmail.svelte';
	import { refreshEmailSettings } from '$lib/actions/settings';
	import { onMount } from 'svelte';
	import { removeEmailAction, archiveEmailAction } from '$lib/actions/email';
	const toastStore = getToastStore();

	const {
		markEmailAsUnread,
		folder
	}: {
		markEmailAsUnread: (email: Email) => void;
		folder: EmailFolder;
	} = $props();
	// const emailLabels = $derived(get(emailServiceState).emailLabels);
	let email = $state<Email | undefined>(undefined);
	let toggleOptions = $state(['All Mail', 'Unread']);
	let lastFilter: { key: string; value: string }[] = $state([]);
	let selectedToggleOption: number = $state(0);

	emailServiceState.subscribe((state) => {
		const currentEmail = state.currentEmail;
		if (currentEmail && currentEmail.id !== email?.id) {
			email = currentEmail;
		}
	});

	onMount(() => {
		refreshEmailSettings();
	});

	const handleToggleChange = async (value: number) => {
		if (toggleOptions[value] === 'All Mail') {
			refreshEmailList([]);
			lastFilter = [];
		} else if (toggleOptions[value] === 'Unread') {
			refreshEmailList([{ key: 'is_read', value: 'false' }]);
			lastFilter = [{ key: 'is_read', value: 'false' }];
		}
		await emailServiceState.update((state: EmailServiceState) => ({
			...state,
			emailListFilter: lastFilter
		}));
	};

	const _createTask = async (email_id: string) => {
		showToast(toastStore, 'Creating task...', ToastType.Info);
		const task = await createTaskAction(email_id);
		if (task) {
			showToast(toastStore, 'Task created successfully', ToastType.Success);
			toggleTaskListAction();
		} else {
			showToast(toastStore, 'Something went wrong. Please try again.', ToastType.Error);
		}
	};

	const _archiveEmail = async (email: Email) => {
		showToast(toastStore, 'Archiving email...', ToastType.Info);
		await archiveEmailAction(email);
		showToast(toastStore, 'Email archived successfully', ToastType.Success);
	};

	const _removeEmail = async (email: Email) => {
		showToast(toastStore, 'Deleting email...', ToastType.Info);
		await removeEmailAction(email);
		showToast(toastStore, 'Email deleted successfully', ToastType.Success);
	};
</script>

<div class={folder === EmailFolder.HOME ? 'mini-command-bar' : 'command-bar'}>
	{#if folder === EmailFolder.INBOX || folder === EmailFolder.HOME}
		<div class="radio-group-container">
			<RadioGroup
				active="bg-primary-container"
				border={0}
				rounded={'rounded-md'}
				size={'sm'}
				background={'bg-primary-dark-gray'}
			>
				{#each toggleOptions as option, index}
					<RadioItem
						bind:group={selectedToggleOption}
						name={option}
						value={index}
						on:click={() => handleToggleChange(index)}>{option}</RadioItem
					>
				{/each}
			</RadioGroup>
		</div>
	{/if}
	<div class="button-group">
		<EmailButton onclick={() => refreshEmailList([], folder)} ariaLabel="Refresh" title="Refresh">
			<IconReload size="22" color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div>
	<div class="separator-border" />
	<div class="button-group">
		<EmailButton onclick={() => email && _archiveEmail(email)} ariaLabel="Archive" title="Archive">
			<IconArchive size={22} color="var(--color-primary-light-gray)" />
		</EmailButton>
		{#if folder !== EmailFolder.TRASH}
			<EmailButton onclick={() => email && _removeEmail(email)} ariaLabel="Delete" title="Delete">
				<IconTrash size={22} color="var(--color-primary-light-gray)" />
			</EmailButton>
		{/if}
	</div>
	{#if folder === EmailFolder.INBOX || folder === EmailFolder.HOME}
		<div class="separator-border" />
		<div class="button-group">
			<EmailButton
				onclick={() => email && markEmailAsUnread(email)}
				ariaLabel="Mark as Unread"
				title="Mark as unread"
			>
				<UnreadMail height={22} width={22} />
			</EmailButton>

			<EmailButton
				onclick={() => email && _createTask(email.id)}
				ariaLabel="Create Task"
				title="Create Task"
			>
				<IconChecklist height={22} width={22} color="var(--color-primary-light-gray)" />
			</EmailButton>
		</div>
	{/if}
	<MoveEmail {email} />
</div>

<style>
	.add-label-button {
		white-space: nowrap;
		border-radius: 0.5rem;
		border: 1px dashed var(--color-primary-gray);
		color: var(--color-primary-gray);
	}
	.command-bar {
		display: flex;
		align-items: center;
		background-color: var(--color-primary-container);
		width: 100%;
		padding: 12px 16px;
		border-bottom: 1px solid var(--color-primary-dark-gray);
		gap: 4px;
	}
	.mini-command-bar {
		display: flex;
		align-items: center;
		background-color: var(--color-primary-container);
		width: 100%;
		padding: 12px 16px;
		border: 1px solid var(--color-primary-dark-gray);
		gap: 4px;
		border-radius: 10px;
	}
	.compose-button {
		background-color: var(--color-primary-blue);
	}
	.radio-group-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.right-separator {
		border-right: 1px solid var(--color-secondary-inactive-button-highlight);
	}
	.button-group {
		margin: 0 8px;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.separator-border {
		display: flex;
		border-left: 1px solid var(--color-secondary-inactive-button-highlight);
		height: 24px;
		width: 1px;
		align-self: center;
		margin: 0 4px;
		opacity: 0.5;
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
