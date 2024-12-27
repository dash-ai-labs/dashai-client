<script lang="ts">
	import Inbox from '$lib/assets/Inbox.svelte';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import Trash from '$lib/assets/Trash.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import Archive from '$lib/assets/Archive.svelte';
	import EmailButton from './EmailButton.svelte';
	import type { Email } from '$lib/types';
	import { ComposeEmailMode } from '$lib/types';
	import BackgroundGradient from './ui/BackgroundGradient/BackgroundGradient.svelte';
	import { ForwardOutline, ReplyOutline, ReplySolid } from 'flowbite-svelte-icons';

	const {
		removeEmail,
		archiveEmail,
		markEmailAsUnread,
		email,
		setShowComposeEmail,
		setComposeEmailMode
	}: {
		removeEmail: (email: Email) => void;
		archiveEmail: (email: Email) => void;
		markEmailAsUnread: (email: Email) => void;
		email: Email;
		setShowComposeEmail: (show: boolean) => void;
		setComposeEmailMode: (mode: ComposeEmailMode) => void;
	} = $props();
	let element = $state<HTMLIFrameElement | null>(null);

	$effect(() => {
		if (element && email?.raw_content) {
			element.srcdoc = formatEmailContent(email.raw_content);
		}
	});

	function formatEmailContent(content: string): string {
		// Check if content is HTML by looking for DOCTYPE or HTML tags
		const isHTML = /<(!DOCTYPE|html|body)[^>]*>/i.test(content);

		if (isHTML) {
			// For HTML content, just sanitize and return with minimal wrapping
			return `
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
				</head>
				<body style="background-color: #f0f0f0;">
					${DOMPurify.sanitize(content, {
						ADD_TAGS: ['style'],
						ADD_ATTR: ['style']
					})}
				</body>
				</html>
			`;
		} else {
			// For plain text, apply nice formatting
			const urlRegex = /(https?:\/\/[^\s<]+)/g;
			const formattedContent = content
				.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
				.replace(/\r\n|\n|\r/g, '<br>');

			return `
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<style>
						body {
							font-family: Arial, sans-serif;
							line-height: 1.6;
							margin: 20px;
							color: #333;
							max-width: 800px;
							white-space: pre-wrap;
							word-wrap: break-word;
						}
						a {
							color: #0066cc;
							text-decoration: none;
						}
						a:hover {
							text-decoration: underline;
						}
					</style>
				</head>
				<body style="background-color: #f0f0f0;">
					${DOMPurify.sanitize(formattedContent)}
				</body>
				</html>
			`;
		}
	}

	onMount(() => {
		if (element && email?.raw_content) {
			element.srcdoc = formatEmailContent(email.raw_content);
		}
	});

	// let editor = new Editor({
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
	// 	content: email?.raw_content ?? '',
	// 	onTransaction: () => {
	// 		// force re-render so `editor.isActive` works as expected
	// 		editor = editor;
	// 	}
	// });

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

	// Add new state variable for compose email height
	let composeEmailHeight = $state(0);
</script>

<div class="h-full w-full min-w-[740px] max-w-[1200px] rounded-lg bg-primary-container">
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
		<div class="no-scrollbar relative grid max-h-[850px] max-w-[1200px] p-4">
			<iframe
				bind:this={element}
				title={email.subject}
				sandbox="allow-scripts"
				class="no-scrollbar w-full"
				style="height: 780px"
			></iframe>

			<div
				class="absolute bottom-2 z-50 flex flex-row justify-items-end gap-[10px] self-end justify-self-end px-3"
			>
				<BackgroundGradient className="rounded-md max-w-sm px-4 py-2 bg-primary-black ">
					<button
						class="flex flex-row items-center gap-[10px]"
						onclick={() => {
							setShowComposeEmail(true);
							setComposeEmailMode(ComposeEmailMode.Reply);
						}}><ReplyOutline height="20" width="20" class="text-primary-white" />Reply</button
					>
				</BackgroundGradient>
				<BackgroundGradient className="rounded-md max-w-sm px-4 py-2 bg-primary-black">
					<button
						class="flex flex-row items-center gap-[10px]"
						onclick={() => {
							setShowComposeEmail(true);
							setComposeEmailMode(ComposeEmailMode.Forward);
						}}><ForwardOutline height="20" width="20" class="text-primary-white" />Forward</button
					>
				</BackgroundGradient>
			</div>
		</div>

		<!-- Reply Box -->
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
