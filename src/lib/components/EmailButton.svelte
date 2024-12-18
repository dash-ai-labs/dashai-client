<script lang="ts">
	let { children, onclick, title, ariaLabel } = $props();
</script>

<button class="rounded p-2 hover:bg-primary-dark-gray" aria-label={ariaLabel} {title} {onclick}>
	{@render children?.()}
</button>
