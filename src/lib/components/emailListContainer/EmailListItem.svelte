<script lang="ts">
	import Summary from '$lib/assets/Summary.svelte';
	import type { Email } from '$lib/types';
	import { formatDate } from '$lib/utils/dateTime';
	import { createEventDispatcher } from 'svelte';
	import EmailLabelDot from '../EmailLabelDot.svelte';
	import { IconChevronRight } from '@tabler/icons-svelte';
	const dispatch = createEventDispatcher();

	interface Props {
		email?: Email;
		selected?: boolean;
	}

	let { email = {}, selected = false }: Props = $props();
	let unread: boolean = $state(true);
	let showLabel: boolean = $state(false);
	const onClick = () => {
		dispatch('handleEmailSelect', email);
	};

	$effect(() => {
		if (email && !email.labels.includes('UNREAD')) {
			unread = false;
		}
	});
</script>

<div
	class="email-list-item {selected
		? 'email-list-item-selected'
		: 'email-list-item-unselected'} {unread
		? 'unread-indicator-container'
		: 'read-indicator-container'}"
	onclick={onClick}
	onmouseover={() => {
		showLabel = true;
	}}
	onmouseleave={() => {
		showLabel = false;
	}}
	aria-label={email.subject}
>
	<div class="item-header">
		<div class="sender-container">
			<div class="sender-padding">
				{#if email.sender_name && email.sender_name.length > 0}
					{email.sender_name.join(', ')}
				{:else if email.sender && email.sender.length > 0}
					{email.sender.join(', ')}
				{/if}
			</div>
		</div>
		<div class="date-container">
			<div class="date-text">
				{formatDate(email.date)}
			</div>
			<IconChevronRight
				size={18}
				color={selected ? 'var(--color-primary-light-gray)' : 'var(--color-primary-gray)'}
			/>
		</div>
	</div>
	{#if email.summary}
		<div class="summary-container">
			<div class="icon-padding">
				<Summary
					width={15}
					height={18}
					color={unread ? 'var(--color-primary-light-gray)' : 'var(--color-primary-gray)'}
				/>
			</div>
			<div class="summary-text">{email.summary}</div>
		</div>
	{:else}
		<div class="subject-padding">
			<div class="subject-text">{email.subject}</div>
		</div>
	{/if}
	{#if email.email_labels.length > 0}
		<div class="labels-container">
			{#each email.email_labels as emailLabel}
				<EmailLabelDot {emailLabel} {showLabel} />
			{/each}
		</div>
	{/if}
</div>
{#if !selected}
	<div class="separator"></div>
{/if}

<style>
	.email-list-item {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		color: var(--color-primary-active-button-highlight);
		cursor: pointer;
		height: 130px;
		align-content: center;
	}

	.email-list-item-selected {
		background-color: var(--color-secondary-active-button-background);
		border-radius: 6px;
	}

	.email-list-item-selected:hover {
		background-color: var(--color-secondary-active-button-background-hover);
	}

	.email-list-item-unselected:hover {
		background-color: var(--color-secondary-active-button-background-hover);
	}

	.item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sender-container {
		display: flex;
		width: 210px;
		flex-direction: row;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: var(--text-body);
		font-weight: 600;
	}

	.sender-padding {
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}

	.unread-indicator-container {
		color: var(--color-primary-light-gray);
	}
	.read-indicator-container {
		color: var(--color-primary-gray);
	}

	.date-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.date-text {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-size: var(--text-subheader);
	}

	.summary-container {
		display: flex;
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}

	.icon-padding {
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}

	/* .separator:hover {
		border-bottom: var(--color-primary-light-gray);
		border-bottom: 1px solid;
		margin-left: 0.25rem;
		margin-right: 0.25rem;
		align-self: center;
	} */

	.separator {
		border-bottom: 1px solid var(--color-primary-gray);
		margin-left: 0.25rem;
		margin-right: 0.25rem;
		align-self: center;
	}
	.summary-text {
		max-width: 230px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		text-wrap: wrap;
		font-size: var(--text-subheader);
	}

	.subject-padding {
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}

	.subject-text {
		max-width: 250px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: var(--text-subheader);
	}

	.labels-container {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		padding-inline: 0.25rem;
		height: 22px;
	}
</style>
