<script lang="ts">
	export let fullWidth = false;
	export let disabled = false;
	export let classes = '';
	$: buttonClasses = `
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
    `;
</script>

<button class={buttonClasses} {disabled} on:click>
	<slot />
</button>
