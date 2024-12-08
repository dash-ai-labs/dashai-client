<script lang="ts">
	import X from '$lib/assets/X.svelte';
	import { createLabel, LabelType } from '$lib/label';
	import Modal from './Modal.svelte';
	import SecondaryButton from './SecondaryButton.svelte';
	import { user } from '$lib/store';
	import { get } from 'svelte/store';

	export let showModal = false;
	let remainingKeywords = 5;
	let nameInput = '';
	let keyWordInput = '';
	let keywords: string[] = [];
	let keywordError = false;
	let keywordErrorMessage = '';
	let nameError = false;
	let nameErrorMessage = '';
	export function toggleModal() {
		showModal = !showModal;
	}

	const handleEnterKey = (e) => {
		if (remainingKeywords > 0) {
			if (e.key === 'Enter') {
				keywords = [...keywords, keyWordInput];
				keyWordInput = '';
				remainingKeywords--;
			}
		} else {
			keywordError = true;
			keywordErrorMessage = 'You have reached the maximum number of keywords';
		}
	};

	const removeKeyword = (keyword: string) => {
		keywords = keywords.filter((k) => k !== keyword);
		remainingKeywords++;
	};

	const submit = async () => {
		if (nameInput.length === 0) {
			nameError = true;
			nameErrorMessage = 'Please enter a name';
		}
		console.log(keywords.length);
		if (keywords.length === 0) {
			keywordError = true;
			keywordErrorMessage = 'Please enter a keyword';
		}
		if (nameInput.length > 0 && keywords.length > 0) {
			const label = {
				name: nameInput,
				keywords: keywords,
				label_type: LabelType.Email
			};
			const response = await createLabel({ user: get(user)?.id.toString(), label });
			if (response) {
				toggleModal();
				nameInput = '';
				keywords = [];
				remainingKeywords = 5;
				keyWordInput = '';
			}
		}
	};

	$: if (!showModal) {
		showModal = false;
	}

	$: if (nameInput.length > 0) {
		nameError = false;
	}
	$: if (keywords.length > 0) {
		keywordError = false;
	}
</script>

<Modal bind:showModal on:closeModal={toggleModal}>
	{#snippet header()}
		<div class="text-h4">Create Email Label</div>
		<div class="text-subheader">Create a new label by describing its purpose</div>
	{/snippet}
	{#snippet children()}
		<div class="my-[24px] flex w-[300px] flex-col gap-[24px]">
			<div>
				<div class="pb-[8px]">Name</div>
				<input
					bind:value={nameInput}
					type="text"
					class="w-full rounded-lg border-0 bg-primary-container focus:outline-none focus:ring-0"
					placeholder="Shopping"
				/>
				{#if nameError}
					<div class="text-subheader text-primary-red">
						{nameErrorMessage}
					</div>
				{/if}
			</div>
			<div>
				<div class="pb-[8px]">Keywords ({remainingKeywords} left)</div>
				{#if keywords.length > 0}
					<div class="mb-[8px] flex flex-wrap gap-[8px]">
						{#each keywords as keyword}
							<div
								class="hover:bg-secondary-green-100 flex w-fit flex-row items-center rounded-lg bg-secondary-green px-[8px] py-[2px] text-primary-container"
							>
								{keyword}
								<button
									class="ml-[2px] items-center justify-center"
									on:click={() => removeKeyword(keyword)}
									><X stroke="stroke-primary-container" size={17} /></button
								>
							</div>
						{/each}
					</div>
				{/if}
				<input
					bind:value={keyWordInput}
					type="text"
					class="w-full rounded-lg border-0 bg-primary-container focus:outline-none focus:ring-0"
					placeholder="groceries, clothing"
					on:keydown={handleEnterKey}
				/>
				{#if keywordError}
					<div class="text-subheader text-primary-red">
						{keywordErrorMessage}
					</div>
				{/if}
			</div>
		</div>
		<SecondaryButton on:click={submit} fullWidth={true}>Create label</SecondaryButton>
	{/snippet}
</Modal>
