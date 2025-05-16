<script lang="ts">
	import { WritingStyle } from '$lib/types';
	import { IconChevronDown } from '@tabler/icons-svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { updateEmailSettingsAction } from '$lib/actions/settings';
	import WritingStylePopup from '$lib/components/WritingStylePopup.svelte';
	import { writingStyles } from '$lib/types';
	import { onMount } from 'svelte';
	let activeItem = $state();

	emailServiceState.subscribe((state) => {
		if (
			state.emailSettings[0] &&
			activeItem !== state.emailSettings[0].email_preferences.writing_style
		) {
			activeItem = state.emailSettings[0].email_preferences.writing_style;
		}
	});

	onMount(() => {
		activeItem = get(emailServiceState).emailSettings[0].email_preferences.writing_style;
	});
	const writingStylePopup: PopupSettings = {
		event: 'click',
		target: 'settings-writingStylePopup',
		placement: 'bottom-start',
		closeQuery: 'button'
	};

	const setWritingStyle = (key: WritingStyle) => {
		updateEmailSettingsAction(get(emailServiceState).emailSettings[0].email_account_id, {
			email_preferences: {
				...get(emailServiceState).emailSettings[0].email_preferences,
				writing_style: key
			},
			email_list: get(emailServiceState).emailSettings[0].email_list
		});
		emailServiceState.update((state) => ({
			...state,
			emailSettings: state.emailSettings.map((setting) => ({
				...setting,
				email_preferences: {
					...setting.email_preferences,
					writing_style: key
				}
			}))
		}));
	};
</script>

<div class="settings-detail-container">
	<h2 class="settings-detail-header">Compose Rules</h2>
	<p class="settings-detail-description">Customize how AI assists you with composing emails.</p>
	<div class="separator"></div>
	<div class="writing-style-container">
		<div class="writing-style-label">Writing Style</div>
		<div class="writing-style-content-container">
			<button use:popup={writingStylePopup} class="menu-button" type="button">
				{#if activeItem}
					<span class="writing-style-selected">{writingStyles[activeItem].label}</span>
				{:else}
					<span class="writing-style-placeholder">Select Writing Style</span>
				{/if}
				<IconChevronDown class="chevron-icon" />
			</button>
			<div data-popup="settings-writingStylePopup">
				<WritingStylePopup selectWritingStyle={setWritingStyle} />
			</div>
		</div>
	</div>
</div>

<style>
	.writing-style-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.writing-style-label {
		font-size: 16px;
		font-weight: 600;
		padding-right: 20px;
	}
	.writing-style-content-container {
		position: relative;
		background-color: var(--color-primary-container);
	}
	.writing-style-dropdown {
		background-color: var(--color-primary-container);
	}
	.menu-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		border: 1px solid var(--color-primary-dark-gray);
		border-radius: 5px;
		cursor: pointer;
		background-color: var(--color-primary-container);
		color: var(--color-primary-white);
		width: 200px;
		height: 40px;
	}
	.menu-button:hover {
		background-color: var(--color-primary-dark-gray);
	}

	.writing-style-placeholder {
		color: var(--color-primary-gray);
		font-weight: 300;
		padding-inline: 5px;
		align-self: center;
	}
	.writing-style-selected {
		color: var(--color-primary-light-gray);
		font-weight: 500;
		padding-inline: 5px;
		align-self: center;
	}
</style>
