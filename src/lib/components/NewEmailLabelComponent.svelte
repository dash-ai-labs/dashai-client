<script lang="ts">
	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { LabelColor, LabelType, type Label } from '$lib/types';
	import { createLabel } from '$lib/api/label';
	import { get } from 'svelte/store';
	import { emailLabels, user } from '$lib/store';
	import { refreshEmailLabels } from '$lib/helpers';
	import { type PopupSettings } from '@skeletonlabs/skeleton';
	import EmailLabel from './EmailLabel.svelte';

	// Props
	/** Exposes parent props to this component. */
	let parent = $props();

	const modalStore = getModalStore();
	let nameInput = $state('');
	let nameError = $state(false);
	let nameErrorMessage = $state('');
	let emailLabelList = $state<Label[]>(get(emailLabels));

	// Form Data

	const handleEnterKey = (e) => {
		if (e.key === 'Enter') {
			submit();
		}
	};
	const submit = async () => {
		if (nameInput.length === 0) {
			nameError = true;
			nameErrorMessage = 'Please enter a name';
		}

		if (nameInput.length > 0) {
			const colors = Object.values(LabelColor);
			const label = {
				name: nameInput,
				label_type: LabelType.Email,
				color: colors[Math.floor(Math.random() * colors.length)]
			};
			const response = await createLabel({ user: get(user)?.id.toString(), label });
			if (response) {
				nameInput = '';
				await refreshEmailLabels();
			}
		}
	};
	const editEmailLabelComponentPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'editEmailLabelComponentPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
	emailLabels.subscribe((value) => {
		emailLabelList = value;
	});

	// Base Classes
	const cBase =
		'overflow-hidden rounded-lg border border-primary-dark-gray bg-primary-black p-[24px] text-font-light-gray';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'max-w-md rounded-md bg-primary-black ';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->

		<form class="modal-form {cForm}">
			<div class="my-[10px] flex w-[300px] flex-col gap-[24px]">
				<label class="label">
					<input
						bind:value={nameInput}
						type="text"
						class="w-full rounded-md border-0 bg-primary-container focus:outline-none focus:ring-0"
						placeholder="Enter label name"
						on:keydown={handleEnterKey}
					/>
					{#if nameError}
						<div class="text-body text-primary-red">
							{nameErrorMessage}
						</div>
					{/if}
				</label>
			</div>
		</form>
		<div class="my-2 flex max-h-[400px] flex-col overflow-y-auto">
			{#each emailLabelList as emailLabel, index}
				<div>
					<div class="mb-[8px]">
						<EmailLabel {emailLabel} {index} />

						<!-- {#if showEditEmailLabelModal && selectedEmailLabel && emailLabel.id === selectedEmailLabel.id}
						<div class="fixed mr-0 mt-0">
							<EditEmailLabel
								closePopupMenu={() => {
									toggleEditEmailLabelModal();
								}}
								emailLabel={selectedEmailLabel}
							/>
						</div>
					{/if} -->
					</div>
					<!-- <div data-popup="editEmailLabelPopup">
						<EditEmailLabel
							closePopupMenu={() => {
								refreshEmailLabels();
							}}
							{emailLabel}
						/>
					</div> -->
				</div>
			{/each}
		</div>
		<!-- prettier-ignore -->
		<footer class="modal-footer text-primary-white {parent.regionFooter}">
            
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
	</div>
{/if}
