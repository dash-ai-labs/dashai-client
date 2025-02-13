<script lang="ts">
	import { getEmailList } from '$lib/api/email';
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import InboxAccountDropdown from '$lib/components/InboxAccountDropdown.svelte';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { emailList, user } from '$lib/store';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
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

	onMount(async () => {
		const _emailList = await getEmailList({
			user: get(user)?.id.toString(),
			limit: 30,
			page: 1,
			filter: ['INBOX']
		});
		emailList.set(_emailList);
	});
</script>

<div class="mx-[40px]">
	<div class="flex flex-row items-center">
		<InboxSearchBar />
		<InboxAccountDropdown />
	</div>

	<div class="mt-[40px] flex-col gap-[25px]">
		<div class="flex flex-row">
			<div class="w-full text-h2">Inbox</div>

			<div class="flex w-full justify-end">
				<PrimaryButton on:click={modalComponentForm}>+ Email Label</PrimaryButton>
			</div>
		</div>
		<!-- <Widgets /> -->
		<EmailContainer />
	</div>
</div>
