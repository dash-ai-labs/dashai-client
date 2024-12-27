<script lang="ts">
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import InboxAccountDropdown from '$lib/components/InboxAccountDropdown.svelte';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import NewEmailModal from '$lib/components/NewEmailModal.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import Widgets from '$lib/components/Widgets.svelte';

	let newEmailModalRef = $state(null);

	const toggleEmailModal = () => {
		if (newEmailModalRef) {
			newEmailModalRef.toggleModal();
		}
	};
</script>

<div class="mx-[40px]">
	<NewEmailModal bind:this={newEmailModalRef} />
	<div class="flex flex-row">
		<InboxAccountDropdown />
	</div>

	<div class="mt-[40px] flex-col gap-[25px]">
		<div class="flex flex-row">
			<div class="w-full text-h2">Inbox</div>
			<div class="flex w-full justify-end">
				<PrimaryButton on:click={toggleEmailModal}>+ Email Label</PrimaryButton>
			</div>
		</div>
		<Widgets />
		<EmailContainer />
	</div>
</div>
