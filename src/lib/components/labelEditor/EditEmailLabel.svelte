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

<div
	class="ml-auto mt-4 overflow-visible rounded-lg border-[0.5px] border-primary-dark-gray bg-primary-black p-[24px] text-font-light-gray"
	style="max-width: none; max-height: none;"
>
	<div class=" flex w-[300px] flex-col gap-[24px]">
		<div class="flex flex-col items-start gap-[10px]">
			<input
				bind:value={nameInput}
				type="text"
				class="w-full rounded-md border-0 bg-primary-container focus:outline-none focus:ring-0"
				placeholder={emailLabel.name}
				on:keydown={handleEnterKey}
			/>
			{#if nameError}
				<div class="text-body text-primary-red">
					{nameErrorMessage}
				</div>
			{/if}
			<Button onclick={_editLabel}><LabelOutline />Edit Label</Button>
			<Button onclick={_deleteLabel}><TrashBinOutline />Delete</Button>
			<hr class="w-full border-t border-primary-dark-gray" />
			<ColorPicker selectColor={_selectColor} />
		</div>
	</div>
</div>
