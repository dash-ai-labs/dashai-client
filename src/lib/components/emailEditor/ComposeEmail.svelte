<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Node } from '@tiptap/core';
	import Editor from './editor/index.svelte';
	import Bold from '@tiptap/extension-bold';
	import { ComposeEmailMode, ToastType, type Email, type EmailData } from '$lib/types';
	import ReplyButton from './ReplyButton.svelte';
	import ForwardButton from './ForwardButton.svelte';
	import AddressHeader from './AddressHeader.svelte';
	import { user, errorMessage, showErrorModal, emailServiceState } from '$lib/store';
	import { sendEmail } from '$lib/api/email';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import DOMPurify from 'dompurify';
	import type { EditorType } from './lib';
	import { showToast } from '$lib/helpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Footer from './Footer.svelte';
	import { setShowComposeEmail } from '$lib/actions';

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
	let element: HTMLElement;
	let bmenu: HTMLElement;
	let dropDownSelectedOption = 0;
	let emailData: EmailData = $state({
		subject: '',
		body: '',
		from_addr: '',
		to: [],
		cc: [],
		bcc: [],
		attachments: []
	});
	let suggestionText = $state('');
	let saveStatus = $state('Saved');
	let editor: EditorType;

	$effect(() => {
		emailServiceState.update((state) => ({
			...state,
			currentEmail: email
		}));
	});

	const setToEmails = (emails: string[]) => {
		emailData.to = emails;
	};

	const setCcEmails = (emails: string[]) => {
		emailData.cc = emails;
	};

	const setBccEmails = (emails: string[]) => {
		emailData.bcc = emails;
	};

	const setFromEmail = (email: string) => {
		emailData.from_addr = email;
	};

	const setSubject = (subject: string) => {
		emailData.subject = subject;
	};

	const setBody = (body: string) => {
		emailData.body = body;
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
		if (editor.isActive('link')) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		if (!/^https?:\/\//.test(url)) {
			window.alert('DIRECCIÓN INVÁLIDA!!');
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
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
			await sendEmail({ user: $user.id, email: emailData });
			showToast(toastStore, 'Email sent successfully', ToastType.Success);
			_clearEmailData();
			setShowComposeEmail(false);
			editor.destroy();
		};
		_sendEmail();
	};

	const _clearEmailData = () => {
		emailData.subject = '';
		emailData.body = '';
		emailData.from_addr = '';
		emailData.to = [];
		emailData.cc = [];
		emailData.bcc = [];
		emailData.attachments = [];
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

	$effect(() => {
		if (!editor) return;

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

			const setContent = async () => {
				try {
					// Clear existing content first
					editor.commands.clearContent();
					const formattedContent = formatEmailContent(email.raw_content);
					// Add some spacing
					// Try setting the raw content first

					// Move cursor to top
					await editor.commands.setTextSelection(0);

					// Log the editor's content for debugging
				} catch (error) {
					console.error('Error setting content:', error);
				}
			};
			// setContent();
		} else {
			// editor.commands.clearContent();
			setSubject('');
		}
	});

	onDestroy(() => {
		// if (editor) {
		// 	editor.destroy();
		// }
	});
</script>

<div
	class="fixed bottom-[-10px] right-2 z-50 w-[50%] overflow-hidden rounded-2xl rounded-b-none border border-primary-gray bg-primary-black"
>
	<div class="flex flex-row bg-primary-hazy-black px-3 py-1 text-primary-button">
		{#if emailData.subject === '' && composeEmailMode === ComposeEmailMode.NewEmail}
			<div class="self-center px-2 py-2">New Email</div>
		{:else}
			<div class="self-center px-2 py-2">{emailData.subject}</div>
		{/if}
		<div class="ml-auto self-center">
			<button class="self-start py-2 text-primary-gray" onclick={() => setShowComposeEmail(false)}>
				<CloseOutline name="close" />
			</button>
		</div>
	</div>
	<div class="mx-2 flex justify-start border-b border-primary-gray text-font-light-gray">
		<AddressHeader
			{email}
			{composeEmailMode}
			{setToEmails}
			{setCcEmails}
			{setBccEmails}
			{setFromEmail}
			{setSubject}
		/>
	</div>
	<div class="mx-1 my-1">
		<Editor email={emailData} />
	</div>
	<div class="m-2 flex justify-start text-primary-gray">
		<Footer {onSend} />
	</div>
</div>
