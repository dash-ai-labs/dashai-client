<script lang="ts">
	import RightChevron from '$lib/assets/RightChevron.svelte';
	import type { Email } from '$lib/email';
	import { formatDate } from '$lib/utils/dateTime';

	export let email: Email = {};
	export let selected: boolean = false;
</script>

<div
	class="p-4 hover:cursor-pointer {selected
		? 'bg-secondary-active-button-background text-primary-active-button-highlight hover:bg-secondary-active-button-background-hover'
		: 'hover:bg-secondary-active-button-background'}"
>
	<div class="flex items-center justify-between">
		<div class="max-w-[210px] truncate text-body font-medium">
			{#if email.sender_name && email.sender_name.length > 0}
				{email.sender_name.join(', ')}
			{:else if email.sender && email.sender.length > 0}
				{email.sender.join(', ')}
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
	<div>
		<div class="truncate text-subheader">{email.subject}</div>
	</div>
</div>
