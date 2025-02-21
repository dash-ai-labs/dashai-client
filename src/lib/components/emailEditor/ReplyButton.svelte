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
			d="M19.5 17L19.5 13L6.33 13L9.91 16.59L8.5 18L2.5 12L8.5 6L9.91 7.41L6.33 11L21.5 11L21.5 17L19.5 17Z"
			class={iconColor}
		/>
	</svg>
	<span class="text-primary-gray">Reply</span>
</div>
