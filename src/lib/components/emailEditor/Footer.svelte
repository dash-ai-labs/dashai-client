<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import type { WritingStyle } from '$lib/types';
	import { IconChevronDown, IconPencilStar } from '@tabler/icons-svelte';
	import type { EditorType } from './emailEditorLibs';
	import { writeEmailSuggestion } from '$lib/api/compose';
	import { get } from 'svelte/store';
	import { user, composeEmail } from '$lib/store';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import WritingStylePopup from '../WritingStylePopup.svelte';

	let { onSend, editor = $bindable() }: { onSend: () => void; editor: EditorType | undefined } =
		$props();

	let subject = $state<string>('');
	let body = $state<string>('');
	let writingStylePopupOpen = $state(false);

	// Add a reactive statement to monitor editor changes
	$effect(() => {
		if (editor) {
		}
	});

	composeEmail.subscribe((state) => {
		if (state.email.subject && state.email.subject !== subject) {
			subject = state.email.subject;
		}
		if (state.email.body && state.email.body !== body) {
			body = state.email.body;
		}
	});

	const readStream = async (
		resultReader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>
	) => {
		let buffer = '';
		const decoder = new TextDecoder('utf-8');

		try {
			if (!editor) {
				console.warn('Editor not available for inserting content');
				return;
			}

			// Add a CSS class to the editor container for animation effects
			const editorElement = editor.view.dom.closest('.editor-container');

			while (true) {
				const { done, value } = await resultReader!.read();
				if (done) break;
				const chunk = decoder.decode(value);
				buffer += chunk;

				let boundary = buffer.indexOf('\n'); // Assume newline-separated JSON
				while (boundary !== -1) {
					const jsonString = buffer.slice(0, boundary); // Extract one JSON object
					buffer = buffer.slice(boundary + 1); // Remove processed part
					boundary = buffer.indexOf('\n');

					try {
						const { data } = JSON.parse(jsonString);

						// Store the initial cursor position
						let cursorPos = editor.state.selection.from;

						// Create a typing animation effect by inserting characters gradually
						const characters = data.split('');

						// Insert characters one by one with a typing effect
						for (let i = 0; i < characters.length; i++) {
							// Random slight variation in typing speed for natural effect
							const typingDelay = 15 + Math.random() * 5;
							await new Promise((resolve) => setTimeout(resolve, typingDelay));

							// First ensure cursor is at the right position
							editor.commands.setTextSelection(cursorPos);

							// Insert the next character
							const char = characters[i];

							// Handle whitespace characters properly
							if (char === ' ') {
								editor.commands.insertContent({ type: 'text', text: '  ' });
								cursorPos += 1;
							} else if (char === '\n') {
								editor.commands.setHardBreak();
								cursorPos += 1;
							} else {
								editor.commands.insertContent(char);
								cursorPos += 1;
							}

							editor.commands.setTextSelection(cursorPos);
						}
					} catch (error) {
						console.error('Error parsing JSON string:', jsonString, error);
					}
				}
			}
		} catch (error) {
			console.error('Error reading search stream:', error);
		} finally {
			// Remove the generating class when finished
			const editorElement = editor?.view.dom.closest('.editor-container');
			composeEmail.update((state) => ({
				...state,
				isLoadingTextGeneration: false
			}));
		}
	};

	const createSuggestion = (writingStyle?: WritingStyle) => {
		if (!editor) {
			return;
		}
		const _writeSuggestion = async () => {
			composeEmail.update((state) => ({
				...state,
				isLoadingTextGeneration: true
			}));
			const reader = await writeEmailSuggestion({
				user: get(user)?.id.toString(),
				subject: subject,
				body: body,
				writingStyle: writingStyle ?? undefined
			});
			if (reader) {
				readStream(reader);
			}
		};
		_writeSuggestion();
	};

	const writingStylePopup: PopupSettings = {
		event: 'click',
		target: 'composeEmail-writingStylePopup',
		placement: 'top-start',
		closeQuery: 'button'
	};

	const handleWritingStylePopupClick = () => {
		writingStylePopupOpen = !writingStylePopupOpen;
	};
</script>

<div class="footer-container">
	<PrimaryButton on:click={onSend}>Send</PrimaryButton>
	<!-- <div class="border-t border-primary-gray px-2 py-1 text-sm text-primary-gray">
			{editor.storage.characterCount.characters({ mode: 'textSize' })}/{limit} characters
		</div> -->
	<div class="secondary-button-container">
		<button onclick={() => createSuggestion()} class="pencil-button"
			><IconPencilStar size={20} color="var(--color-primary-light-gray)" /></button
		>
		<button
			onclick={handleWritingStylePopupClick}
			class="secondary-button-option"
			use:popup={writingStylePopup}
			><IconChevronDown size={16} color="var(--color-primary-light-gray)" /></button
		>
		<div data-popup="composeEmail-writingStylePopup">
			<WritingStylePopup
				height={400}
				selectWritingStyle={(writingStyle) => createSuggestion(writingStyle)}
			/>
		</div>
	</div>
