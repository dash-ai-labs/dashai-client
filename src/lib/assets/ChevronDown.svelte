<script lang="ts">
	interface Props {
		width?: number;
		height?: number;
		fill?: string;
	}

	let { width = 20, height = 12, fill = '#ECF2F8' }: Props = $props();
</script>

<svg {width} {height} viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M19.6532 1.99957L9.99945 11.6533L0.345703 1.99957L1.76495 0.580319L9.99945 8.81507L18.234 0.58032L19.6532 1.99957Z"
		{fill}
	/>
</svg>
