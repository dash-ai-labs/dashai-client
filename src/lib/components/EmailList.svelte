<script lang="ts">
	import { emailAccount, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, type Email } from '$lib/email';
	import EmailListItem from './EmailListItem.svelte';

	let emails: Email[] = [];

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
</script>

<div class="no-scrollbar max-h-[760px] w-80 overflow-y-scroll rounded-lg bg-primary-container">
	{#each emails as email}
		<svelte:component
			this={EmailListItem}
			{email}
			on:click={() => {
				console.log('clicked');
			}}
		/>
	{/each}
</div>