</div>

<style>
	.footer-container {
		display: flex;
		flex-direction: row;
		gap: 10px;
		padding-block: 10px;
	}
	.secondary-button-container {
		display: flex;
		border-radius: 10px;
		border: 1px solid var(--color-primary-gray);
		overflow: hidden;
	}
	.pencil-button {
		display: flex;
		background-color: var(--color-primary-dark-container);
		align-items: center;
		justify-content: center;
		padding: 10px;
		width: 50px;
	}
	.pencil-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
	.secondary-button-option {
		display: flex;
		background-color: var(--color-primary-dark-gray);
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 5px;
	}
	.secondary-button-option:hover {
		background-color: var(--color-primary-gray);
	}

	/* Enhanced styles for text generation animation */
	:global(.generating-text) {
		position: relative;
	}

	:global(.generating-text::after) {
		content: '';
		position: absolute;
		bottom: 10px;
		right: 20px;
		width: 8px;
		height: 8px;
		background: var(--color-primary);
		border-radius: 50%;
		animation: cursor-pulse 1s infinite;
		z-index: 10;
		box-shadow: 0 0 5px rgba(35, 131, 226, 0.6);
	}

	@keyframes cursor-pulse {
		0% {
			opacity: 0.4;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
		100% {
			opacity: 0.4;
			transform: scale(0.8);
		}
	}

	/* Improved highlight effect for new text */
	:global(.ProseMirror .highlight) {
		background-color: rgba(35, 131, 226, 0.28);
		transition: background-color 1.5s ease-out;
	}

	/* Add a cursor animation for text insertion */
	:global(.ProseMirror.inserting-text) {
		caret-color: var(--color-primary);
	}

	:global(.ProseMirror.inserting-text .cursor) {
		display: inline-block;
		width: 2px;
		height: 1.2em;
		background-color: var(--color-primary);
		animation: blink 1s step-end infinite;
		margin-left: 1px;
		vertical-align: text-bottom;
	}

	@keyframes blink {
		from,
		to {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* Apple Intelligence Animation Styles */
	:global(.apple-intelligence-active) {
		position: relative;
	}

	:global(.apple-intelligence-active::after) {
		content: '';
		position: absolute;
		bottom: 12px;
		right: 12px;
		width: 6px;
		height: 6px;
		background: rgb(10, 132, 255);
		border-radius: 50%;
		animation: apple-pulse 1.5s infinite cubic-bezier(0.25, 0.1, 0.25, 1);
		z-index: 10;
		box-shadow: 0 0 12px rgba(10, 132, 255, 0.6);
	}

	@keyframes apple-pulse {
		0% {
			opacity: 0.7;
			transform: scale(0.8);
			box-shadow: 0 0 8px rgba(10, 132, 255, 0.4);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
			box-shadow: 0 0 16px rgba(10, 132, 255, 0.8);
		}
		100% {
			opacity: 0.7;
			transform: scale(0.8);
			box-shadow: 0 0 8px rgba(10, 132, 255, 0.4);
		}
	}

	:global(.ai-cursor-indicator) {
		position: absolute;
		width: 3px;
		height: 16px;
		background-color: rgb(10, 132, 255);
		border-radius: 1px;
		animation: apple-cursor-blink 1s infinite;
		box-shadow: 0 0 10px rgba(10, 132, 255, 0.6);
		z-index: 100;
		pointer-events: none;
		transform: translateX(-1px);
		margin-top: 2px;
		transition:
			left 0.08s ease-out,
			top 0.08s ease-out;
	}

	@keyframes apple-cursor-blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	/* Apple-style text highlight */
	:global(.ProseMirror .apple-highlight) {
		background-color: rgba(10, 132, 255, 0.15);
		transition: background-color 1.5s ease-out;
		border-radius: 2px;
	}

	/* Subtle wave animation for the Apple-typing effect */
	:global(.apple-typing) {
		position: relative;
	}

	:global(.apple-typing::after) {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(10, 132, 255, 0.4) 50%,
			transparent 100%
		);
		opacity: 0.4;
		animation: apple-wave 2s infinite ease-in-out;
	}

	@keyframes apple-wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
