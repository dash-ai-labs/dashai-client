<script lang="ts">
	import { onMount } from 'svelte';
	import { processCallback } from './callback';

	onMount(processCallback);
</script>

<div class="container">
	<div class="loader"></div>
	<h2>Processing your login</h2>
	<p>Please wait while we complete the authentication...</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		color: var(--color-font-black);
		text-align: center;
		padding: 0 1rem;
		background-color: var(--color-primary-black);
	}

	h2 {
		margin: 1.5rem 0 0.5rem;
		font-weight: 600;
		color: var(--color-primary-light-gray);
	}

	p {
		margin: 0;
		color: var(--color-primary-gray);
		font-size: 0.95rem;
	}

	.loader {
		width: 48px;
		height: 48px;
		border: 5px solid var(--color-primary-light-gray);
		border-top: 5px solid var(--color-primary-blue);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
