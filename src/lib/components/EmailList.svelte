<script lang="ts">
	import { emailAccount, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, type Email } from '$lib/email';
	import EmailListItem from './EmailListItem.svelte';

	let emails: Email[] = [];
	let selectedEmail: number = 0;
	let options: any[] = [{ label: 'All Emails' }];
	$: if (get(user)?.id) {
		emailAccount.subscribe(($emailAccount) => {
			console.log($emailAccount);
			loadEmails($emailAccount, get(user)?.id.toString());
		});
	}
	async function loadEmails(emailAccount: string, user: string) {
		if (emailAccount === 'All Emails') {
			emails = await getEmailList({ user });
		} else emails = await getEmailList({ user, account: emailAccount });
	}
</script>

<div class="bg-primary-container no-scrollbar max-h-[760px] w-80 overflow-y-scroll rounded-lg">
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
