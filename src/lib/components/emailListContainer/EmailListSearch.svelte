<script lang="ts">
	import { searchEmails } from '$lib/api/email';
	import { emailServiceState, user } from '$lib/store';
	import { get } from 'svelte/store';
	import type { Email } from '$lib/types';
	import X from '$lib/assets/X.svelte';
	import { refreshEmailList } from '$lib/actions';
	import { IconSearch } from '@tabler/icons-svelte';
	let searchInput = $state('');
	let showError = $state(false);

	$effect(() => {
		searchInput = get(emailServiceState).aiSearchQuery;
	});

	const handleInput = async () => {
		if (searchInput.length > 0) {
			const id = crypto.randomUUID();
			const response: Email[] = await searchEmails({
				user: get(user)?.id.toString(),
				search: searchInput
			});
			emailServiceState.update((state) => ({
				...state,
				emailList: response,

				aiSearchQuery: searchInput
			}));
		} else {
			showError = true;
		}
	};

	const valueChanged = () => {
		showError = false;
		handleInput();
	};
</script>

<div class="search-container flex-shrink-0">
	<form onsubmit={handleInput} class="search-form">
		<div class="input-container">
			<IconSearch size="22" color="var(--color-primary-gray)" />
			<input
				bind:value={searchInput}
				onchange={handleInput}
				oninput={handleInput}
				type="text"
				placeholder="Search Inbox"
				class="search-input"
			/>
			{#if searchInput.length > 0}
				<button
					type="button"
					class="clear-button"
					onclick={() => {
						searchInput = '';
						handleInput();
						refreshEmailList();
				</button>
			{/if}
		</div>
	</form>
</div>

<style>
	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 0.15rem;
		height: 48px;
		width: 100%;
	}

	.search-form {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		background-color: var(--color-primary-black);
		padding: 0 0.5rem;
	}

	.input-container {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
	}

	.search-input {
		width: 100%;
		align-items: center;
		border-radius: 0.5rem;
		border: 0;
		background-color: transparent;
		padding: 0.25rem 0.5rem;
	}

	.search-input:focus {
		outline: none;
	}

	.clear-button {
		position: absolute;
		right: 0;
		border-radius: 9999px;
		background-color: var(--color-primary-dark-gray);
		padding: 0.25rem;
	}

	.clear-button:hover {
		background-color: var(--color-primary-gray);
	}
</style>
