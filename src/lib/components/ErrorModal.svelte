<script lang="ts">
	import { showErrorModal } from '$lib/store';
	import Modal from './Modal.svelte';

	let { showModal = $bindable(), error = '' } = $props();

	const closeModal = () => {
		showErrorModal.set(false);
	};
</script>

<Modal {showModal} on:closeModal={closeModal}>
	<header><div class="error-header">Error</div></header>
	<p class="error-message">{error}</p>
</Modal>

<style>
	.error-header {
		margin-bottom: 1rem;
		font-size: var(--text-h2);
		font-weight: bold;
		color: var(--color-font-light-gray);
	}

	.error-message {
		margin-bottom: 1rem;
	}
</style>
