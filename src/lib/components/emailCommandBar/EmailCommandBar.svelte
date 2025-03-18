<script lang="ts">
	import { get } from 'svelte/store';
	import { emailServiceState } from '$lib/store';
	import ComposeEmailButton from '../ComposeEmailButton.svelte';

	const emailLabels = $derived(get(emailServiceState).emailLabels);
</script>

<div>
	<ComposeEmailButton />
</div>
