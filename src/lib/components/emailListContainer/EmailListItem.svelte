<script lang="ts">
	import Summary from '$lib/assets/Summary.svelte';
	import type { Email } from '$lib/types';
	import { formatDate } from '$lib/utils/dateTime';
	import { createEventDispatcher } from 'svelte';
	import EmailLabelDot from '../EmailLabelDot.svelte';
	import { IconChevronRight } from '@tabler/icons-svelte';
	const dispatch = createEventDispatcher();

	interface Props {
		email: Email;
		selected?: boolean;
	}

	let { email, selected = false }: Props = $props();
	let unread: boolean = $state(false);
	let showLabel: boolean = $state(true);
	const onClick = () => {
		dispatch('handleEmailSelect', email);
	};

	$effect(() => {
		if (email && !email.is_read) {
			unread = true;
		} else {
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
	aria-label={email.subject}
>
	<div class="sender-container">
		<div class="sender-padding">
			{#if email.sender_name && email.sender_name.length > 0}
				{email.sender_name.join(', ')}
			{:else if email.sender && email.sender.length > 0}
				{email.sender.join(', ')}
			{/if}
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
			<div
				class="summary-text {unread ? 'unread-indicator-container' : 'read-indicator-container'}
"
			>
				{email.summary}
			</div>
		</div>
	{:else}
		<div class="subject-padding">
			<div class="subject-text">{email.subject}</div>
		</div>
	{/if}
	<div class="labels-container">
		{#if email.email_labels.length > 0}
			{#each email.email_labels as emailLabel}
				<EmailLabelDot {emailLabel} {showLabel} />
			{/each}
		{/if}
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
{#if !selected}
	<div class="separator"></div>
{/if}

<style>
	.email-list-item {
		padding: 1px 10px;
		color: var(--color-primary-active-button-highlight);
		cursor: pointer;
		height: 40px;
		align-content: center;
		border-radius: 8px;
		margin: 2px 0;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		display: flex;
		justify-content: left;
		align-items: center;
		width: 100%;
	}

	.email-list-item-selected {
		background-color: var(--color-secondary-active-button-background);
		border-color: var(--color-secondary-active-button);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.email-list-item-selected:hover {
		background-color: var(--color-secondary-active-button-background-hover);
		transform: translateX(1px);
	}

	.email-list-item-unselected:hover {
		background-color: var(--color-secondary-active-button-background-hover);
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateX(1px);
	}

	.item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sender-container {
		padding-left: 4px;
		padding-right: 4px;
		font-size: var(--text-body);
		font-weight: 600;
		width: 240px;
		min-width: 220px;
	}

	.sender-padding {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.unread-indicator-container {
		color: var(--color-primary-light-gray);
		font-weight: bold;
	}
	.read-indicator-container {
		color: var(--color-primary-gray);
	}

	.date-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-left: auto;
		width: 100%;
		max-width: 120px;
	}

	.date-text {
		padding-left: 4px;
		padding-right: 4px;
		font-size: var(--text-subheader);
	}

	.summary-container {
		display: flex;
		padding: 4px 2px;
		overflow: hidden;
		justify-content: left;
		align-items: center;
		max-width: 720px;
		width: 600px;
	}

	.icon-padding {
		padding: 0 4px 0 2px;
	}

	/* .separator:hover {
		border-bottom: var(--color-primary-light-gray);
		border-bottom: 1px solid;
		margin-left: 0.25rem;
		margin-right: 0.25rem;
		align-self: center;
	} */

	.separator {
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-primary-gray), transparent);
		margin: 4px 16px;
		opacity: 0.3;
	}
	.summary-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: var(--text-subheader);
		text-align: left;
		padding: 4px 2px;
	}

	.subject-padding {
		display: flex;
		padding: 2px;
		overflow: hidden;
		justify-content: left;
		align-items: center;
		max-width: 720px;
		width: 600px;
	}

	.subject-text {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: var(--text-subheader);
		text-align: left;
	}

	.labels-container {
		display: flex;
		flex-direction: row;
		gap: 6px;
		height: 22px;
		padding: 6px 2px;
		align-items: center;
		justify-content: flex-start;
		margin-left: auto;
		position: relative;
		overflow: visible;
		width: 240px;
	}
</style>
