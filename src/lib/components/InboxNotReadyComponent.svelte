<script lang="ts">
	import { refreshEmailList } from '$lib/actions/email';
	import type { EmailAccount } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconLoader2 } from '@tabler/icons-svelte';
	import { onMount, onDestroy } from 'svelte';

	let { emailAccount }: { emailAccount: EmailAccount } = $props();
	const modalStore = getModalStore();

	// Progress tracking
	let progress = $state(0);
	let intervalId: ReturnType<typeof setInterval>;

	// Function to refresh email list (to be called when progress completes)
	function finishLoading() {
		refreshEmailList();
		modalStore.close();
		// Add your implementation here
	}

	onMount(() => {
		// Update progress every 300ms to complete in 30 seconds
		// 30000ms / 300ms = 100 steps
		intervalId = setInterval(() => {
			progress += 1;
			if (progress >= 100) {
				clearInterval(intervalId);
				finishLoading();
			}
		}, 300);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

{#if $modalStore[0]}
	<div class="modal-container">
		<div class="header-container">
			<header class="modal-header">{$modalStore[0].title ?? '(title missing)'}</header>
			<IconLoader2 class="loader-icon" />
		</div>
		<article class="modal-body">{$modalStore[0].body ?? '(body missing)'}</article>

		<div class="image-container">
			<img src="/images/robot.gif" alt="robot" width="480" height="360" />
		</div>
		<!-- Progress bar -->
		<div class="progress-container">
			<div class="progress-bar" style="width: {progress}%"></div>
			<div class="progress-text">{progress}%</div>
		</div>
	</div>
{/if}

<style>
	.modal-container {
		overflow: hidden;
		border-radius: 0.5rem;
		align-self: center;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-black);
		padding: 24px;
		color: var(--color-font-light-gray);
	}

	.header-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.modal-header {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.modal-body {
		font-size: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	:global(.loader-icon) {
		width: 2.5rem;
		animation: spin 2s linear infinite;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	.image-container {
		display: flex;
		align-items: center;
		justify-items: center;
		align-self: center;
		justify-content: center;
	}

	/* Progress bar styles */
	.progress-container {
		position: relative;
		width: 100%;
		height: 20px;
		background-color: var(--color-primary-dark-gray);
		border-radius: 4px;
		margin: 10px 0;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--color-primary-500, #4caf50);
		transition: width 0.3s ease;
	}

	.progress-text {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		line-height: 20px;
		text-align: center;
		color: white;
		font-size: 0.8rem;
		font-weight: bold;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
