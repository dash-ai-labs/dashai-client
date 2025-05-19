<script lang="ts">
	import { refreshEmailList } from '$lib/actions/email';
	import { updateUserAction } from '$lib/actions/user';
	import { showToast } from '$lib/helpers';
	import { ToastType } from '$lib/types';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	const modalStore = getModalStore();

	// Tutorial steps
	const tutorialSteps = [
		{
			title: 'Welcome to Your Inbox',
			subtitle: 'Get started with your new email experience',
			image: '/images/tutorial_1.png'
		},
		{
			title: 'Compose emails in your unique style',
			subtitle: 'Choose from a variety of writing styles to express yourself',
			image: '/images/tutorial_2.gif'
		},
		{
			title: 'Organize your emails with simple rules',
			subtitle: 'Choose who shows up in your inbox and what lands in your spam folder',
			image: '/images/tutorial_3.gif' // Replace with appropriate images
		},
		{
			title: 'Create tasks from emails',
			subtitle: 'Turn emails into actionable tasks with a click',
			image: '/images/tutorial_4.gif'
		},
		{
			title: "You're all set!",
			subtitle: 'Enjoy your new email experience',
			image: '/images/tutorial_5.png'
		}
	];

	// Track current step
	let currentStep = $state(0);
	let doNotShowAgain = $state(false);

	// Calculate progress based on steps
	let progress = $derived(((currentStep + 1) / tutorialSteps.length) * 100);

	function nextStep() {
		if (currentStep < tutorialSteps.length - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
	$effect(() => {
		if (currentStep === tutorialSteps.length - 2) {
			refreshEmailList();
		}
	});

	// Function to finish tutorial
	function finishTutorial() {
		// Here you could save user preference if they checked "Do not show again"
		if (doNotShowAgain) {
			// Add logic to save this preference
			const _doNotShowAgain = async () => {
				await updateUserAction(false);
			};
			showToast(toastStore, 'Saving preferences...', ToastType.Info);
			_doNotShowAgain();
			showToast(toastStore, 'Preferences saved', ToastType.Success);
		}

		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="modal-container">
		<div class="header-container">
			<header class="modal-header">{tutorialSteps[currentStep].title}</header>
		</div>
		<article class="modal-body">{tutorialSteps[currentStep].subtitle}</article>
		<div class="image-container">
			<img class="image" src={tutorialSteps[currentStep].image} alt="tutorial step" />
		</div>

		<!-- Progress bar -->
		<div class="progress-container">
			<div class="progress-bar" style="width: {progress}%"></div>
			<div class="progress-text">Step {currentStep + 1} of {tutorialSteps.length}</div>
		</div>

		<!-- Navigation buttons -->
		<div class="navigation-buttons">
			<button class="nav-button {currentStep === 0 ? 'hide' : ''}" onclick={prevStep}>
				Previous
			</button>

			{#if currentStep < tutorialSteps.length - 1}
				<button class="nav-button primary" onclick={nextStep}>Next</button>
			{:else}
				<!-- Do not show again option on last step -->

				<button class="nav-button finish" onclick={finishTutorial}>Finish</button>
			{/if}
		</div>
		{#if currentStep === 4}
			<div class="do-not-show-container">
				<label class="do-not-show-label">
					<input type="checkbox" bind:checked={doNotShowAgain} />
					Do not show this again
				</label>
			</div>
		{/if}
	</div>
{/if}

<style>
	.modal-container {
		overflow: hidden;
		border-radius: 0.5rem;
		align-self: center;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-black);
		padding: 24px;
		color: var(--color-font-light-gray);
		width: 640px;
	}

	.header-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.modal-header {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.modal-body {
		font-size: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		color: var(--color-primary-light-gray);
	}

	:global(.loader-icon) {
		width: 2.5rem;
		animation: spin 2s linear infinite;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	.image-container {
		display: flex;
		align-items: center;
		justify-items: center;
		align-self: center;
		justify-content: center;
	}
	.image {
		border-radius: 5px;
		width: 640px;
	}

	/* Progress bar styles */
	.progress-container {
		position: relative;
		width: 100%;
		height: 20px;
		background-color: var(--color-primary-dark-gray);
		border-radius: 4px;
		margin: 10px 0;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--color-primary-500, #4caf50);
		transition: width 0.3s ease;
	}

	.progress-text {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		line-height: 20px;
		text-align: center;
		color: white;
		font-size: 0.8rem;
		font-weight: bold;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.navigation-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		width: 100%;
	}

	.nav-button {
		padding: 8px 16px;
		border-radius: 4px;
		border: none;
		background-color: var(--color-primary-dark-gray);
		color: var(--color-font-light-gray);
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.2s;
	}

	.nav-button.hide {
		display: none;
	}

	.nav-button:hover {
		background-color: var(--color-secondary-active-button-background-hover);
	}

	.nav-button.primary {
		background-color: var(--color-primary-button);
	}

	.nav-button.finish {
		background-color: var(--color-primary-button);
	}

	.do-not-show-container {
		display: flex;
		align-items: center;
		padding-top: 16px;
		color: var(--color-primary-light-gray);
	}

	.do-not-show-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.do-not-show-label input {
		cursor: pointer;
	}
</style>
