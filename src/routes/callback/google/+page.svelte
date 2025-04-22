<script lang="ts">
	import { onMount } from 'svelte';
	import { processCallback } from './callback';

	onMount(processCallback);
</script>

<div>Processing login...</div>
