<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		fullWidth?: boolean;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { fullWidth = false, disabled = false, children }: Props = $props();
</script>

<button
	class="button-base {fullWidth ? 'full-width' : ''} {disabled ? 'disabled' : ''}"
	{disabled}
	on:click={bubble('click')}
>
	{@render children?.()}
</button>

<style>
	.button-base {
		display: flex;
		padding: 10px var(--Space-600, 24px) 10px var(--Space-400, 16px);
		justify-content: center;
		align-items: center;
		gap: var(--Space-200, 8px);
		flex: 1 0 0;
		align-self: stretch;
		cursor: pointer;
	}

	.full-width {
		width: 100%;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
