<script lang="ts">
	export let fullWidth = false;
	export let disabled = false;

	$: buttonClasses = `
        display: flex;
        padding: 10px var(--Space-600, 24px) 10px var(--Space-400, 16px);
        justify-content: center;
        align-items: center;
        gap: var(--Space-200, 8px);
        flex: 1 0 0;
        align-self: stretch;
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;
</script>

<button class={buttonClasses} {disabled} on:click>
	<slot />
</button>
