<script lang="ts">
	import { type Label } from '$lib/types';
	import { CloseOutline } from 'flowbite-svelte-icons';

	interface Props {
		label: Label;
		onLabelClick: (params: any) => void;
	}
	let { label, onLabelClick }: Props = $props();

	const handleClick = () => {
		onLabelClick(label);
	};
</script>

<button class="label-chip" style:background-color={label.color} on:click={handleClick}>
	<CloseOutline class="close-icon" />
	<p class="label-text">{label.name}</p>
</button>

<style>
	.label-chip {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		padding: 0.25rem 1rem;
		width: 100px;
	}

	.close-icon {
		height: 0.75rem;
		width: 0.75rem;
		color: var(--color-primary-black);
		display: none;
	}

	.label-chip:hover .close-icon {
		display: block;
	}

	.label-text {
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-primary-black);
	}
</style>
