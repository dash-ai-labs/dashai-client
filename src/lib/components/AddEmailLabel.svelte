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

<div class="add-email-label-container">
	<div class="input-wrapper">
		<div>
			<input
				bind:value={nameInput}
				type="text"
				class="label-input"
				placeholder="Enter label name"
				on:keydown={handleEnterKey}
			/>
			{#if nameError}
				<div class="error-message">
					{nameErrorMessage}
				</div>
			{/if}
		</div>
	</div>

	<div class="label-list">
		{#each emailLabelList as emailLabel, index}
			<button class="label-button" on:click={() => addLabelToEmail(email, emailLabel)}>
				<EmailLabel {emailLabel} {index} />
			</button>
		{/each}
	</div>
</div>

<style>
	.add-email-label-container {
		margin-left: auto;
		margin-top: 1rem;
		overflow: visible;
		border-radius: 0.5rem;
		border: 0.5px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-black);
		padding: 24px;
		text-align: inherit;
		color: var(--color-font-light-gray);
		max-width: none;
		max-height: none;
	}

	.input-wrapper {
		margin: 10px 0;
		display: flex;
		width: 300px;
		flex-direction: column;
		gap: 24px;
	}

	.label-input {
		width: 100%;
		border-radius: 0.375rem;
		border: 0;
		background-color: var(--color-primary-container);
	}

	.error-message {
		font-size: var(--text-body);
		color: var(--color-primary-red);
	}

	.label-list {
		margin: 0.5rem 0;
		display: flex;
		max-height: 400px;
		flex-direction: column;
		overflow-y: auto;
	}

	.label-button {
		margin-bottom: 8px;
	}
</style>
