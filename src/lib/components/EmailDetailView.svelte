<script lang="ts">
	import Inbox from '$lib/assets/Inbox.svelte';
	import DOMPurify from 'dompurify';
	import type { Email, Label } from '$lib/types';
	import { ComposeEmailMode, EmailLabelAction } from '$lib/types';
	import { ForwardOutline, ReplyOutline } from 'flowbite-svelte-icons';
	import { emailLabelAction, getEmailContent } from '$lib/api/email';
	import { get } from 'svelte/store';
	import { user, emailServiceState } from '$lib/store';
	import EmailLabelChip from './EmailLabelChip.svelte';
	import { setShowComposeEmail } from '$lib/actions';

	let element = $state<HTMLIFrameElement | null>(null);
	let email = $state<Email | null>(null);
	let isLoading = $state(false);

	emailServiceState.subscribe((state) => {
		const currentEmail = state.currentEmail;
		if (currentEmail && currentEmail.id !== email?.id) {
			email = currentEmail;

			loadEmailContent(currentEmail);
		}
	});

	function loadEmailContent(email: Email) {
		if (email?.content) {
			isLoading = true;
			const loadContent = async () => {
				const userData = get(user);
				try {
					const content = await getEmailContent({
						user: userData?.id.toString(),
						email_id: email.email_id
					});
					if (element && content) {
						element.srcdoc = content;
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
	const removeLabelFromEmail = (_email: Email, emailLabel: Label) => {
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
</script>

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
							<h1 class="subject">{email.subject}</h1>
							<p class="reply-to">Reply To: {email.sender[0]}</p>
						</div>
						<div class="header-actions">
							<div class="labels-container">
								{#each email.email_labels as label}
									<EmailLabelChip {label} {onLabelClick} />
								{/each}
							</div>

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
						title={email.subject}
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
			<Inbox size="80" class="empty-icon" />
			<div class="empty-text">Select an email to open</div>
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

	/* Converted Tailwind styles */
	.email-detail-container {
		height: 100%;
		min-width: 740px;
		max-width: 1200px;
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--color-primary-container);
	}

	.email-header {
		display: flex;
		height: 60px;
		align-items: center;
		gap: 0.5rem;
		border-bottom: 1px solid var(--color-primary-gray);
		padding: 0 0.75rem;
	}

	.button-group {
		margin: 0 24px;
		display: flex;
		gap: 24px;
	}

	.separator-border {
		display: flex;
		border-left: 1px solid var(--color-secondary-inactive-button-highlight);
		padding: 0 24px;
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
	}

	.add-label-button {
		white-space: nowrap;
		border-radius: 0.5rem;
		border: 1px dashed var(--color-primary-gray);
		padding: 0 1rem;
		color: var(--color-primary-gray);
	}

	.date-display {
		align-items: center;
		text-align: right;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: #9ca3af;
	}

	.email-content-container {
		position: relative;
		display: grid;
		height: calc(100vh - 200px);
		max-height: calc(100vh - 200px);
		max-width: 1200px;
		padding: 1rem;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
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

	.button-icon {
		color: var(--color-primary-white);
	}

	.empty-state {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.empty-icon {
		fill: var(--color-primary-gray);
	}

	.empty-text {
		color: var(--color-primary-gray);
	}
</style>
