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
		border-radius: 8px;
		padding: 12px 16px;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
	}

	.email-button:hover {
		background-color: var(--color-primary-dark-gray);
		border-color: rgba(255, 255, 255, 0.1);
		transform: scale(1.05);
	}
</style>
