<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';

	let { onSend }: { onSend: () => void } = $props();
</script>

<div class="footer-container">
	<PrimaryButton on:click={onSend}>Send</PrimaryButton>
	<!-- <div class="border-t border-primary-gray px-2 py-1 text-sm text-primary-gray">
			{editor.storage.characterCount.characters({ mode: 'textSize' })}/{limit} characters
		</div> -->
</div>

<style>
	.footer-container {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
	}
</style>
