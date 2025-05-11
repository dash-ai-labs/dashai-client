<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { ToastType } from '$lib/types';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { deleteAccount } from '$lib/actions/user';
	import { showToast } from '$lib/helpers';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	function deleteAccountModal(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'confirmActionModal',
			title: 'Delete Account',
			confirmButtonText: 'Delete Account',
			confirmSuccessStringCheck: 'delete account',
			confirmButtonClass: 'bg-secondary-red text-primary-black',
			confirmButtonAction: () => {
				showToast(toastStore, 'Sending request to delete account...', ToastType.Info);
				deleteAccount();
				showToast(toastStore, 'Account deletion request sent successfully', ToastType.Success);
			},
			description:
				'This action is permanent and cannot be undone. Please type "delete account" to confirm.'
		};
		modalStore.trigger(modal);
	}
</script>

<div class="settings-detail-container">
	<h2 class="settings-detail-header">Delete Account</h2>
	<p class="settings-detail-description">
		Once you delete your account, there is no going back. Please be certain.
	</p>
	<button class="delete-account-button" onclick={deleteAccountModal}>Delete Account</button>
</div>

<style>
	.delete-account-button {
		border: 1px solid var(--color-secondary-red);
		color: var(--color-secondary-red);
		padding: 10px 20px;
		width: fit-content;
		border-radius: 5px;
	}
	.delete-account-button:hover {
		background-color: var(--color-secondary-red);
		color: var(--color-primary-black);
	}
</style>
