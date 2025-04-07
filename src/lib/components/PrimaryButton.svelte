<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		fullWidth?: boolean;
		disabled?: boolean;
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { fullWidth = false, disabled = false, classes = '', children }: Props = $props();
</script>

<button
	class="primary-button {fullWidth ? 'full-width' : ''} {classes}"
	{disabled}
	on:click={bubble('click')}
>
	{@render children?.()}
</button>

<style>
	.primary-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-left: 16px;
		padding-right: 16px;
		padding-top: 8px;
		padding-bottom: 8px;
		gap: 8px;
		background-color: var(--color-primary-button);
		border-radius: 10px;
		color: var(--color-primary-white);
	}

	.primary-button:hover {
		background-color: var(--color-primary-button-hover);
	}

	.full-width {
		width: 100%;
	}

	.primary-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
