<script lang="ts">
	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { LabelColor, LabelType, type Label } from '$lib/types';
	import { createLabel } from '$lib/api/label';
	import { get } from 'svelte/store';
	import { emailServiceState, user } from '$lib/store';
	import { refreshEmailLabels } from '$lib/helpers';
	import { type PopupSettings } from '@skeletonlabs/skeleton';
	import EmailLabel from './EmailLabel.svelte';

	// Props
	/** Exposes parent props to this component. */
	// let parent = $props();

	const modalStore = getModalStore();
	let nameInput = $state('');
	let nameError = $state(false);
	let nameErrorMessage = $state('');
	let emailLabelList = $state<Label[]>(get(emailServiceState).emailLabels);

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
	emailServiceState.subscribe((value) => {
		emailLabelList = value.emailLabels;
	});
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form">
	<!-- <header class="modal-header">{$modalStore[0].title ?? '(title missing)'}</header>
	<article>{$modalStore[0].body ?? '(body missing)'}</article> -->
	<!-- Enable for debugging: -->

	<form class="modal-form">
		<div class="form-container">
			<label class="label">
				<input
					bind:value={nameInput}
					type="text"
					class="input-field"
					placeholder="Enter label name"
					on:keydown={handleEnterKey}
				/>
				{#if nameError}
					<div class="error-message">
						{nameErrorMessage}
					</div>
				{/if}
			</label>
		</div>
	</form>
	<div class="label-list">
		{#each emailLabelList as emailLabel, index}
			<div>
				<div class="label-item">
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
	<!-- <footer class="modal-footer {parent.regionFooter}">
            
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer> -->
</div>

<style>
	.modal-example-form {
		overflow: hidden;
		border-radius: 0.5rem;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-black);
		padding: 24px;
		color: var(--color-font-light-gray);
	}

	.modal-header {
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 700;
	}

	.modal-form {
		max-width: 28rem;
		border-radius: 0.375rem;
		background-color: var(--color-primary-black);
	}

	.form-container {
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		width: 300px;
		flex-direction: column;
		gap: 24px;
	}

	.input-field {
		width: 100%;
		border-radius: 0.375rem;
		border: 0;
		background-color: var(--color-primary-container);
	}

	.input-field:focus {
		outline: none;
		box-shadow: none;
	}

	.error-message {
		font-size: var(--text-body);
		color: var(--color-primary-red);
	}

	.label-list {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		display: flex;
		max-height: 400px;
		flex-direction: column;
		overflow-y: auto;
	}

	.label-item {
		margin-bottom: 8px;
	}

	.modal-footer {
		color: var(--color-primary-white);
	}
</style>
