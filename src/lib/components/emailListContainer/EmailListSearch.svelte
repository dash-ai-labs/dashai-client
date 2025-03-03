<script>
	import { aiSearchQuery, emailSearchList } from '$lib/store';
	import PrimaryButton from '../PrimaryButton.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
	let searchInput = $state('');
	let showError = $state(false);
	aiSearchQuery.subscribe((query) => {
		searchInput = query;
	});

	const handleInput = async () => {
		if (searchInput.length > 0) {
			const id = crypto.randomUUID();
			emailSearchList.update((list) => [
				{
					query: searchInput,
					resultReader: null,
					loading: true,
					id: id
				}
			]);
		} else {
			showError = true;
		}
	};

	const valueChanged = () => {
		showError = false;
	};
</script>

<div class="justify-center px-2 py-1">
	<form onsubmit={handleInput} class="flex flex-row items-center justify-center gap-1">
		<input
			bind:value={searchInput}
			oninput={valueChanged}
			type="text"
			placeholder="Search Inbox"
			class="items-center justify-center rounded-lg border-0 bg-primary-black focus:outline-none focus:ring-0"
		/>
		<SecondaryButton extraClasses="bg-primary-blue " on:click={console.log('clicked')}
			>Compose</SecondaryButton
		>
	</form>
</div>
