<script lang="ts">
	import type { EmailAccount } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconLoader2 } from '@tabler/icons-svelte';

	let { emailAccount }: { emailAccount: EmailAccount } = $props();
	const modalStore = getModalStore();
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
