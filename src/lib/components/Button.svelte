<script lang="ts">
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    interface Props {
        fullWidth?: boolean;
        disabled?: boolean;
        children?: import('svelte').Snippet;
    }

    let { fullWidth = false, disabled = false, children }: Props = $props();

	let buttonClasses = $derived(`
        display: flex;
        padding: 10px var(--Space-600, 24px) 10px var(--Space-400, 16px);
        justify-content: center;
        align-items: center;
        gap: var(--Space-200, 8px);
        flex: 1 0 0;
        align-self: stretch;
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `);
</script>

<button class={buttonClasses} {disabled} onclick={bubble('click')}>
	{@render children?.()}
</button>
