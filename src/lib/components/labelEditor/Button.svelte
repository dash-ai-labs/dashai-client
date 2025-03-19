<script lang="ts">
	let { children, onclick } = $props();
</script>

<button {onclick}>
	{@render children?.()}
</button>

<style>
	button {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		border-radius: 0.375rem;
		padding: 4px 6px;
		color: var(--color-font-gray);
	}

	button:hover {
		background-color: var(--color-primary-dark-gray);
	}
</style>
