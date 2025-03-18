<script lang="ts">
	import { emailServiceState } from '$lib/store';
	import SecondaryButton from './SecondaryButton.svelte';
	const setShowComposeEmail = () => {
		emailServiceState.update((state) => ({
			...state,
			showComposeEmail: true
		}));
	};
</script>

<SecondaryButton
	extraClasses="bg-primary-blue"
	on:click={() => {
		setShowComposeEmail();
	}}>Compose</SecondaryButton
>
