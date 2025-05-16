<script lang="ts">
	import { WritingStyle, writingStyles } from '$lib/types';

	let {
		selectWritingStyle,
		height = 500
	}: {
		selectWritingStyle: (key: WritingStyle) => void;
		height?: number;
	} = $props();
</script>

<div class="writing-style-popup" style="max-height: {height}px;">
	{#each Object.keys(writingStyles) as key}
		<button
			class="writing-style-dropdown-item"
			onclick={() => selectWritingStyle(key as WritingStyle)}
		>
			<div class="writing-style-dropdown-item-label">
				{writingStyles[key].label}
			</div>
			<div class="writing-style-dropdown-item-description">
				{writingStyles[key].description}
			</div>
		</button>
	{/each}
</div>

<style>
	.writing-style-popup {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: flex-start;
		padding: 10px;
		background-color: var(--color-primary-container);
		border: 1px solid var(--color-primary-dark-gray);
		border-radius: 5px;
		width: 400px;
		overflow-y: auto;
		z-index: 1000;
	}
	.writing-style-dropdown-item {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		padding: 10px;
		text-align: left;
		width: 100%;
		border-bottom: 1px solid var(--color-primary-dark-gray);
	}
	.writing-style-dropdown-item:hover {
		background-color: var(--color-primary-dark-gray);
	}
	.writing-style-dropdown-item-label {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-font-light-gray);
	}
	.writing-style-dropdown-item-description {
		font-size: 14px;
		font-weight: 400;
	}
</style>
