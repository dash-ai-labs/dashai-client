<script lang="ts">
	import { searchEmails } from '$lib/api/email';
	import { aiSearchQuery, user } from '$lib/store';
	import { get } from 'svelte/store';
	import SecondaryButton from '../SecondaryButton.svelte';
	import type { Email } from '$lib/types';
	import X from '$lib/assets/X.svelte';

	const { setShowComposeEmail, setEmailList } = $props();
	let searchInput = $state('');
	let showError = $state(false);

	aiSearchQuery.subscribe((query) => {
		searchInput = query;
	});

	const handleInput = async () => {
		if (searchInput.length > 0) {
			const id = crypto.randomUUID();
			const response: Email[] = await searchEmails({
				user: get(user)?.id.toString(),
				search: searchInput
			});
			setEmailList(response);
		} else {
			showError = true;
		}
	};

	const valueChanged = () => {
		showError = false;
		handleInput();
	};
</script>

<div class="flex flex-row justify-center gap-1 px-2 py-1">
	<form
		onsubmit={handleInput}
		class="flex w-48 flex-row items-center justify-center rounded-lg bg-primary-black px-2"
	>
		<div class="relative flex w-full items-center">
			<input
				bind:value={searchInput}
				onchange={handleInput}
				oninput={handleInput}
				type="text"
				placeholder="Search Inbox"
				class="w-full items-center rounded-lg border-0 bg-transparent px-2 py-1 focus:outline-none focus:ring-0"
			/>
			{#if searchInput.length > 0}
				<button
					type="button"
					class="absolute right-0 rounded-full bg-primary-dark-gray p-1 hover:bg-primary-gray"
					onclick={() => {
						searchInput = '';
						handleInput();
					}}
				>
					<X stroke="stroke-primary-active-button-highlight" />
				</button>
			{/if}
		</div>
	</form>
	<SecondaryButton extraClasses="bg-primary-blue" on:click={() => setShowComposeEmail(true)}
		>Compose</SecondaryButton
	>
</div>
