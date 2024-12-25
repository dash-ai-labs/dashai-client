<script lang="ts">
	interface Props {
		options?: string[]; // Array of option labels
		activeIndex?: number; // Index of the currently active option
		onChange?: (index: number) => void; // Callback function to notify parent of selection
	}

	let { options = [], activeIndex = $bindable(0), onChange = () => {} }: Props = $props();

	const handleClick = (index: number) => {
		activeIndex = index;
		if (onChange) onChange(index); // Invoke callback with the selected index
	};
</script>

<div
	class="relative inline-flex w-[160px] items-center overflow-hidden rounded-md bg-primary-dark-gray px-1"
>
	<!-- Background indicator for the active button -->
	<div
		class="absolute h-[calc(100%-8px)] rounded-md bg-primary-container transition-all duration-300 ease-in-out"
		style:transform={`translateX(calc(${activeIndex * (190 / options.length)}% ))`}
		style:width={`calc((100% / ${options.length}) - 2px)`}
	></div>

	{#each options as option, index}
		<button
			class="relative flex-1 px-4 py-2 text-center text-subheader text-font-light-gray transition-colors duration-300 ease-in-out"
			onclick={() => handleClick(index)}
			class:text-white={activeIndex === index}
		>
			{option}
		</button>
	{/each}
</div>
