<script>
	export let width = 20;
	export let height = 21;
	export let color = 'gray';
</script>

<svg {width} {height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M7 5.5H15" class="stroke-{color} stroke-linecap-round stroke-[1.6]" />
	<path d="M7 10.5H12" class="stroke-linecap-round stroke-{color} stroke-[1.6]" />
	<path d="M2 4.5C2 15.5 2 15.5 14 15.5" class="stroke-{color} stroke-linecap-round stroke-[1.6]" />
	<path
		d="M19.689 15.0099C20.1037 15.2202 20.1037 15.7798 19.689 15.9901L14.8722 18.4326C14.4781 18.6325 14 18.3638 14 17.9425L14 13.0575C14 12.6362 14.4781 12.3675 14.8722 12.5674L19.689 15.0099Z"
		class="fill-{color}"
	/>
</svg>
