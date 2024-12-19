<script lang="ts">
	let { children, onclick, title, ariaLabel, additionalClass = '' } = $props();
</script>

<button
	class="rounded p-2 hover:bg-primary-dark-gray {additionalClass}"
	aria-label={ariaLabel}
	{title}
	{onclick}
>
	{@render children?.()}
</button>
