<script lang="ts">
	let { color, children, onclick } = $props();
</script>

<button
	class="flex w-full flex-row gap-[10px] rounded-md px-[6px] py-[4px] hover:bg-primary-dark-gray"
	{onclick}
>
	<div class="h-[25px] w-[25px] rounded-md" style:background-color={color}></div>
	{@render children?.()}
</button>
