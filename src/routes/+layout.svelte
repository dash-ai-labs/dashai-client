<script lang="ts">
	import '../app.css';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getUserProfile } from '$lib/auth';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {});
	// Handle navigation
	function handleNavigation(path: string) {
		goto(path);
	}
</script>

<div class="dashboard">
	{@render children?.()}
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}
</style>
