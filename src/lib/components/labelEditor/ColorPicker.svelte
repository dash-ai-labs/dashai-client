<script>
	import { LabelColor } from '$lib/types';

	import Color from './Color.svelte';

	let { selectColor } = $props();
</script>

<div class="flex w-full flex-col gap-[10px]">
	<Color onclick={() => selectColor(LabelColor.PURPLE)} color={LabelColor.PURPLE}>Purple</Color>
	<Color onclick={() => selectColor(LabelColor.PINK)} color={LabelColor.PINK}>Pink</Color>
	<Color onclick={() => selectColor(LabelColor.ORANGE)} color={LabelColor.ORANGE}>Orange</Color>
	<Color onclick={() => selectColor(LabelColor.GREEN)} color={LabelColor.GREEN}>Green</Color>
	<Color onclick={() => selectColor(LabelColor.LIGHT_BLUE)} color={LabelColor.LIGHT_BLUE}
		>Light Blue</Color
	>
	<Color onclick={() => selectColor(LabelColor.BLUE)} color={LabelColor.BLUE}>Blue</Color>
</div>
