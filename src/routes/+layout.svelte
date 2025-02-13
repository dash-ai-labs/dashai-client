<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeLayout } from '$lib/layout';
	import { nonce } from '$lib/store';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup, type ModalComponent, initializeStores, Modal } from '@skeletonlabs/skeleton';
	import NewEmailLabelComponent from '$lib/components/NewEmailLabelComponent.svelte';
	import EmailAISearchComponent from '$lib/components/emailSearch/EmailAISearchComponent.svelte';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	interface Props {
		children?: import('svelte').Snippet;
		data: {
			nonce: string;
		};
	}

	let { children, data }: Props = $props();

	let isMobile = $state(false);

	onMount(async () => {
		const checkMobile = () => {
			const width = window.visualViewport?.width || window.innerWidth;
			isMobile = width <= 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		await nonce.set(data.nonce);
		initializeLayout();
	});

	const modalRegistry: Record<string, ModalComponent> = {
		newEmailLabelComponent: { ref: NewEmailLabelComponent },
		emailAISearchComponent: { ref: EmailAISearchComponent }
	};
</script>

{#if isMobile}
	<div class="mobile-message">
		<h2>Desktop Only</h2>
		<p>This app is only available on desktop devices for now.</p>
	</div>
{:else}
	<div class="dashboard">
		<Modal components={modalRegistry} />

		{@render children?.()}
	</div>
{/if}

<style nonce="{data.nonce}">
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}

	.mobile-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
		padding: 1rem;
		text-align: center;
	}

	.mobile-message h2 {
		margin-bottom: 1rem;
	}
</style>
