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

<button class="label-chip" style:background-color={label.color} onclick={handleClick}>
	<CloseOutline height={12} width={12} color="var(--color-primary-black)" />
	<p class="label-text">{label.name}</p>
</button>

<style>
	.label-chip {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		border-radius: 14px;
		padding-block: 2px;
		padding-inline: 4px;
		width: 100px;
	}

	.label-text {
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-primary-black);
	}
</style>
