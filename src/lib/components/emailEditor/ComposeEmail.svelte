<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onMount, onDestroy } from 'svelte';

	import { ComposeEmailMode, ToastType, type Email, type EmailData } from '$lib/types';
	import ReplyButton from './ReplyButton.svelte';
	import ForwardButton from './ForwardButton.svelte';
	import AddressHeader from './AddressHeader.svelte';
	import Footer from './Footer.svelte';
	import { user, errorMessage, showErrorModal } from '$lib/store';
	import { sendEmail } from '$lib/api/email';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import DOMPurify from 'dompurify';
	import { showToast } from '$lib/helpers';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Composer from './composer/index.svelte';

	const toastStore = getToastStore();
	let content = '';
	let limit = 100;
	let bold = true;
	let italic = true;
	let strike = false;
	let underline = false;
	let link = false;
	let code = false;
	let placeholder = '';
	let {
		email,
		height = $bindable(),
		composeEmailMode,
		setShowComposeEmail,
		setComposeEmailMode
	}: { email: Email; height: number } = $props();
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

		// if (!editor.getHTML() || editor.getHTML() === '<p></p>') {
		// 	errorMessage.set('Please add a message body');
		// 	showErrorModal.set(true);
		// 	return;
		// }

		const _sendEmail = async () => {
			await sendEmail({ user: $user.id, email: emailData });
			showToast(toastStore, 'Email sent successfully', ToastType.Success);
			_clearEmailData();
			setShowComposeEmail(false);
			// editor.destroy();
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

	// const EmailQuote = Node.create({
	// 	name: 'emailQuote',

	// 	group: 'block',

	// 	content: 'block+',

	// 	defining: true,

	// 	parseHTML() {
	// 		return [
	// 			{
	// 				tag: 'blockquote[data-type="email-quote"]'
	// 			}
	// 		];
	// 	},

	// 	renderHTML({ HTMLAttributes }) {
	// 		return [
	// 			'blockquote',
	// 			{ 'data-type': 'email-quote', class: 'pl-4 border-l-4 border-gray-300' },
	// 			[
	// 				'iframe',
	// 				{
	// 					srcdoc: 0,
	// 					frameborder: '0',
	// 					class: 'w-full h-full',
	// 					sandbox: 'allow-same-origin'
	// 				}
	// 			]
	// 		];
	// 	}
	// });
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
		// if (!editor) return;

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

			// setContent();
		} else {
			// editor.commands.clearContent();
		}
	});
</script>

<div
	class="fixed bottom-[-10px] right-2 z-50 w-[50%] overflow-hidden rounded-2xl rounded-b-none border border-primary-gray bg-primary-black"
>
	<div class="flex flex-row bg-primary-hazy-black px-3 py-1 text-primary-button">
		<div class="self-center px-2 py-2">{emailData.subject}</div>
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
			{setComposeEmailMode}
		/>
	</div>
	<div class="mx-1 my-1 py-4">
		<Composer />
	</div>
	<div class="m-2 flex justify-start text-primary-gray">
		<Footer {onSend} />
	</div>
</div>
