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

<div class="flex w-[300px] items-center justify-between">
	<div class="max-w-[270px] rounded-md px-7 py-2" style:background-color={emailLabel.color}>
		<div class="truncate text-section-header text-primary-black">{emailLabel.name}</div>
	</div>
	<button
		class="rounded-full p-1 hover:bg-primary-dark-gray"
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
	[data-popup] {
		/* Display */
		display: none;
		/* Position */
		z-index: 50;
		position: absolute;
		top: 0;
		left: 1;
	}
</style>
