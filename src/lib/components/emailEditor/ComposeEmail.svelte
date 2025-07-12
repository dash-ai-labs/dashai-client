<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Node } from '@tiptap/core';
	import Editor from './editor/index.svelte';
	import Bold from '@tiptap/extension-bold';
	import { ComposeEmailMode, ToastType, type Email, type EmailData } from '$lib/types';
	import ReplyButton from './ReplyButton.svelte';
	import ForwardButton from './ForwardButton.svelte';
	import AddressHeader from './AddressHeader.svelte';
	import { user, errorMessage, showErrorModal, emailServiceState, composeEmail } from '$lib/store';
	import { sendEmail } from '$lib/api/email';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import DOMPurify from 'dompurify';
	import type { EditorType } from './emailEditorLibs';
	import { showToast } from '$lib/helpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Footer from './Footer.svelte';
	import { setShowComposeEmail } from '$lib/actions/compose';
	import { get } from 'svelte/store';

	const toastStore = getToastStore();

	let {
		email,
		height = $bindable(),
		composeEmailMode
	}: {
		email: Email;
		height: number;
		composeEmailMode: ComposeEmailMode;
	} = $props();

	let dropDownSelectedOption = 0;
	let emailData: EmailData = $state({
		...get(composeEmail).email,
		from_addr:
			get(emailServiceState).emailAccount.email === 'All Emails'
				? get(user)?.profile?.email_accounts[0].email
				: get(emailServiceState).emailAccount.email
	});
	let editor: EditorType | undefined = $state();

	composeEmail.subscribe((state) => {
		emailData = {
			...state.email
		};
	});

	const setToEmails = (emails: string[]) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				to: emails
			}
		}));
	};

	const setCcEmails = (emails: string[]) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				cc: emails
			}
		}));
	};

	const setBccEmails = (emails: string[]) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				bcc: emails
			}
		}));
	};

	const setFromEmail = (email: string) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				from_addr: email
			}
		}));
	};

	const setSubject = (subject: string) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				subject: subject
			}
		}));
	};

	const setBody = (body: string) => {
		composeEmail.update((state) => ({
			...state,
			email: {
				...state.email,
				body: body
			}
		}));
	};

	const onDropdownSelectOption = (option: number) => {
		dropDownSelectedOption = option;
	};

	const CustomBold = Bold.extend({
		renderHTML({ HTMLAttributes }) {
			return ['b', HTMLAttributes, 0];
		}
	});

	const ComposeOptions = [
		{
			label: '↰',
			component: ReplyButton,
			fn: () => {}
		},
		{
			label: '↱',
			component: ForwardButton,
			fn: () => {}
		}
	];

	const setLink = () => {
		if (editor?.isActive('link')) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		const previousUrl = editor?.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor?.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		if (!/^https?:\/\//.test(url)) {
			window.alert('DIRECCIÓN INVÁLIDA!!');
			return;
		}

		// update link
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	const onSend = () => {
		if (!emailData.from_addr) {
			errorMessage.set('Please select a sender email address');
			showErrorModal.set(true);
			return;
		}

		if (!emailData.to.length) {
			errorMessage.set('Please add at least one recipient');
			showErrorModal.set(true);
			return;
		}

		if (!emailData.body.length) {
			errorMessage.set('Please add a message body');
			showErrorModal.set(true);
			return;
		}

		const _sendEmail = async () => {
			showToast(toastStore, 'Sending email...', ToastType.Info);
			await sendEmail({ user: $user?.id, email: emailData });
			showToast(toastStore, 'Email sent successfully', ToastType.Success);
			_clearEmailData();
			setShowComposeEmail(false);
			editor?.destroy();
		};
		_sendEmail();
	};

	const _clearEmailData = () => {
		composeEmail.update((state) => ({
			...state,
			email: {
				from_addr: '',
				to: [],
				cc: [],
				bcc: [],
				subject: '',
				body: '',
				attachments: []
			}
		}));
	};

	const EmailQuote = Node.create({
		name: 'emailQuote',

		group: 'block',

		content: 'block+',

		defining: true,

		parseHTML() {
			return [
				{
					tag: 'blockquote[data-type="email-quote"]'
				}
			];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'blockquote',
				{ 'data-type': 'email-quote', class: 'pl-4 border-l-4 border-gray-300' },
				[
					'iframe',
					{
						srcdoc: 0,
						frameborder: '0',
						class: 'w-full h-full',
						sandbox: 'allow-same-origin'
					}
				]
			];
		}
	});
	const sanitizeHtml = (html) => {
		// Configure DOMPurify to allow certain tags and attributes
		// const config = {
		// 	ALLOWED_TAGS: [
		// 		'p',
		// 		'br',
		// 		'strong',
		// 		'em',
		// 		'u',
		// 		'a',
		// 		'ul',
		// 		'ol',
		// 		'li',
		// 		'table',
		// 		'thead',
		// 		'tbody',
		// 		'tr',
		// 		'td',
		// 		'th',
		// 		'img',
		// 		'h1',
		// 		'h2',
		// 		'h3',
		// 		'h4',
		// 		'h5',
		// 		'h6',
		// 		'blockquote',
		// 		'div',
		// 		'span'
		// 	],
		// 	ALLOWED_ATTR: [
		// 		'href',
		// 		'src',
		// 		'alt',
		// 		'class',
		// 		'style',
		// 		'target',
		// 		'rel',
		// 		'data-type',
		// 		'width',
		// 		'height'
		// 	],
		// 	ALLOW_DATA_ATTR: true
		// };

		return DOMPurify.sanitize(html);
	};
	const formatThread = (thread) => {
		const sanitizedContent = sanitizeHtml(thread.raw_content);

		return `
        <div class="mt-4 mb-4 text-white">
            <blockquote data-type="email-quote" style="text-color: white;" class="pl-4 text-white border-l-4 border-gray-300">
                ${email.raw_content}
            </blockquote>
        </div>
    `;
	};

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
				<body style="background-color: var(--color-primary-container);">
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
							color: var(--color-font-black);
							max-width: 800px;
							white-space: pre-wrap;
							word-wrap: break-word;
						}
						a {
							color: var(--color-primary-blue);
							text-decoration: none;
						}
						a:hover {
							text-decoration: underline;
						}
					</style>
				</head>
				<body style="background-color: var(--color-primary-container);">
					${DOMPurify.sanitize(formattedContent)}
				</body>
				</html>
			`;
		}
	}

	onMount(() => {
		if (
			composeEmailMode === ComposeEmailMode.Reply ||
			composeEmailMode === ComposeEmailMode.Forward
		) {
			if (composeEmailMode === ComposeEmailMode.Reply) {
				setSubject(`Re: ${email.subject}`);
			}
			if (composeEmailMode === ComposeEmailMode.Forward) {
				setSubject(`Fwd: ${email.subject}`);
			}
		} else {
			setSubject('');
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="compose-email-container">
	<div class="compose-email-header">
		{#if emailData.subject === '' && composeEmailMode === ComposeEmailMode.NewEmail}
			<div class="compose-email-title">New Email</div>
		{:else}
			<div class="compose-email-title">{emailData.subject}</div>
		{/if}
		<div class="compose-email-close-container">
			<button class="compose-email-close-button" onclick={() => setShowComposeEmail(false)}>
				<CloseOutline name="close" />
			</button>
		</div>
	</div>
	<div class="compose-email-address-header">
		<AddressHeader {email} {composeEmailMode} />
	</div>
	<div class="compose-email-editor">
		<Editor bind:editor />
	</div>
	<div class="compose-email-footer">
		<Footer {onSend} bind:editor />
	</div>
</div>

<style>
	.compose-email-container {
		position: fixed;
		bottom: -1px;
		right: 0.5rem;
		z-index: 50;
		width: 50%;
		height: 800px;
		overflow: hidden;
		border-radius: 1rem 1rem 0 0;
		border: 1px solid var(--color-primary-gray);
		background-color: var(--color-primary-black);
	}

	.compose-email-header {
		display: flex;
		flex-direction: row;
		background-color: var(--color-primary-hazy-black);
		padding: 0.25rem 0.75rem;
		color: var(--color-secondary-light-blue);
	}

	.compose-email-title {
		align-self: center;
		padding: 0.5rem;
	}

	.compose-email-close-container {
		margin-left: auto;
		align-self: center;
	}

	.compose-email-close-button {
		align-self: center;
		color: var(--color-primary-gray);
	}

	.compose-email-address-header {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		display: flex;
		justify-content: flex-start;
		border-bottom: 1px solid var(--color-primary-gray);
		color: var(--color-font-light-gray);
	}

	.compose-email-editor {
		height: 560px;
	}

	.compose-email-footer {
		justify-content: flex-start;
		color: var(--color-primary-gray);
		padding-inline: 10px;
		padding-block: 5px;
		bottom: 5px;
	}
</style>
