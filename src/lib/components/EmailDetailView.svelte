<script lang="ts">
	import Inbox from '$lib/assets/Inbox.svelte';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import Trash from '$lib/assets/Trash.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import Archive from '$lib/assets/Archive.svelte';
	import EmailButton from './EmailButton.svelte';
	import type { Email } from '$lib/types';

	const {
		removeEmail,
		archiveEmail,
		markEmailAsUnread,
		email
	}: {
		removeEmail: () => void;
		archiveEmail: () => void;
		markEmailAsUnread: () => void;
		email: Email;
	} = $props();
	let element = $state<HTMLIFrameElement | null>(null);
	$effect(() => {
		if (element && email?.raw_content) {
			element.srcdoc = DOMPurify.sanitize(email.raw_content);
			adjustBackground();
		}
	});

	onMount(() => {
		if (element && email?.raw_content) {
			element.srcdoc = DOMPurify.sanitize(email.raw_content);
		}
	});
	let backgroundColor = 'bg-primary-container'; // Default background color

	function adjustBackground() {
		if (element) {
			const computedStyles = getComputedStyle(element);
			const bgColor = computedStyles.backgroundColor;
			if (bgColor && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
				backgroundColor = bgColor; // Use the defined background color
				element.classList.add('text-primary-gray');
				return;
			}
			const rgb = computedStyles.color.match(/\d+/g).slice(0, 3).map(Number); // Extract RGB values

			// Calculate luminance
			const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
			backgroundColor = luminance > 0.5 ? 'bg-font-light-gray' : 'bg-primary-container'; // Adjust for contrast
			element.classList.add(luminance > 0.5 ? 'text-primary-black' : 'text-font-light-gray'); // Adjust text color for high contrast
		}
	}
	// editor = new Editor({
	// 	element: element,
	// 	extensions: [
	// 		StarterKit,
	// 		Image,
	// 		Link,
	// 		Table,
	// 		TableRow,
	// 		TableCell,
	// 		TableHeader,
	// 		TextStyle,
	// 		Color,
	// 		Underline,
	// 		Highlight,
	// 		HorizontalRule
	// 	],
	// 	content: email.raw_content,
	// 	onTransaction: () => {
	// 		// force re-render so `editor.isActive` works as expected
	// 		editor = editor;
	// 	}
	// });

	// Ensure editor instance is destroyed when the component is unmounted
	// onDestroy(() => {
	// 	if (editor) {
	// 		editor.destroy();
	// 		editor = null;
	// 	}
	// });

	const formatDate = (date: Date): string => {
		let dateObj = new Date(date);
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const day = daysOfWeek[dateObj.getDay()];
		const month = String(dateObj.getMonth() + 1).padStart(2, '0');
		const dayOfMonth = String(dateObj.getDate()).padStart(2, '0');
		const year = dateObj.getFullYear();

		let hours = dateObj.getHours();
		const minutes = String(dateObj.getMinutes()).padStart(2, '0');
		const amPm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;

		return `${day} ${month}/${dayOfMonth}/${year} ${hours}:${minutes}${amPm}`;
	};
</script>

<div class="w-full min-w-[740px] max-w-[1000px] rounded-lg bg-primary-container">
	{#if email}
		<!-- Header -->
		<header class="flex h-[60px] items-center gap-2 border-b border-primary-gray px-3">
			<div class="mx-[24px] flex gap-[24px]">
				<EmailButton
					onclick={() => email && archiveEmail(email)}
					ariaLabel="Archive"
					title="Archive"
				>
					<Archive />
				</EmailButton>
				<EmailButton onclick={() => email && removeEmail(email)} ariaLabel="Delete" title="Delete">
					<Trash />
				</EmailButton>
			</div>
			<div
				class="border-r-red flex border-l-[1px] border-secondary-inactive-button-highlight px-[24px]"
			>
				<EmailButton
					onclick={() => markEmailAsUnread(email)}
					ariaLabel="Mark as Unread"
					title="Mark as unread"
				>
					<UnreadMail />
				</EmailButton>
			</div>
		</header>

		<!-- Message Content -->
		<div class="border-b border-primary-gray p-6">
			<div class="flex items-start gap-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-medium text-white"
				>
					{email.sender_name && email.sender_name[0]
						? email.sender_name[0][0]
						: email.sender && email.sender[0]
							? email.sender[0][0]
							: ''}
				</div>
				<div class="flex-1">
					<div class="flex items-start justify-between">
						<div>
							<h1 class="text-lg">{email.subject}</h1>
							<p class="text-sm text-gray-400">Reply To: {email.sender[0]}</p>
						</div>
						<span class="text-sm text-gray-400">{formatDate(email.date)}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="no-scrollbar mt-4 max-h-[600px] space-y-4 p-6">
			<iframe bind:this={element} title={email.subject} class="no-scrollbar h-[500px] w-full"
			></iframe>
			<div class="px-3">
				<EmailButton
					additionalClass="border-[1px] rounded-lg border-primary-gray text-primary-gray"
					onclick={() => {}}
					ariaLabel="Reply"
					title="Reply">Reply</EmailButton
				>
			</div>
		</div>
		<!-- Reply Box -->
		<!-- <div class="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 p-4">
			<input
				type="text"
				placeholder="Reply Joe Doe..."
				class="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-gray-600 focus:outline-none"
			/>
		</div> -->
	{:else}
		<div class="flex h-full flex-col items-center justify-center gap-[20px]">
			<Inbox size="80" fill="fill-primary-gray" />
			<div class="text-primary-gray">Select an email to open</div>
		</div>
	{/if}
</div>

<style>
	div {
		transition: background-color 0.3s ease;
	}
</style>
