<script lang="ts">
	import Inbox from '$lib/assets/Inbox.svelte';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import Trash from '$lib/assets/Trash.svelte';
	import UnreadMail from '$lib/assets/UnreadMail.svelte';
	import Archive from '$lib/assets/Archive.svelte';
	import EmailButton from './EmailButton.svelte';
	import type { Email, Label } from '$lib/types';
	import { ComposeEmailMode } from '$lib/types';
	import { ForwardOutline, ReplyOutline } from 'flowbite-svelte-icons';
	import { getEmailContent } from '$lib/api/email';
	import { get } from 'svelte/store';
	import { user } from '$lib/store';
	import AddEmailLabel from './AddEmailLabel.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import EmailLabelChip from './EmailLabelChip.svelte';
	const {
		removeEmail,
		archiveEmail,
		markEmailAsUnread,
		email,
		setShowComposeEmail,
		setComposeEmailMode,
		addLabelToEmail,
		removeLabelFromEmail
	}: {
		removeEmail: (email: Email) => void;
		archiveEmail: (email: Email) => void;
		markEmailAsUnread: (email: Email) => void;
		email: Email;
		setShowComposeEmail: (show: boolean) => void;
		setComposeEmailMode: (mode: ComposeEmailMode) => void;
		addLabelToEmail: (email: Email, emailLabel: Label) => void;
		removeLabelFromEmail: (email: Email, emailLabel: Label) => void;
	} = $props();
	let element = $state<HTMLIFrameElement | null>(null);

	$effect(() => {
		if (element && email?.content) {
			const loadContent = async () => {
				const userData = get(user);
				const content = await getEmailContent({
					user: userData?.id.toString(),
					email_id: email.email_id
				});
				if (element && content) {
					element.srcdoc = content;
				}
			};
			loadContent();
		}
	});
	const addLabelPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'addLabelPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
		closeQuery: ''
	};

	function formatEmailContent(content: string): string {
		const isHTML = /<(!DOCTYPE|html|body)[^>]*>/i.test(content);
		const baseStyles = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background-color: #f0f0f0 !important;
        }
        body {
          padding: 20px;
        }
      </style>
    `;

		if (isHTML) {
			return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${baseStyles}
        </head>
        <body>
            ${DOMPurify.sanitize(content, {
							ADD_TAGS: ['style'],
							ADD_ATTR: ['style', 'nonce'],
							ALLOW_DATA_ATTR: true
						})}
        </body>
        </html>
    `;
		} else {
			// Rest of the plain text formatting remains the same
			const urlRegex = /(https?:\/\/[^\s<]+)/g;
			const formattedContent = content
				.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
				.replace(/\r\n|\n|\r/g, '<br>');

			return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${baseStyles}
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
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
        <body>
            ${DOMPurify.sanitize(formattedContent, {
							ADD_ATTR: ['nonce'],
							ALLOW_DATA_ATTR: true
						})}
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

	const onLabelClick = (label: Label) => {
		removeLabelFromEmail(email, label);
	};
</script>

<div class="h-full min-w-[740px] max-w-[1200px] rounded-lg bg-primary-container">
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
						<div class="flex flex-col gap-1">
							<div class="flex flex-row items-center justify-end gap-1">
								{#each email.email_labels as label}
									<EmailLabelChip {label} {onLabelClick} />
								{/each}
								<button
									use:popup={addLabelPopup}
									class="whitespace-nowrap rounded-lg border-[1px] border-dashed border-primary-gray px-4 text-primary-gray"
									>+ Label</button
								>
							</div>
							<div data-popup="addLabelPopup">
								<AddEmailLabel {email} {addLabelToEmail} />
							</div>
							<span class="items-center text-right text-sm text-gray-400"
								>{formatDate(email.date)}</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="no-scrollbar relative grid h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] max-w-[1200px] p-4"
		>
			<div class=" flex h-full flex-col overflow-hidden">
				<!-- Email content container with proper height constraints -->
				<div class="relative min-h-0 flex-1 overflow-auto">
					<!-- If you're using an iframe for email content -->
					<iframe
						bind:this={element}
						title={email.subject}
						sandbox="allow-same-origin allow-popups"
						class="no-scrollbar h-full w-full bg-primary-white"
						style="background-color: #f0f0f0;"
					></iframe>

					<!-- Fixed position buttons that will always be visible -->
					<div
						class="absolute bottom-[100px] right-[10px] z-50 flex flex-row justify-end gap-[10px]"
					>
						<div
							class="max-w-sm rounded-md border border-primary-white bg-primary-black px-4 py-2 shadow-lg"
						>
							<button
								class="flex flex-row items-center gap-[10px]"
								onclick={() => {
									setShowComposeEmail(true);
									setComposeEmailMode(ComposeEmailMode.Reply);
								}}><ReplyOutline height="20" width="20" class="text-primary-white" />Reply</button
							>
						</div>
						<div
							class="max-w-sm rounded-md border border-primary-white bg-primary-black px-4 py-2 shadow-lg"
						>
							<button
								class="flex flex-row items-center gap-[10px]"
								onclick={() => {
									setShowComposeEmail(true);
									setComposeEmailMode(ComposeEmailMode.Forward);
								}}
								><ForwardOutline height="20" width="20" class="text-primary-white" />Forward</button
							>
						</div>
					</div>
				</div>
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

	[data-popup] {
		/* Display */
		display: none;
		/* Position */
		z-index: 50;
		position: absolute;
		top: 0;
		left: 1;
	}

	/* Make sure iframe doesn't exceed its container */
	iframe {
		max-height: 100%;
		box-sizing: border-box;
	}

	/* If you're using direct HTML rendering */
	.email-content {
		max-height: 100%;
		overflow: auto;
	}
</style>
