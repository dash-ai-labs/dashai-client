<script lang="ts">
	interface Props {
		fill?: string;
		width?: number;
		height?: number;
	}

	let { fill = 'fill-secondary-inactive-button-highlight', width = 13, height = 16 }: Props = $props();
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M10 5.5V13.8333H3V5.5H10ZM8.6875 0.5H4.3125L3.4375 1.33333H0.375V3H12.625V1.33333H9.5625L8.6875 0.5ZM11.75 3.83333H1.25V13.8333C1.25 14.75 2.0375 15.5 3 15.5H10C10.9625 15.5 11.75 14.75 11.75 13.8333V3.83333Z"
		class={fill}
	/>
</svg>
