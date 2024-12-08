<script lang="ts">
	export let fullWidth = false;
	export let disabled = false;

	$: buttonClasses = `        
            flex
            h-[40px]
            justify-center
            items-center
            rounded-lg
            bg-secondary-active-button-background
            hover:bg-secondary-active-button-background-hover
            ${fullWidth ? 'w-full' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `;
</script>

<button class={buttonClasses} {disabled} on:click>
	<slot />
</button>
