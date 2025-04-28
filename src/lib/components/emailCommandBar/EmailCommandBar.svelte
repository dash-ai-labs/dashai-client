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
	import { ToastType } from '$lib/types';

	const toastStore = getToastStore();

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
	let toggleOptions = $state(['All Mail', 'Unread']);
	let lastFilter: { key: string; value: string }[] = $state([]);
	let selectedToggleOption: number = $state(0);

	emailServiceState.subscribe((state) => {
		const currentEmail = state.currentEmail;
		if (currentEmail && currentEmail.id !== email?.id) {
			email = currentEmail;
		}
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
		toggleTaskListAction();
	};

	const _createTask = async (email_id: string) => {
		showToast(toastStore, 'Creating task...', ToastType.Info);
		const task = await createTaskAction(email_id);
		if (task) {
			showToast(toastStore, 'Task created successfully', ToastType.Success);
		} else {
			showToast(toastStore, 'Something went wrong. Please try again.', ToastType.Error);
		}
	};

	const _archiveEmail = async (email: Email) => {
		showToast(toastStore, 'Archiving email...', ToastType.Info);
		await archiveEmail(email);
		showToast(toastStore, 'Email archived successfully', ToastType.Success);
	};

	const _removeEmail = async (email: Email) => {
		showToast(toastStore, 'Deleting email...', ToastType.Info);
		await removeEmail(email);
		showToast(toastStore, 'Email deleted successfully', ToastType.Success);
	};
</script>

<div class="command-bar">
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
	<div class="button-group">
		<EmailButton onclick={refreshEmailList} ariaLabel="Refresh" title="Refresh">
			<IconReload size="22" color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div>
	<div class="separator-border" />
	<div class="button-group">
		<EmailButton onclick={() => email && _archiveEmail(email)} ariaLabel="Archive" title="Archive">
			<IconArchive size={22} color="var(--color-primary-light-gray)" />
		</EmailButton>
		<EmailButton onclick={() => email && _removeEmail(email)} ariaLabel="Delete" title="Delete">
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
		<EmailButton
			onclick={() => email && _createTask(email.id)}
			ariaLabel="Create Task"
			title="Create Task"
		>
			<IconChecklist height={22} width={22} color="var(--color-primary-light-gray)" />
		</EmailButton>
	</div>
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
		background-color: var(--color-primary-container);
		width: 100%;
		padding-inline: 2px;
	}
	.compose-button {
		background-color: var(--color-primary-blue);
	}
	.radio-group-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0.15rem;
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
