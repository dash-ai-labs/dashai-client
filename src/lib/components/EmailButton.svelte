<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	let {
		children,
		title,
		ariaLabel,
		onclick = null,
		usePopup = null,
		additionalClass = ''
	} = $props();
</script>

{#if usePopup}
	<button
		class="email-button {additionalClass}"
		aria-label={ariaLabel}
		{title}
		{onclick}
		use:popup={usePopup}
	>
		{@render children?.()}
	</button>
{:else}
	<button class="email-button {additionalClass}" aria-label={ariaLabel} {title} {onclick}>
		{@render children?.()}
	</button>
{/if}

<style>
	.email-button {
		border-radius: 0.5rem;
		padding: 0.4rem 0.55rem;
	}

	.email-button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
