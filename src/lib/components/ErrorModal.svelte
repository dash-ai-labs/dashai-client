<script lang="ts">
	import { showErrorModal } from '$lib/store';
	import Modal from './Modal.svelte';

	let { showModal = $bindable(), error = '' } = $props();

	const closeModal = () => {
		showErrorModal.set(false);
	};
</script>

<Modal {showModal} on:closeModal={closeModal}>
	<header><div class="mb-4 text-h2 text-xl font-bold text-font-light-gray">Error</div></header>
	<p class="mb-4">{error}</p>
</Modal>
