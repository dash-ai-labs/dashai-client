<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import { IconPencil } from '@tabler/icons-svelte';
	import PrimaryButton from './PrimaryButton.svelte';
	const setShowComposeEmail = () => {
		emailServiceState.update((state) => ({
			...state,
			showComposeEmail: true
		}));
	};

	let { small = false } = $props();
</script>

<PrimaryButton
	on:click={() => {
		setShowComposeEmail();
	}}
	><IconPencil size={16} color="white" />
	{#if !small}
		Compose
	{/if}
</PrimaryButton>

<style>
</style>
