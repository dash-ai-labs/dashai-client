<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Inbox from '$lib/assets/Inbox.svelte';
	import DOMPurify from 'dompurify';
	import type { Email, Label } from '$lib/types';
	import { ComposeEmailMode, EmailLabelAction } from '$lib/types';
	import { ForwardOutline, ReplyOutline } from 'flowbite-svelte-icons';
	import { emailLabelAction, getEmailContent } from '$lib/api/email';
	import { get } from 'svelte/store';
	import { user, emailServiceState } from '$lib/store';
	import type { EmailServiceState } from '$lib/types';
	import EmailLabelChip from './EmailLabelChip.svelte';
	import { setShowComposeEmail } from '$lib/actions/compose';
	import AddEmailLabel from './AddEmailLabel.svelte';
	import {
		IconDownload,
		IconFile,
		IconFileTypePdf,
		IconFileTypePpt,
		IconFileTypeXls,
		IconFileWord,
		IconPhoto,
		IconPlus,
		IconX
	} from '@tabler/icons-svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	let element = $state<HTMLIFrameElement | null>(null);
	let email = $state<Email | null>(null);
	let isLoading = $state(false);
	let isDrawerOpen = $state(false);
	let justOpened = $state(false); // Track if drawer was just opened

	emailServiceState.subscribe((state) => {
		const currentEmail = state.currentEmail;

		if (currentEmail && currentEmail.id !== email?.id) {
			email = currentEmail;
			isDrawerOpen = true; // Open drawer when email is selected
			justOpened = true; // Mark as just opened
			loadEmailContent(currentEmail);

			// Reset the justOpened flag after a short delay
			setTimeout(() => {
				justOpened = false;
			}, 300);
		} else if (!currentEmail) {
			// Close drawer if no email is selected
			email = null;
			isDrawerOpen = false;
			justOpened = false;
		}
	});

	// Function to close the drawer
	const closeDrawer = () => {
		isDrawerOpen = false;
		justOpened = false; // Reset the flag
		// Optionally clear the current email
		emailServiceState.update((state) => ({
			...state,
			currentEmail: null
		}));
	};

	// Add global keyboard listener for Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isDrawerOpen) {
			closeDrawer();
		}
	}

	// Add click outside listener to close drawer
	function handleClickOutside(event: MouseEvent) {
		if (!isDrawerOpen || justOpened) return; // Don't close if just opened

		const drawer = document.querySelector('.email-drawer');
		if (drawer && !drawer.contains(event.target as Node)) {
			closeDrawer();
		}
	}

	// Add and remove event listeners
	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
			window.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('click', handleClickOutside);
		}
	});

	function loadEmailContent(email: Email) {
		if (email?.content) {
			isLoading = true;
			const loadContent = async () => {
				const userData = get(user);
				try {
					const content = await getEmailContent({
						user: userData?.id?.toString() || '',
						email_id: email.email_id
					});
					if (element && content && typeof content === 'string') {
						element.srcdoc = formatEmailContent(content);

						emailServiceState.update((state: EmailServiceState) => ({
							...state,
							currentEmail: state.currentEmail
								? {
										...state.currentEmail,
										raw_content: content
									}
								: null
						}));
					}
				} catch (error) {
					console.error('Error loading email content:', error);
				} finally {
					isLoading = false;
				}
			};
			loadContent();
		}
	}

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
	const removeLabelFromEmail = (_email: Email | null, emailLabel: Label) => {
		const _removeLabelFromEmail = async () => {
			const currentUser = get(user);
			if (!currentUser?.id || !_email) return;

			const res = await emailLabelAction({
				user: currentUser.id.toString(),
				email_id: _email.email_id,
				label_id: emailLabel.id,
				action: EmailLabelAction.Remove
			});
			if (res) {
				email = res;
				emailServiceState.update((state) => ({
					...state,
					currentEmail: state.currentEmail?.email_id === _email.email_id ? res : state.currentEmail,
					emailList: state.emailList.map((email) =>
						email.email_id === _email.email_id ? res : email
					)
				}));
			}
		};
		_removeLabelFromEmail();
	};
	const onLabelClick = (label: Label) => {
		removeLabelFromEmail(email, label);
	};
	const addLabelPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'addLabelPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
		closeQuery: ''
	};

	const icons = {
		pdf: IconFileTypePdf,
		excel: IconFileTypeXls,
		word: IconFileWord,
		ppt: IconFileTypePpt,
		image: IconPhoto,
		default: IconFile
	};

	function getFileTypeFromName(filename: string) {
		if (!filename) return 'default';

		// Get the last part after the last dot
		const ext = filename.split('.').pop()?.toLowerCase();

		if (!ext) return 'default';

		if (ext === 'pdf') return 'pdf';
		if (['xls', 'xlsx'].includes(ext)) return 'excel';
		if (['doc', 'docx'].includes(ext)) return 'word';
		if (['ppt', 'pptx'].includes(ext)) return 'ppt';
		if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';

		return 'default';
	}

	function formatFileSize(bytes: number) {
		const KB = 1024;
		const MB = KB * 1024;
		const GB = MB * 1024;
		const TB = GB * 1024;

		if (bytes < KB) {
			return `${bytes} B`;
		} else if (bytes < MB) {
			return `${(bytes / KB).toFixed(1)} KB`;
		} else if (bytes < GB) {
			return `${(bytes / MB).toFixed(1)} MB`;
		} else if (bytes < TB) {
			return `${(bytes / GB).toFixed(1)} GB`;
		} else {
			return `${(bytes / TB).toFixed(1)} TB`;
		}
	}

	function downloadAll(attachments: any[]) {
		attachments.forEach((att: any) => {
			const a = document.createElement('a');
			a.href = att.url;
			a.download = att.name || ''; // let browser keep original filename
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}
</script>

<!-- No overlay - users can interact with background components -->

<!-- Drawer container -->
<div class="email-drawer" class:drawer-open={isDrawerOpen}>
	<!-- Drawer header with close button -->
	<div class="drawer-header">
		<button class="close-button" onclick={closeDrawer}>
			<IconX size={24} />
		</button>
	</div>

	<div class="email-detail-container">
		{#if email}
			<!-- Message Content -->
			<div class="message-header">
				<div class="sender-info">
					<div class="avatar">
						{email.sender_name && email.sender_name[0]
							? email.sender_name[0][0]
							: email.sender && email.sender[0]
								? email.sender[0][0]
								: ''}
					</div>
					<div class="content-wrapper">
						<div class="header-row">
							<div>
								<div class="subject-container">
									<h1 class="subject">{email.subject}</h1>
									<div class="labels-container">
										{#each email.email_labels as label}
											<EmailLabelChip {label} {onLabelClick} />
										{/each}
										<button class="add-labels-button" use:popup={addLabelPopup}>
											Add label<IconPlus size={16} />
										</button>
										<div data-popup="addLabelPopup">
											<AddEmailLabel {email} />
										</div>
									</div>
								</div>
								<p class="reply-to">Reply To: {email.sender[0]}</p>
								{#if email.attachments && email.attachments.length > 1}
									<div>
										<div role="listbox" aria-label="file attachments" class="attachment-list">
											{#each email.attachments as attachment}
												<a
													href={attachment.url}
													download
													title="Download"
													class="attachment-item"
													role="option"
													aria-selected="false"
													aria-label={attachment.name}
												>
													<span class="attachment-icon">
														<svelte:component
															this={icons[getFileTypeFromName(attachment.name)]}
															size={20}
															color="var(--color-primary-light-gray)"
														/>
													</span>
													<span class="attachment-name" title={attachment.name}
														>{attachment.name}</span
													>
													{#if attachment.size}
														<span class="attachment-size">{formatFileSize(attachment.size)}</span>
													{/if}
												</a>
											{/each}
											<button class="attachment-item" onclick={() => downloadAll(email.attachments)}
												><IconDownload size={20} color="var(--color-primary-light-gray)" />
												Download All
											</button>
										</div>
									</div>
								{/if}
							</div>

							<div class="header-actions">
								<span class="date-display">{formatDate(email.date)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="email-content-container">
				<div class="email-content-wrapper">
					<!-- Email content container with proper height constraints -->
					<div class="iframe-container">
						<!-- Add loading indicator -->
						{#if isLoading}
							<div class="loading-overlay">
								<div class="loading-spinner"></div>
							</div>
						{/if}

						<!-- If you're using an iframe for email content -->
						<iframe
							bind:this={element}
							title={email?.subject || 'Email'}
							sandbox="allow-same-origin allow-popups"
							class="email-iframe"
							style="background-color: #f0f0f0;"
						></iframe>

						<!-- Fixed position buttons that will always be visible -->
						<div class="action-buttons">
							<div class="action-button-container">
								<button
									class="action-button"
									onclick={() => {
										setShowComposeEmail(true, ComposeEmailMode.Reply);
									}}><ReplyOutline height="20" width="20" class="button-icon" />Reply</button
								>
							</div>
							<div class="action-button-container">
								<button
									class="action-button"
									onclick={() => {
										setShowComposeEmail(true, ComposeEmailMode.Forward);
									}}><ForwardOutline height="20" width="20" class="button-icon" />Forward</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="empty-state">
				<Inbox size={80} />
				<div class="empty-text">Select an email to open</div>
			</div>
		{/if}
	</div>
</div>

<style>
	div {
		transition: background-color 0.3s ease;
	}

	/* Drawer styles */
	.email-drawer {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 55%;
		max-width: 750px;
		min-width: 550px;
		background-color: var(--color-primary-container);
		border-left: 1px solid var(--color-primary-gray);
		z-index: 30;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		pointer-events: auto;
	}

	.email-drawer.drawer-open {
		transform: translateX(0);
	}

	.drawer-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--color-primary-gray);
		background-color: var(--color-primary-container);
		min-height: 60px;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: transparent;
		border: 1px solid var(--color-primary-gray);
		color: var(--color-primary-gray);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background-color: var(--color-primary-dark-gray);
		color: var(--color-primary-white);
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

	.subject-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	/* Converted Tailwind styles */
	.email-detail-container {
		height: 100%;
		width: 100%;
		background-color: var(--color-primary-container);
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.message-header {
		border-bottom: 1px solid var(--color-primary-gray);
		padding: 1.5rem;
	}

	.sender-info {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.avatar {
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: #16a34a;
		font-weight: 500;
		color: white;
	}

	.content-wrapper {
		flex: 1;
	}

	.header-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.subject {
		font-size: 1.125rem;
		line-height: 1.75rem;
	}

	.reply-to {
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: #9ca3af;
	}

	.header-actions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.labels-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		gap: 0.25rem;
		margin-left: 10px;
	}

	.date-display {
		align-items: center;
		text-align: right;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: #9ca3af;
	}
	.add-labels-button {
		border-radius: 4px;
		padding: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
		border-radius: 4px;
		color: var(--color-primary-gray);
		border: 1px dashed var(--color-primary-dark-gray);
	}

	.add-labels-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.email-content-container {
		position: relative;
		flex: 1;
		padding: 1rem;
		overflow: hidden;
	}

	.email-content-wrapper {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
	}

	.iframe-container {
		position: relative;
		min-height: 0;
		flex: 1;
		overflow: auto;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.loading-spinner {
		height: 2rem;
		width: 2rem;
		animation: spin 1s linear infinite;
		border-radius: 9999px;
		border: 4px solid var(--color-primary-gray);
		border-top-color: var(--color-primary-black);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.email-iframe {
		height: 100%;
		width: 100%;
		background-color: var(--color-primary-white);
	}

	.action-buttons {
		position: absolute;
		bottom: 120px;
		right: 10px;
		z-index: 50;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		gap: 10px;
	}

	.action-button-container {
		max-width: 20rem;
		border-radius: 0.375rem;
		border: 1px solid var(--color-primary-white);
		background-color: var(--color-primary-black);
		padding: 0.5rem 1rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.action-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.empty-state {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.empty-text {
		color: var(--color-primary-gray);
	}

	.attachment-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		max-width: 100%;
		max-height: 200px;
		overflow-y: auto;
		padding: 4px;
		box-sizing: border-box;
	}

	.attachment-item {
		display: flex;
		align-items: center;
		justify-content: left;
		gap: 10px;
		padding: 8px 10px;
		background: var(--color-primary-container);
		border: 2px solid var(--color-secondary-active-button-background);
		border-radius: 8px;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
		width: 200px;
		height: 50px;
		text-wrap: wrap;
		box-sizing: border-box;
	}

	.attachment-item:hover {
		border: 1px solid var(--color-primary-button-hover);
		box-shadow: 0 0 2px var(--color-primary-button-hover);
		cursor: pointer;
	}

	.attachment-icon {
		width: 24px;
		height: 24px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: right;
	}

	.attachment-name {
		flex: 1;
		font-size: 14px;
		color: var(--color-font-light-gray);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.attachment-size {
		font-size: 12px;
		color: var(--color-font-gray);
	}
</style>
