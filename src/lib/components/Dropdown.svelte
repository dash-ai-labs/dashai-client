<script lang="ts">
	import { onClickOutside } from '$lib/utils/onClickOutside';
	export let isOpen = false;
	export let selectedOption: number = 0;
	export let options: any[] = [];
	export let addAccount: { label: string; icon: any; fn: () => void } = null;
	export let onSelectOption: (option: any) => void = () => {};

	function toggleDropdown() {
		isOpen = !isOpen;
	}
	function selectOption(option: number) {
		selectedOption = option;
		onSelectOption(option);
		isOpen = false;
	}
</script>

<div
	class="relative mx-[2px] flex w-full justify-end"
	use:onClickOutside
	on:outsideclick={() => (isOpen = false)}
>
	<button on:click={toggleDropdown}>{options[selectedOption].label || 'Select an option'}</button>

	{#if isOpen}
		<div
			class="bg-primary-container absolute top-full z-[1000] flex min-w-[160px] flex-col overflow-hidden rounded-md"
		>
			{#each options as option, index}
				{#if index === selectedOption}
					{#if !option.component}
						<div
							class=" bg-secondary-active-button-background text-primary-active-button-highlight hover:bg-secondary-active-button-background-hover w-full py-[6px] text-center hover:cursor-pointer"
							on:click={() => {
								selectOption(index);
							}}
						>
							{option.label}
						</div>
					{:else}
						<svelte:component
							this={option.component}
							label={option.label}
							icon={option.icon}
							on:click={() => {
								selectOption(index);
							}}
						/>
					{/if}
				{:else if !option.component}
					<div
						class="hover:bg-secondary-active-button-background w-full py-[6px] text-center hover:cursor-pointer"
						on:click={() => {
							selectOption(index);
						}}
					>
						{option.label}
					</div>
				{:else}
					<svelte:component
						this={option.component}
						label={option.label}
						icon={option.icon}
						on:click={() => {
							selectOption(index);
						}}
					/>
				{/if}
			{/each}
			{#if addAccount}
				<button
					on:click={addAccount.fn}
					class={'px-[20px]bg-secondary-active-button-background hover:bg-secondary-active-button-background-hover flex h-[42px] w-full flex-row items-center justify-center hover:cursor-pointer'}
				>
					{#if addAccount.icon}
						<svelte:component
							this={addAccount.icon}
							fill={'fill-secondary-inactive-button-highlight'}
						/>
					{/if}
					<div class={'text-secondary-inactive-button-highlight mx-[16px] text-center'}>
						{addAccount.label}
					</div>
				</button>
			{/if}
		</div>
	{/if}
</div>
