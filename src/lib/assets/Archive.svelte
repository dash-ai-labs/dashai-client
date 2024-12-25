<script lang="ts">
	interface Props {
		fill?: string;
		width?: number;
		height?: number;
	}

	let { fill = 'fill-secondary-inactive-button-highlight', width = 16, height = 16 }: Props = $props();
</script>

<svg {width} {height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M15.1167 2.35833L13.9583 0.958333C13.7333 0.675 13.3917 0.5 13 0.5H3C2.60833 0.5 2.26667 0.675 2.03333 0.958333L0.883333 2.35833C0.641667 2.64167 0.5 3.01667 0.5 3.41667V13.8333C0.5 14.75 1.25 15.5 2.16667 15.5H13.8333C14.75 15.5 15.5 14.75 15.5 13.8333V3.41667C15.5 3.01667 15.3583 2.64167 15.1167 2.35833ZM3.2 2.16667H12.8L13.475 2.975H2.53333L3.2 2.16667ZM2.16667 13.8333V4.66667H13.8333V13.8333H2.16667ZM9.20833 6.33333H6.79167V8.83333H4.66667L8 12.1667L11.3333 8.83333H9.20833V6.33333Z"
		class={fill}
	/>
</svg>
