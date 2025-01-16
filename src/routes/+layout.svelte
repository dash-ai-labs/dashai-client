<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeLayout } from '$lib/layout';
	import { nonce } from '$lib/store';

	interface Props {
		children?: import('svelte').Snippet;
		data: {
			nonce: string;
		};
	}

	let { children, data }: Props = $props();
	// const getNonce = async () => {
	// 	const response = await fetch(window.location.href);
	// 	const nonce_value = response.headers.get('X-Content-Security-Policy-Nonce');
	// 	console.log(data.nonce);
	// };

	onMount(async () => {
		console.log(data.nonce);
		await nonce.set(data.nonce);
		initializeLayout();
	});
</script>

<div class="dashboard">
	{@render children?.()}
</div>

<style nonce="{data.nonce}">
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}
</style>
