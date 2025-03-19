<script lang="ts">
	let { children, onclick, title, ariaLabel, additionalClass = '' } = $props();
</script>

<button class="email-button {additionalClass}" aria-label={ariaLabel} {title} {onclick}>
	{@render children?.()}
</button>

<style>
	.email-button {
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	.email-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
