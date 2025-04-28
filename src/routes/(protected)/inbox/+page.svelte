<script lang="ts">
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { user } from '$lib/store';
	import { EmailAccountStatus, EmailFolder, type EmailAccount } from '$lib/types';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let isReady = true;

	onMount(() => {
		refreshEmailLabels();
		const modal: ModalSettings = {
			type: 'component',
			component: 'emailAISearchComponent',
			title: 'Email Label',
			body: 'Add new email label',
			position: 'items-start justify-start'
		};
	});

	const modalStore = getModalStore();

	function modalComponentForm(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'newEmailLabelComponent',
			title: 'Email Label',
			body: 'Add new email label',
			response: (r) => refreshEmailLabels()
		};
		modalStore.trigger(modal);
	}

	function inboxNotReady(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'inboxNotReadyComponent',
			title: 'Syncing email account(s)',
			body: 'Your inbox is huge. Please wait while we sync your emails.\nThis may take a few minutes.',
			position: 'items-center justify-center',
			backdropClasses: '!bg-black/40',

			response: (r) => {
				checkEmailAccountStatus();
			}
		};
		modalStore.trigger(modal);
	}

	const checkEmailAccountStatus = () => {
		const emailAccounts: EmailAccount[] | undefined = get(user)?.profile?.email_accounts;
		if (emailAccounts && emailAccounts.length > 0) {
			if (
				emailAccounts.some((emailAccount) => emailAccount.status === EmailAccountStatus.SUCCESS)
			) {
				isReady = true;
			} else {
				inboxNotReady();
			}
		}
	};
	$effect(() => {
		checkEmailAccountStatus();
	});
</script>

<div class="inbox-container">
	<div class="inbox-content">
		<!-- <div class="inbox-title-row">
			<div class="inbox-title">Inbox</div>

			<div class="inbox-actions">
				<PrimaryButton on:click={modalComponentForm}>+ Email Label</PrimaryButton>
			</div>
		</div> -->
		<!-- <Widgets /> -->
		<EmailContainer folder={EmailFolder.INBOX} />
	</div>
</div>
