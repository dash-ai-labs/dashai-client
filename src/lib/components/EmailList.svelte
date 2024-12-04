<script lang="ts">
	import { emailAccount, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, type Email } from '$lib/email';
	import EmailListItem from './EmailListItem.svelte';
	import InboxSearchBar from './InboxSearchBar.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let emails: Email[] = [];
	let selectedEmail: Email | undefined = undefined;
	$: if (get(user)?.id) {
		emailAccount.subscribe(($emailAccount) => {
			loadEmails($emailAccount.email, get(user)?.id.toString());
		});
	}
	async function loadEmails(email: string, user: string) {
		if (email === 'All Emails') {
			emails = await getEmailList({ user });
		} else emails = await getEmailList({ user, account: email });
	}

	const handleEmailSelect = (event) => {
		selectedEmail = event.detail;
		dispatch('selectEmail', selectedEmail);
	};
</script>

<div class="w-80 rounded-lg bg-primary-container">
	<div class="text-h4 border-primary-gray h-[60px] border-b p-[10px]">Emails</div>

	<InboxSearchBar />
	<div class="no-scrollbar max-h-[760px] overflow-y-scroll">
		{#each emails as email}
			<svelte:component
				this={EmailListItem}
				{email}
				on:handleEmailSelect={handleEmailSelect}
				selected={selectedEmail ? selectedEmail.id === email.id : false}
			/>
		{/each}
	</div>
</div>
