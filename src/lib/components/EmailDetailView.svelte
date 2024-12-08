<script lang="ts">
	import Inbox from '$lib/assets/Inbox.svelte';
	import type { Email } from '$lib/email';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import TextStyle from '@tiptap/extension-text-style';
	import Color from '@tiptap/extension-color';
	import Underline from '@tiptap/extension-underline';
	import Table from '@tiptap/extension-table';
	import TableRow from '@tiptap/extension-table-row';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import Blockquote from '@tiptap/extension-blockquote';
	import Highlight from '@tiptap/extension-highlight';
	import HorizontalRule from '@tiptap/extension-horizontal-rule';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';

	export let email: Email | undefined = undefined;
	let element;
	let editor: Editor | null = null;

	onMount(() => {
		if (element) element.innerHTML = email?.raw_content;
	});
	let backgroundColor = 'bg-primary-container'; // Default background color

	// Cleanup the old editor instance if it exists
	// if (editor) {
	// 	editor.destroy();
	// 	editor = null;
	// }

	// Create a new editor instance when email changes
	$: if (element) {
		element.innerHTML = DOMPurify.sanitize(email?.raw_content);
		adjustBackground();
	}
	function adjustBackground() {
		if (element) {
			const computedStyles = getComputedStyle(element);
			const bgColor = computedStyles.backgroundColor;
			console.log(bgColor);
			if (bgColor && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
				backgroundColor = bgColor; // Use the defined background color
				element.classList.add('text-font-dark-gray'); // Adjust text color for high contrast

				return;
			}
			const rgb = computedStyles.color.match(/\d+/g).slice(0, 3).map(Number); // Extract RGB values

			// Calculate luminance
			const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
			backgroundColor = luminance > 0.5 ? 'bg-font-light-gray' : 'bg-primary-container'; // Adjust for contrast
			element.classList.add(luminance > 0.5 ? 'text-primary-black' : 'text-font-light-gray'); // Adjust text color for high contrast
		}
	}
	// editor = new Editor({
	// 	element: element,
	// 	extensions: [
	// 		StarterKit,
	// 		Image,
	// 		Link,
	// 		Table,
	// 		TableRow,
	// 		TableCell,
	// 		TableHeader,
	// 		TextStyle,
	// 		Color,
	// 		Underline,
	// 		Highlight,
	// 		HorizontalRule
	// 	],
	// 	content: email.raw_content,
	// 	onTransaction: () => {
	// 		// force re-render so `editor.isActive` works as expected
	// 		editor = editor;
	// 	}
	// });

	// Ensure editor instance is destroyed when the component is unmounted
	// onDestroy(() => {
	// 	if (editor) {
	// 		editor.destroy();
	// 		editor = null;
	// 	}
	// });

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
</script>

<div class=" w-full min-w-[400px] max-w-[1000px] rounded-lg bg-primary-container">
	{#if email}
		<!-- Header -->
		<header class="justify-betweenp-4 flex h-[60px] items-center border-b border-primary-gray">
			<div class="flex gap-4">
				<button class="rounded p-2 hover:bg-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect width="18" height="14" x="3" y="5" rx="2" />
						<path d="M21 5v14" />
					</svg>
				</button>
				<button class="rounded p-2 hover:bg-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect width="14" height="14" x="5" y="5" rx="2" />
					</svg>
				</button>
				<button class="rounded p-2 hover:bg-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect width="10" height="16" x="7" y="4" rx="2" />
					</svg>
				</button>
			</div>
			<div class="flex gap-4">
				<button class="rounded p-2 hover:bg-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</button>
				<button class="rounded p-2 hover:bg-gray-800">⋮</button>
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
						<span class="text-sm text-gray-400">{formatDate(email.date)}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="no-scrollbar max-h-[760px] overflow-auto p-6">
			<div class="mt-4 space-y-4">
				<div bind:this={element} class="{backgroundColor} max-w-[900px] text-wrap p-1" />
			</div>
		</div>
		<!-- Reply Box -->
		<!-- <div class="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 p-4">
			<input
				type="text"
				placeholder="Reply Joe Doe..."
				class="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-gray-600 focus:outline-none"
			/>
		</div> -->
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
</style>
