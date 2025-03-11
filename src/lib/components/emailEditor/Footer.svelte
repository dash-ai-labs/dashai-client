<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';

	let { onSend }: { onSend: () => void } = $props();
</script>

<div class="flex flex-col p-2">
	<PrimaryButton classes="rounded-full" on:click={onSend}>Send</PrimaryButton>
	<!-- <div class="border-t border-primary-gray px-2 py-1 text-sm text-primary-gray">
			{editor.storage.characterCount.characters({ mode: 'textSize' })}/{limit} characters
		</div> -->
</div>
