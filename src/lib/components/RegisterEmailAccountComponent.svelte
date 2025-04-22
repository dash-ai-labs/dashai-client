<script lang="ts">
	import { addGoogleAccount, addOutlookAccount } from '$lib/api/auth';
	import GoogleLogo from '$lib/assets/GoogleLogo.svelte';
	import OutlookLogo from '$lib/assets/OutlookLogo.svelte';
	import { user } from '$lib/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';

	const modalStore = getModalStore();
	let currentUser = $state(get(user));

	const _addGoogleAccount = async () => {
		if (currentUser?.id) {
			await addGoogleAccount(currentUser.id.toString());
		}
	};

	const _addOutlookAccount = async () => {
		if (currentUser?.id) {
			await addOutlookAccount(currentUser.id.toString());
		}
	};
</script>

{#if $modalStore[0]}
	<div class="modal-container">
		<div class="header-container">
			<header class="modal-header">{$modalStore[0].title ?? '(title missing)'}</header>
		</div>
		<div class="modal-body">
			<button onclick={_addGoogleAccount} class="google-button">
				<div class="button-content">
					<GoogleLogo />Sign In with Google
				</div>
			</button>
			<button onclick={_addOutlookAccount} class="outlook-button">
				<div class="button-content">
					<OutlookLogo />Sign In with Outlook
				</div>
			</button>
		</div>
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
	}
</style>
