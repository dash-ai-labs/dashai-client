<script lang="ts">
	interface Props {
		width?: number;
		height?: number;
	}

	let { width = 20, height = 21 }: Props = $props();
</script>

<img {width} {height} src="/images/summary.png" alt="Summary" />
