<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	interface ConfirmActionModalProps {
		title: string;
		description: string;
		confirmButtonText: string;
		confirmSuccessStringCheck: string;
		confirmButtonClass: string;
		confirmButtonAction: () => void;
	}
	const modalStore = getModalStore();
	let confirmButtonEnabled = $state(false);
	let confirmButtonInput = $state('');
	const {
		title,
		description,
		confirmButtonText,
		confirmButtonClass,
		confirmSuccessStringCheck,
		confirmButtonAction
	}: ConfirmActionModalProps = $modalStore[0];
</script>

{#if $modalStore[0]}
	<div class="container">
		<div class="title">{title}</div>
		<div class="description">{description}</div>
		<div class="input-container">
			<input
				type="text"
				class="input"
				bind:value={confirmButtonInput}
				placeholder={`Type '${confirmSuccessStringCheck}' to confirm`}
				oninput={() => {
					confirmButtonEnabled = confirmButtonInput === confirmSuccessStringCheck;
				}}
			/>
		</div>
		<div class="button-container">
			<button
				class="confirm-button {confirmButtonClass} {confirmButtonEnabled ? 'enabled' : 'disabled'}"
				onclick={() => {
					confirmButtonAction();
					modalStore.close();
				}}
				disabled={!confirmButtonEnabled}
			>
				{confirmButtonText}
			</button>
			<button class="cancel-button" onclick={() => modalStore.close()}>Cancel</button>
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 400px;
		padding: 20px;
		border-radius: 10px;
		background-color: var(--color-primary-container);
	}
	.title {
		font-size: 24px;
		font-weight: 600;
	}
	.description {
		font-size: 16px;
		color: var(--color-primary-light-gray);
	}
	.button-container {
		display: flex;
		gap: 10px;
	}
	.confirm-button {
		padding: 10px 20px;
		border-radius: 5px;
	}
	.confirm-button.disabled {
		background-color: var(--color-primary-gray);
		color: var(--color-primary-text);
		padding: 10px 20px;
		border-radius: 5px;
		border: 1px solid var(--color-primary-container);
	}
	.cancel-button {
		background-color: var(--color-primary-container);
		color: var(--color-primary-text);
		padding: 10px 20px;
		border-radius: 5px;
		border: 1px solid var(--color-primary-gray);
	}
	.input-container {
		display: flex;
		gap: 10px;
	}
	.input {
		width: 100%;
		border: 1px solid var(--color-primary-gray);
		border-radius: 5px;
		padding: 10px 20px;
		text-align: left;
		color: var(--color-primary-text);
	}
</style>
