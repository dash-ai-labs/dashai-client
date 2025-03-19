<script lang="ts">
	import type { Label } from '$lib/types';
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';
	import EditEmailLabel from './labelEditor/EditEmailLabel.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { refreshEmailLabels } from '$lib/helpers';

	let {
		emailLabel,
		index
	}: {
		emailLabel: Label;
		index?: number;
	} = $props();
</script>

<div class="label-container">
	<div class="label-content" style:background-color={emailLabel.color}>
		<div class="label-name">{emailLabel.name}</div>
	</div>
	<button
		class="menu-button"
		use:popup={{
			event: 'click',
			target: `editEmailLabelComponentPopup-${index}`,
			placement: 'bottom'
		}}
	>
		<DotsHorizontalOutline />
	</button>
	<div data-popup={`editEmailLabelComponentPopup-${index}`}>
		<EditEmailLabel
			closePopupMenu={() => {
				refreshEmailLabels();
			}}
			{emailLabel}
		/>
	</div>
</div>

<style>
	.label-container {
		display: flex;
		width: 300px;
		align-items: center;
		justify-content: space-between;
	}

	.label-content {
		max-width: 270px;
		border-radius: 0.375rem;
		padding: 0.5rem 1.75rem;
	}

	.label-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--text-section-header);
		color: var(--color-primary-black);
	}

	.menu-button {
		border-radius: 9999px;
		padding: 0.25rem;
	}

	.menu-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	[data-popup] {
		display: none;
		z-index: 50;
		position: absolute;
		top: 0;
		left: 1;
	}
</style>
