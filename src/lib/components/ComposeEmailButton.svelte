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
</script>

<PrimaryButton
	on:click={() => {
		setShowComposeEmail();
	}}><IconPencil size={20} color="white" />Compose</PrimaryButton
>

<style>
</style>
