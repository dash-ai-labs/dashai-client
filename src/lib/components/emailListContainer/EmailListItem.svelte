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
	class="mx-[12px] border-b-[1px] border-primary-dark-gray py-4 text-primary-active-button-highlight hover:cursor-pointer {selected
		? 'bg-secondary-active-button-background  hover:bg-secondary-active-button-background-hover'
		: 'hover:bg-secondary-active-button-background'}"
	onclick={onClick}
>
	<div class="flex items-center justify-between">
		<div class="flex w-[210px] flex-row truncate text-body font-medium">
			<div class="px-1">
				{#if email.sender_name && email.sender_name.length > 0}
					{email.sender_name.join(', ')}
				{:else if email.sender && email.sender.length > 0}
					{email.sender.join(', ')}
				{/if}
			</div>
			{#if unread}
				<div class="justify-center self-center">
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
		<div class="flex items-center">
			<div class="px-2 text-subheader">
				{formatDate(email.date)}
			</div>
			<RightChevron
				fill={selected
					? 'fill-secondary-active-button-highlight'
					: 'fill-secondary-inactive-button-highlight'}
			/>
		</div>
	</div>
	{#if email.summary}
		<div class="flex px-1">
			<div class="px-1">
				<Summary width={15} height={18} />
			</div>
			<div class="max-w-[230px] truncate text-wrap text-subheader">{email.summary}</div>
		</div>
	{:else}
		<div class="px-1">
			<div class="max-w-[250px] truncate text-subheader">{email.subject}</div>
		</div>
	{/if}
	<div class="flex flex-row">
		{#each email.email_labels as emailLabel}
			<IconLabelImportantFilled color={emailLabel.color} size={20} />
		{/each}
	</div>
</div>

<style>
</style>
