<script lang="ts">
	let { children, onclick } = $props();
</script>

<button
	class="flex w-full flex-row items-center gap-[10px] rounded-md px-[6px] py-[4px] text-font-gray hover:bg-primary-dark-gray"
	{onclick}
>
	{@render children?.()}
</button>
