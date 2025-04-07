<script lang="ts">
	import { searchEmailsStreaming } from '$lib/api/email';
	import { aiSearchQuery, emailSearchList, user } from '$lib/store';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconSearch } from '@tabler/icons-svelte';
	import { get } from 'svelte/store';

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

<div class="search-container">
	<div class="search-bar">
		<form on:submit|preventDefault={handleInput} class="search-form">
			<button class="search-button">
				<IconSearch size="22" color="var(--color-primary-gray)" />
			</button>
			<input
				bind:value={searchInput}
				on:input={valueChanged}
				type="text"
				placeholder="Search Inbox"
				class="search-input"
			/>
		</form>
	</div>
	{#if showError}
		<div class="error-message">Search query cannot be empty</div>
	{/if}
</div>

<style>
	.search-container {
		display: flex;
		flex-direction: column;
	}

	.search-bar {
		border-radius: 0.5rem;
		background-color: var(--color-primary-container);
		width: 60vw;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		padding: 4px;
		border: 1px solid var(--color-primary-gray);
	}

	.search-form {
		display: flex;
		width: 100%;
		flex-direction: row;
	}

	.search-button {
		align-items: center;
		display: flex;
		padding-left: 4px;
		padding-right: 4px;
	}

	.search-input {
		width: 100%;
		border: 0;
		background-color: transparent;
	}

	.search-input:focus {
		outline: none;
		box-shadow: none;
	}

	.search-icon {
		fill: var(--color-primary-inactive-button-highlight);
	}

	.search-icon:hover {
		fill: var(--color-primary-active-button-highlight);
	}

	.error-message {
		color: var(--color-primary-red);
	}
</style>
