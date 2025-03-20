<script lang="ts">
	import { IconLabelImportantFilled } from '@tabler/icons-svelte';
	import RightChevron from '$lib/assets/ChevronRight.svelte';
	import Summary from '$lib/assets/Summary.svelte';
	import type { Email } from '$lib/types';
	import { formatDate } from '$lib/utils/dateTime';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	interface Props {
		email?: Email;
		selected?: boolean;
	}

	let { email = {}, selected = false }: Props = $props();
	let unread: boolean = $state(true);
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
	class="email-list-item {selected ? 'email-list-item-selected' : 'email-list-item-unselected'}"
	onclick={onClick}
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
			{#if unread}
				<div class="unread-indicator-container">
					<svg
						width="9"
						height="9"
						viewBox="0 0 10 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="4.5" cy="4.5" r="4.5" fill="#45A8FF" />
					</svg>
				</div>
			{/if}
		</div>
		<div class="date-container">
			<div class="date-text">
				{formatDate(email.date)}
			</div>
			<RightChevron class={selected ? 'chevron-selected' : 'chevron-unselected'} />
		</div>
	</div>
	{#if email.summary}
		<div class="summary-container">
			<div class="icon-padding">
				<Summary width={15} height={18} />
			</div>
			<div class="summary-text">{email.summary}</div>
		</div>
	{:else}
		<div class="subject-padding">
			<div class="subject-text">{email.subject}</div>
		</div>
	{/if}
	<div class="labels-container">
		{#each email.email_labels as emailLabel}
			<IconLabelImportantFilled color={emailLabel.color} size={20} />
		{/each}
	</div>
</div>

<style>
	.email-list-item {
		margin-left: 12px;
		margin-right: 12px;
		border-bottom: 1px solid var(--primary-dark-gray);
		padding-top: 1rem;
		padding-bottom: 1rem;
		color: var(--color-primary-active-button-highlight);
		cursor: pointer;
		width: 320px;
	}

	.email-list-item-selected {
		background-color: var(--color-secondary-active-button-background);
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
		display: flex;
		justify-content: center;
		align-self: center;
	}

	.date-container {
		display: flex;
		align-items: center;
	}

	.date-text {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-size: var(--text-subheader);
	}

	.chevron-selected {
		fill: var(--color-secondary-active-button-highlight);
	}

	.chevron-unselected {
		fill: var(--color-secondary-inactive-button-highlight);
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
	}
</style>
