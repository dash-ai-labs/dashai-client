<script lang="ts">
	interface Props {
		iconColor?: string;
	}

	let { iconColor = 'fill-primary-gray' }: Props = $props();
</script>

<div
	class="flex w-full cursor-pointer items-center gap-2 px-1 hover:cursor-pointer hover:bg-secondary-active-button-background-hover"
>
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4.5 17L4.5 13L17.67 13L14.09 16.59L15.5 18L21.5 12L15.5 6L14.09 7.41L17.67 11L2.5 11L2.5 17L4.5 17Z"
			class={iconColor}
		/>
	</svg>
	<span class="text-primary-gray">Forward</span>
</div>
