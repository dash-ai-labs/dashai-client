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

	let buttonClasses = $derived(
		`flex h-[40px] justify-center items-center px-4 rounded-lg  hover:bg-secondary-active-button-background-hover ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${extraClasses}`
	);
</script>

<button class={buttonClasses} {disabled} onclick={bubble('click')}>
	{@render children?.()}
</button>
