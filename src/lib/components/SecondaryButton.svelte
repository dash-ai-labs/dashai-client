<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		fullWidth?: boolean;
		disabled?: boolean;
		extraClasses?: string;
		children?: import('svelte').Snippet;
	}

	let { fullWidth = false, disabled = false, extraClasses = '', children }: Props = $props();
</script>

<button
	class="secondary-button {fullWidth ? 'full-width' : ''} {disabled
		? 'disabled'
		: ''} {extraClasses}"
	{disabled}
	on:click={bubble('click')}
>
	{@render children?.()}
</button>

<style>
	.secondary-button {
		display: flex;
		height: 40px;
		justify-content: center;
		align-items: center;
		padding-left: 1rem;
		padding-right: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
		background-color: var(--color-secondary-active-button-background);
	}

	.secondary-button:hover {
		background-color: var(--color-secondary-active-button-background-hover);
	}

	.full-width {
		width: 100%;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
