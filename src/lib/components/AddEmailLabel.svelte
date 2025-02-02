<script lang="ts">
	import { createLabel } from '$lib/api/label';
	import { emailLabels, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { LabelColor, LabelType, type Email, type Label } from '$lib/types';
	import { onMount } from 'svelte';
	import EmailLabel from './EmailLabel.svelte';
	import { refreshEmailLabels } from '$lib/helpers';

	interface Props {
		email: Email;
		addLabelToEmail: (email: Email, emailLabel: Label) => void;
	}
	let { email, addLabelToEmail }: Props = $props();
	let nameInput = $state('');
	let emailLabelList = $state<Label[]>(get(emailLabels));
	let nameError = $state(false);
	let nameErrorMessage = $state('');

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
				nameInput = '';
				addLabelToEmail(email, response);
				await refreshEmailLabels();
			}
		}
	};
</script>

<div
	class="ml-auto mt-4 overflow-visible rounded-lg border-[0.5px] border-primary-dark-gray bg-primary-black p-[24px] text-font-light-gray"
	style="max-width: none; max-height: none;"
>
	<div class="my-[10px] flex w-[300px] flex-col gap-[24px]">
		<div>
			<input
				bind:value={nameInput}
				type="text"
				class="w-full rounded-md border-0 bg-primary-container focus:outline-none focus:ring-0"
				placeholder="Enter label name"
				onkeydown={handleEnterKey}
			/>
			{#if nameError}
				<div class="text-body text-primary-red">
					{nameErrorMessage}
				</div>
			{/if}
		</div>
	</div>

	<div class="my-2 flex max-h-[400px] flex-col overflow-y-auto">
		{#each emailLabelList as emailLabel, index}
			<button class="mb-[8px]" onclick={() => addLabelToEmail(email, emailLabel)}>
				<EmailLabel {emailLabel} {index} />
			</button>
		{/each}
	</div>
</div>
