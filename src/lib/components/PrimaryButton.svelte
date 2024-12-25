<script lang="ts">
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    interface Props {
        fullWidth?: boolean;
        disabled?: boolean;
        classes?: string;
        children?: import('svelte').Snippet;
    }

    let {
        fullWidth = false,
        disabled = false,
        classes = '',
        children
    }: Props = $props();
	let buttonClasses = $derived(`
        flex 
        flex-col 
        justify-center 
        items-center 
        px-[24px]
        py-[10px] 
        h-[40px] 
        gap-2
        bg-primary-button 
        rounded-[10px]
        text-secondary-active-button-background
        ${fullWidth ? 'w-full' : ''}
        ${classes}
    `);
</script>

<button class={buttonClasses} {disabled} onclick={bubble('click')}>
	{@render children?.()}
</button>
