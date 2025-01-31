<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onMount, onDestroy } from 'svelte';
	import { Editor, Node } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Paragraph from '@tiptap/extension-paragraph';
	import HardBreak from '@tiptap/extension-hard-break';
	import Text from '@tiptap/extension-text';
	import Bold from '@tiptap/extension-bold';
	import Code from '@tiptap/extension-code';
	import Italic from '@tiptap/extension-italic';
	import Strike from '@tiptap/extension-strike';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import CharacterCount from '@tiptap/extension-character-count';
	import Blockquote from '@tiptap/extension-blockquote';
	import { ComposeEmailMode, type Email, type EmailData } from '$lib/types';
	import ReplyButton from './ReplyButton.svelte';
	import ForwardButton from './ForwardButton.svelte';
	import AddressHeader from './AddressHeader.svelte';
	import Footer from './Footer.svelte';
	import { user, errorMessage, showErrorModal } from '$lib/store';
	import { sendEmail } from '$lib/api/email';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import DOMPurify from 'dompurify';

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
	let editor: Editor = $state(null);
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

		if (!editor.getHTML() || editor.getHTML() === '<p></p>') {
			errorMessage.set('Please add a message body');
			showErrorModal.set(true);
			return;
		}

		const _sendEmail = async () => {
			await sendEmail({ user: $user.id, email: emailData });
		};
		_sendEmail();
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
	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				EmailQuote,
				Document,
				Paragraph,
				Text,
				//Bold,
				Blockquote,
				CustomBold,
				Code,
				Italic,
				Strike,
				Underline,
				Link.configure({
					validate: (href) => /^https?:\/\//.test(href),
					HTMLAttributes: { rel: null, target: null }
				}),
				BubbleMenu.configure({
					element: bmenu,
					tippyOptions: { duration: 100, theme: 'local', maxWidth: 450, appendTo: document.body }
				}),
				CharacterCount.configure({
					limit
				}),
				HardBreak.extend({
					addKeyboardShortcuts() {
						return {
							Enter: () => this.editor.commands.setHardBreak()
						};
					}
				}).configure({ keepMarks: false }),
				Placeholder.configure({ placeholder })
			],
			content,
			editorProps: {
				attributes: {
					class: 'prose p-3 outline-none text-font-light-gray text-base min-h-[200px]'
				}
			},
			onCreate({ editor }) {
				// The editor is ready.
				const html = editor.getHTML();
				emailData.body = html;
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				// send the content to an API here
				emailData.body = html;
			}
		});
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
					console.log('Editor content:', editor.getHTML());
				} catch (error) {
					console.error('Error setting content:', error);
				}
			};
			// setContent();
		} else {
			// editor.commands.clearContent();
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={bmenu}>
	{#if editor}
		{#if bold}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('bold')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(() => editor.chain().focus().toggleBold().run())}
			>
				Bold
			</button>
		{/if}

		{#if italic}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('italic')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(() => editor.chain().focus().toggleItalic().run())}
			>
				Italic
			</button>
		{/if}

		{#if strike}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('strike')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(() => editor.chain().focus().toggleStrike().run())}
			>
				Tachado
			</button>
		{/if}

		{#if underline}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('underline')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(() => editor.chain().focus().toggleUnderline().run())}
			>
				Subrayado
			</button>
		{/if}

		{#if code}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('code')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(() => editor.chain().focus().toggleCode().run())}
			>
				Código
			</button>
		{/if}

		{#if link}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('link')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={preventDefault(setLink)}
			>
				Link
			</button>
		{/if}
	{/if}
</div>
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
	<div class="mx-1 my-1"><div bind:this={element}></div></div>
	<div class="m-2 flex justify-start text-primary-gray">
		<Footer {onSend} />
	</div>
</div>
