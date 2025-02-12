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

	onMount(async () => {
		await nonce.set(data.nonce);
		initializeLayout();
	});

	const modalRegistry: Record<string, ModalComponent> = {
		newEmailLabelComponent: { ref: NewEmailLabelComponent },
		emailAISearchComponent: { ref: EmailAISearchComponent }
	};
</script>

<div class="dashboard">
	<Modal components={modalRegistry} />

	{@render children?.()}
</div>

<style nonce="{data.nonce}">
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}
</style>
