<script lang="ts">
	import type { Label } from '$lib/types';
	import { IconCircleFilled } from '@tabler/icons-svelte';
	import { fade, slide } from 'svelte/transition';

	let {
		emailLabel,
		showLabel = true
	}: {
		emailLabel: Label;
		showLabel: boolean;
	} = $props();
</script>

{#key showLabel}
	{#if showLabel}
		<div
			class="full-label"
			style:background-color={emailLabel.color}
			in:slide={{ duration: 500, delay: 500 }}
			out:fade={{ duration: 500 }}
		>
			<div class="label-name">{emailLabel.name}</div>
		</div>
	{:else}
		<div in:slide={{ duration: 500, delay: 500 }} out:fade={{ duration: 500 }}>
			<IconCircleFilled color={emailLabel.color} size={12} />
		</div>
	{/if}
{/key}

<style>
	.full-label {
		display: flex;
		border-radius: 1rem;
		color: var(--color-font-black);
		height: 20px;
		padding-inline: 0.25rem;
		font-size: 12px;
		align-content: center;
		align-items: baseline;
		align-self: center;
	}
	.label-container {
		display: flex;
		width: 300px;
		align-items: center;
		justify-content: space-between;
	}

	.label-content {
		max-width: 270px;
		border-radius: 0.375rem;
		padding: 0.5rem 1.75rem;
	}

	.label-name {
		overflow: hidden;
		padding-inline: 0.25rem;
		align-self: center;
		white-space: nowrap;
		color: var(--color-primary-black);
	}

	.menu-button {
		border-radius: 9999px;
		padding: 0.25rem;
	}

	.menu-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	[data-popup] {
		display: none;
		z-index: 50;
		position: absolute;
		top: 0;
		left: 1;
	}
</style>
