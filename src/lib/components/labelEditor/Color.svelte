<script lang="ts">
	let { color, children, onclick } = $props();
</script>

<button {onclick}>
	<div class="color-box" style:background-color={color}></div>
	{@render children?.()}
</button>

<style>
	button {
		display: flex;
		width: 100%;
		flex-direction: row;
		gap: 10px;
		border-radius: 0.375rem;
		padding: 4px 6px;
	}

	button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.color-box {
		height: 25px;
		width: 25px;
		border-radius: 0.375rem;
	}
</style>
