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

<button
	class="group flex items-center justify-center gap-2 rounded-lg px-4 py-1"
	style:background-color={label.color}
	style:width="100px"
	onclick={handleClick}
>
	<CloseOutline class="hidden h-3 w-3 text-primary-black group-hover:block" />
	<p class="text-center text-sm text-primary-black">{label.name}</p>
</button>
