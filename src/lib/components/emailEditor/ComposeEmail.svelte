<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
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
	import type { Email, EmailData } from '$lib/types';
	import ReplyButton from './ReplyButton.svelte';
	import ForwardButton from './ForwardButton.svelte';
	import AddressHeader from './AddressHeader.svelte';
	import Footer from './Footer.svelte';
	import { emailAccount, user, errorMessage, showErrorModal } from '$lib/store';
	import { sendEmail } from '$lib/email';
	let content = '';
	let limit = 100;
	let bold = true;
	let italic = true;
	let strike = false;
	let underline = false;
	let link = false;
	let code = false;
	let placeholder = '';
	let { email, height = $bindable() }: { email: Email; height: number } = $props();
	let element: HTMLElement;
	let bmenu: HTMLElement;
	let editor: Editor;
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

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Document,
				Paragraph,
				Text,
				//Bold,
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
					class: 'p-3 outline-none text-base min-h-[200px]'
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
<div class="rounded-2xl border border-primary-gray bg-primary-container">
	<div class="mx-2 flex justify-start border-b border-primary-gray text-font-light-gray">
		<AddressHeader {email} {setToEmails} {setCcEmails} {setBccEmails} {setFromEmail} {setSubject} />
	</div>
	<div class="mx-1 my-1"><div bind:this={element}></div></div>
	<div class="m-2 flex justify-start text-primary-gray">
		<Footer {onSend} />
	</div>
</div>
