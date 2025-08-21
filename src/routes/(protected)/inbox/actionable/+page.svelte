<script lang="ts">
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { user } from '$lib/store';
	import { EmailCategory, EmailFolder } from '$lib/types';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	onMount(() => {
		refreshEmailLabels();
	});

	const modalStore = getModalStore();

	function inboxNotReady(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'inboxNotReadyComponent',
			position: 'items-center justify-center',
			backdropClasses: '!bg-black/40'
		};
		modalStore.trigger(modal);
	}

	const checkTutorialStatus = () => {
		const profile = get(user)?.profile;

		if (profile?.show_tutorial) {
			inboxNotReady();
		}
	};

	$effect(() => {
		checkTutorialStatus();
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
		<EmailContainer folder={EmailFolder.INBOX} category={[EmailCategory.ACTIONABLE]} />
	</div>
</div>
