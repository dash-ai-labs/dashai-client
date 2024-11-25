<script lang="ts">
	import { onMount } from 'svelte';
	import { handleCallback } from '$lib/auth';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const state = urlParams.get('state');
		if (code && state) {
			handleCallback(code, state);
		}
	});
</script>

<div>Processing login...</div>
