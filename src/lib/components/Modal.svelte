<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="max-w-md rounded-md bg-primary-black backdrop:bg-primary-black/30 open:animate-zoom"
	bind:this={dialog}
	onclose={() => {
		dispatch('closeModal');
	}}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div
		class="overflow-hidden rounded-lg border border-primary-dark-gray bg-primary-black p-[24px] text-font-light-gray"
	>
		{@render header?.()}
		{@render children?.()}
		<!-- svelte-ignore a11y_autofocus -->
		<!-- <button class="block" autofocus onclick={() => dialog.close()}>close modal</button> -->
	</div>
</dialog>
