<script>
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import InboxAccountDropdown from '$lib/components/InboxAccountDropdown.svelte';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import Widgets from '$lib/components/Widgets.svelte';

	export let user;
</script>

<div class="mx-[40px]">
	<div class="flex flex-row">
		<InboxSearchBar />
		<InboxAccountDropdown />
	</div>

	<div class="my-[53px] flex flex-col gap-[25px]">
		<div class="flex flex-row">
			<div class="w-full text-h2">Inbox</div>
			<div class="flex w-full justify-end">
				<PrimaryButton>+ Email Label</PrimaryButton>
			</div>
		</div>
		<Widgets />
		<EmailContainer />
	</div>
</div>
