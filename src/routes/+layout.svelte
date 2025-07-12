<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeLayout } from '$lib/layout';
	import { nonce, theme, type Theme } from '$lib/store';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup, type ModalComponent, initializeStores, Modal } from '@skeletonlabs/skeleton';
	import NewEmailLabelComponent from '$lib/components/NewEmailLabelComponent.svelte';
	import EmailAISearchComponent from '$lib/components/emailSearch/EmailAISearchComponent.svelte';
	import InboxNotReadyComponent from '$lib/components/InboxNotReadyComponent.svelte';
	import ConfirmActionModal from '$lib/components/ConfirmActionModal.svelte';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function isMobileDevice(): boolean {
		if (typeof navigator === 'undefined') return false; // Prevent SSR issues
		return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}

	interface Props {
		children?: import('svelte').Snippet;
		data: {
			nonce: string;
		};
	}

	let { children, data }: Props = $props();

	let isMobile = $state(false);
	onMount(() => {
		isMobile = isMobileDevice();
	});
	onMount(async () => {
		nonce.set(data.nonce);
		initializeLayout();
	});

	// Initialize theme separately
	onMount(() => {
		const unsubscribe = theme.subscribe((currentTheme: Theme) => {
			if (typeof document !== 'undefined') {
				document.documentElement.className = currentTheme === 'dark' ? 'dark-theme' : '';
			}
		});

		return unsubscribe;
	});

	const modalRegistry: Record<string, ModalComponent> = {
		newEmailLabelComponent: { ref: NewEmailLabelComponent },
		emailAISearchComponent: { ref: EmailAISearchComponent },
		inboxNotReadyComponent: { ref: InboxNotReadyComponent },
		confirmActionModal: { ref: ConfirmActionModal }
	};
</script>

{#if isMobile}
	<div class="mobile-message">
		<h2>Desktop Only</h2>
		<p>This app is only available on desktop devices for now.</p>
	</div>
{:else}
	<div class="page">
		<Modal components={modalRegistry} />

		{@render children?.()}
	</div>
{/if}

<style nonce="{data.nonce}">
	.page {
		height: 100vh;
		background-color: var(--color-primary-black);
		color: var(--color-font-black);
		width: 100%;
	}

	.mobile-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: var(--color-primary-black);
		color: var(--color-font-black);
		padding: 1rem;
		text-align: center;
	}

	.mobile-message h2 {
		margin-bottom: 1rem;
	}
</style>
