<script lang="ts">
	import { searchEmailsStreaming } from '$lib/api/email';
	import { aiSearchQuery, emailSearchList, user } from '$lib/store';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';

	let SearchBarClasses = $derived(
		`rounded-lg bg-primary-container w-[60vw] align-center my-[10px] flex p-[4px]`
	);
	let searchInput = $state('');
	let showError = $state(false);
	const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'component',
		component: 'emailAISearchComponent',
		title: 'Email Label',
		body: 'Add new email label',
		response: (r) => {
			emailSearchList.set([]);
			searchInput = '';
			aiSearchQuery.set('');
		}
	};
	const handleInput = async () => {
		if (searchInput.length > 0) {
			modalStore.trigger(modal);
			const id = crypto.randomUUID();
			emailSearchList.update((list) => [
				{
					query: searchInput,
					resultReader: null,
					loading: true,
					id: id
				}
			]);
			aiSearchQuery.set(searchInput);

			const currentUser = get(user);
			if (!currentUser?.id) {
				emailSearchList.update((list) =>
					list.map((item) => ({
						...item,
						loading: false
					}))
				);
				return;
			}

			const reader = await searchEmailsStreaming({
				user: currentUser.id.toString(),
				search: searchInput
			});
			if (reader) {
				emailSearchList.update((list) => [
					{
						query: searchInput,
						resultReader: reader,
						loading: false,
						id: id
					}
				]);
			}
		} else {
			showError = true;
		}
	};

	const valueChanged = () => {
		showError = false;
	};
</script>

<div class="flex flex-col">
	<div class={SearchBarClasses}>
		<form onsubmit={handleInput} class="flex w-full flex-row">
			<button class="align-center items-center px-[2px]">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
						class="fill-primary-inactive-button-highlight hover:fill-primary-active-button-highlight"
					/>
				</svg></button
			>
			<input
				bind:value={searchInput}
				oninput={valueChanged}
				type="text"
				placeholder="Search Inbox"
				class="w-full border-0 bg-transparent focus:outline-none focus:ring-0"
			/>
		</form>
	</div>
	{#if showError}
		<div class="text-red-500">Search query cannot be empty</div>
	{/if}
</div>
