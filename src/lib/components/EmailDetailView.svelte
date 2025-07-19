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
	import { setShowComposeEmail } from '$lib/actions/compose';
	import AddEmailLabel from './AddEmailLabel.svelte';
	import { IconPlus } from '@tabler/icons-svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

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

						emailServiceState.update((state: EmailServiceState) => ({
							...state,
							currentEmail: {
								...state.currentEmail,
								raw_content: content
							}
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
		pdf: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M2.5 6.5V6H2v.5zm4 0V6H6v.5zm0 4H6v.5h.5zm7-7h.5v-.207l-.146-.147zm-3-3l.354-.354L10.707 0H10.5zM2.5 7h1V6h-1zm.5 4V8.5H2V11zm0-2.5v-2H2v2zm.5-.5h-1v1h1zm.5-.5a.5.5 0 0 1-.5.5v1A1.5 1.5 0 0 0 5 7.5zM3.5 7a.5.5 0 0 1 .5.5h1A1.5 1.5 0 0 0 3.5 6zM6 6.5v4h1v-4zm.5 4.5h1v-1h-1zM9 9.5v-2H8v2zM7.5 6h-1v1h1zM9 7.5A1.5 1.5 0 0 0 7.5 6v1a.5.5 0 0 1 .5.5zM7.5 11A1.5 1.5 0 0 0 9 9.5H8a.5.5 0 0 1-.5.5zM10 6v5h1V6zm.5 1H13V6h-2.5zm0 2H12V8h-1.5zM2 5V1.5H1V5zm11-1.5V5h1V3.5zM2.5 1h8V0h-8zm7.646-.146l3 3l.708-.708l-3-3zM2 1.5a.5.5 0 0 1 .5-.5V0A1.5 1.5 0 0 0 1 1.5zM1 12v1.5h1V12zm1.5 3h10v-1h-10zM14 13.5V12h-1v1.5zM12.5 15a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5zM1 13.5A1.5 1.5 0 0 0 2.5 15v-1a.5.5 0 0 1-.5-.5z"/></svg>',
		excel:
			'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#20744a" fill-rule="evenodd" d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z"/><path fill="#20744a" d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z"/><path fill="#fff" fill-rule="evenodd" d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z"/></svg>',
		word: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="vscodeIconsFileTypeWord0" x1="4.494" x2="13.832" y1="-1712.086" y2="-1695.914" gradientTransform="translate(0 1720)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2368c4"/><stop offset=".5" stop-color="#1a5dbe"/><stop offset="1" stop-color="#1146ac"/></linearGradient></defs><path fill="#41a5ee" d="M28.806 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5l11.069 3.25L30 9.5V4.191A1.19 1.19 0 0 0 28.806 3"/><path fill="#2b7cd3" d="M30 9.5H8.512V16l11.069 1.95L30 16Z"/><path fill="#185abd" d="M8.512 16v6.5l10.418 1.3L30 22.5V16Z"/><path fill="#103f91" d="M9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5H8.512v5.309A1.19 1.19 0 0 0 9.705 29"/><path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity="0.1"/><path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path fill="url(#vscodeIconsFileTypeWord0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"/><path fill="#fff" d="M6.9 17.988q.035.276.046.481h.028q.015-.195.065-.47c.05-.275.062-.338.089-.465l1.255-5.407h1.624l1.3 5.326a8 8 0 0 1 .162 1h.022a8 8 0 0 1 .135-.975l1.039-5.358h1.477l-1.824 7.748h-1.727l-1.237-5.126q-.054-.222-.122-.578t-.084-.52h-.021q-.021.189-.084.561t-.1.552L7.78 19.871H6.024L4.19 12.127h1.5l1.131 5.418a5 5 0 0 1 .079.443"/></svg>',
		ppt: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#d33922" d="M18.536 2.321v2.863c3.4.019 7.357-.035 10.754.016c.642 0 .67.568.678 1.064c.054 5.942-.013 12.055.032 18c-.012.234-.006 1.1-.013 1.346c-.022.823-.434.859-1.257.884c-.132 0-.52.006-.648.012c-3.181-.016-6.362-.009-9.546-.009v3.182L2 27.134V4.873z"/><path fill="#fff" d="M18.536 6.138h10.5v19.4h-10.5V23h7.634v-1.275h-7.634v-1.59h7.634v-1.272h-7.631q.002-.936-.006-1.87a4.47 4.47 0 0 0 3.82-.375a4.35 4.35 0 0 0 1.959-3.474c-1.4-.01-2.793-.006-4.186-.006c0-1.384.016-2.767-.029-4.148c-.522.1-1.043.21-1.562.321V6.139"/><path fill="#d33922" d="M20.766 8.324a4.476 4.476 0 0 1 4.186 4.167c-1.4.016-2.793.01-4.189.01V8.324"/><path fill="#fff" d="M7.1 10.726c1.727.083 3.82-.684 5.252.611c1.371 1.664 1.008 4.724-1.024 5.719A4.7 4.7 0 0 1 9 17.348c0 1.244-.006 2.488 0 3.731q-.947-.082-1.893-.159c-.029-3.4-.035-6.8 0-10.2"/><path fill="#d33922" d="M8.993 12.446c.627-.029 1.4-.143 1.826.445a2.3 2.3 0 0 1 .041 2.087c-.363.655-1.183.592-1.816.668c-.067-1.066-.06-2.131-.051-3.2"/></svg>',
		image:
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h13a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11.59l4.29-4.3l2.5 2.5l5-5L20 16V6a2 2 0 0 0-2-2zm4.79 13.21l-2.5-2.5L3 19a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.59l-5.21-5.2zM7.5 6A2.5 2.5 0 0 1 10 8.5A2.5 2.5 0 0 1 7.5 11A2.5 2.5 0 0 1 5 8.5A2.5 2.5 0 0 1 7.5 6m0 1A1.5 1.5 0 0 0 6 8.5A1.5 1.5 0 0 0 7.5 10A1.5 1.5 0 0 0 9 8.5A1.5 1.5 0 0 0 7.5 7"/></svg>',
		default:
			'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M15 4v16.563L9.719 15.28L8.28 16.72l7 7l.719.687l.719-.687l7-7l-1.438-1.438l-5.28 5.28V4zM7 26v2h18v-2z"/></svg>'
	};

	function getFileTypeFromName(filename: string) {
		if (!filename) return 'default';

		// Get the last part after the last dot
		const ext = filename.split('.').pop().toLowerCase();

		if (ext === 'pdf') return 'pdf';
		if (['xls', 'xlsx'].includes(ext)) return 'excel';
		if (['doc', 'docx'].includes(ext)) return 'word';
		if (['ppt', 'pptx'].includes(ext)) return 'ppt';
		if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';

		return 'default';
	}

	function formatFileSize(kb: number) {
		if (kb < 1024) {
			return `${kb.toFixed(1)} KB`; // Less than 1MB → show in KB
		}

		const mb = kb / 1024;
		if (mb < 1024) {
			return `${mb.toFixed(1)} MB`; // Less than 1GB → show in MB
		}

		const gb = mb / 1024;
		if (gb < 1024) {
			return `${gb.toFixed(2)} GB`; // Less than 1TB → show in GB
		}

		const tb = gb / 1024;
		return `${tb.toFixed(2)} TB`; // Huge files → show TB
	}

	function downloadAll(attachments) {
		attachments.forEach((att) => {
			const a = document.createElement('a');
			a.href = att.url;
			a.download = att.name || ''; // let browser keep original filename
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}
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
							<div>
								<div role="listbox" aria-label="file attachments" class="attachment-list">
									{#each email.attachments as attachment}
										<a
											href={attachment.url}
											download
											title="Download"
											class="attachment-item"
											role="option"
											aria-label={attachment.name}
										>
											<!-- Name + size -->
											<span class="attachment-name" title={attachment.name}>{attachment.name}</span>
											{#if attachment.size}
												<span class="attachment-size">{formatFileSize(attachment.size)} KB</span>
											{/if}

											<!-- Download icon -->
											<span class="download-btn">
												{@html icons[getFileTypeFromName(attachment.name)]}
											</span>
										</a>
									{/each}
									<button class="download-all" onClick={() => downloadAll(email.attachments)}>
										⬇ Download All
									</button>
								</div>
							</div>
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

	.subject-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	/* Converted Tailwind styles */
	.email-detail-container {
		height: 100%;
		min-width: 740px;
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
		margin-left: 10px;
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
		display: grid;
		height: calc(100vh - 200px);
		max-height: calc(100vh - 200px);
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

	.attachment-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		/* Prevent overflow */
		max-width: 100%; /* never exceed parent */
		max-height: 200px; /* limit height */
		overflow-y: auto; /* scroll if needed */
		padding: 4px;
		box-sizing: border-box;
	}

	.attachment-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		background: var(--color-primary-container); /* subtle dark background */
		border: 2px solid var(--color-secondary-active-button-background); /* dark blue outline */
		border-radius: 8px;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
		width: 220px; /* fixed width */
		height: 50px; /* fixed height */
		box-sizing: border-box;
	}

	.attachment-item:hover {
		border-color: var(--color-primary-button); /* brighter blue on hover */
		box-shadow: 0 0 6px var(--color-primary-button);
	}

	.attachment-icon {
		width: 24px;
		height: 24px;
		object-fit: cover;
		border-radius: 4px;
	}

	.attachment-name {
  	flex: 1;                    /* take up available space */
  	font-size: 14px;
  	color: var(--color-font-light-gray);
		
  	/* Truncate with ellipsis */
  	white-space: nowrap;        /* keep on one line */
  	overflow: hidden;           /* hide overflow */
  	text-overflow: ellipsis;    /* add "..." */
  	max-width: 140px;           /* limit width so it doesn’t push icons */
}

	.attachment-size {
		font-size: 12px;
		color: var(--color-font-gray);
	}
</style>
