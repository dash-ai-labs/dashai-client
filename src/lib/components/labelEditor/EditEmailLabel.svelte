<script lang="ts">
	import { run } from 'svelte/legacy';
	import { createLabel, deleteLabel, editLabel } from '$lib/api/label';
	import { emailLabels, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { LabelColor, LabelType, type Label } from '$lib/types';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { LabelOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import ColorPicker from './ColorPicker.svelte';
	import { refreshEmailLabels } from '$lib/helpers';

	interface Props {
		showModal?: boolean;
		emailLabel: Label;
		closePopupMenu: () => void;
	}

	let { showModal = $bindable(true), emailLabel, closePopupMenu }: Props = $props();
	let nameInput = $state(emailLabel.name);
	let emailLabelList = $state<Label[]>(get(emailLabels));
	let nameError = $state(false);
	let nameErrorMessage = $state('');
	let colorInput = $state(emailLabel.color);

	export function toggleModal() {
		showModal = !showModal;
	}

	const handleEnterKey = (e) => {
		if (e.key === 'Enter') {
			submit();
		}
	};

	emailLabels.subscribe((value) => {
		emailLabelList = value;
	});

	onMount(() => {
		refreshEmailLabels();
	});

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
				toggleModal();
				nameInput = '';
				await refreshEmailLabels();
			}
		}
	};

	run(() => {
		if (!showModal) {
			showModal = false;
		}
	});

	run(() => {
		if (nameInput.length > 0) {
			nameError = false;
		}
	});

	const _deleteLabel = async () => {
		const response = await deleteLabel({ user: get(user)?.id.toString(), label: emailLabel.id });
		if (response) {
			await refreshEmailLabels();
			closePopupMenu();
		}
	};

	const _editLabel = async () => {
		const response = await editLabel({
			user: get(user)?.id.toString(),
			label: emailLabel.id,
			name: nameInput,
			color: colorInput
		});
		if (response) {
			emailLabel = response;
			closePopupMenu();
		}
	};

	const _selectColor = (color: LabelColor) => {
		colorInput = color;
		_editLabel();
	};
</script>

<div class="edit-email-label-container">
	<div class="edit-email-label-wrapper">
		<div class="form-group">
			<input
				bind:value={nameInput}
				type="text"
				class="label-input"
				placeholder={emailLabel.name}
				on:keydown={handleEnterKey}
			/>
			{#if nameError}
				<div class="error-message">
					{nameErrorMessage}
				</div>
			{/if}
			<Button onclick={_editLabel}><LabelOutline />Edit Label</Button>
			<Button onclick={_deleteLabel}><TrashBinOutline />Delete</Button>
			<hr class="divider" />
			<ColorPicker selectColor={_selectColor} />
		</div>
	</div>
</div>

<style>
	.edit-email-label-container {
		margin-left: auto;
		margin-top: 1rem;
		overflow: visible;
		border-radius: 0.5rem;
		border: 0.5px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-black);
		padding: 24px;
		color: var(--color-font-light-gray);
		max-width: none;
		max-height: none;
	}

	.edit-email-label-wrapper {
		display: flex;
		width: 300px;
		flex-direction: column;
		gap: 24px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.label-input {
		width: 100%;
		border-radius: 0.375rem;
		border: 0;
		background-color: var(--color-primary-container);
	}

	.label-input:focus {
		outline: none;
		box-shadow: none;
	}

	.error-message {
		font-size: var(--text-body);
		color: var(--color-primary-red);
	}

	.divider {
		width: 100%;
		border-top: 1px solid var(--color-primary-dark-gray);
	}
</style>
