<script lang="ts">
	interface Props {
		stroke?: any;
		size?: number;
	}

	let { stroke = null, size = 17 }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 {size} {size}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M12.5 4.5L4.5 12.5M4.5 4.5L12.5 12.5"
		class={stroke}
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
