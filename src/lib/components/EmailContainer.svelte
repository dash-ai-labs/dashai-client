<script lang="ts">
	import { type Email } from '$lib/types';
	import EmailDetailView from './EmailDetailView.svelte';
	import EmailList from './EmailList.svelte';

	let email = $state<Email | undefined>(undefined);
	let emailList: EmailList | undefined = undefined;
	let emailDetailView: EmailDetailView | undefined = undefined;
	const selectEmail = (selectedEmail: Email) => {
		if (emailDetailView) email = selectedEmail; // Set the email to be passed as a prop
	};

	const removeEmail = (removedEmail: Email) => {
		if (emailList) emailList.removeEmail(removedEmail);
		email = undefined;
	};

	const archiveEmail = (achivedEmail: Email) => {
		if (emailList) emailList.archiveEmail(achivedEmail);
	};

	const markEmailAsUnread = (email: Email) => {
		if (emailList) emailList.markEmailAsUnread(email);
	};
</script>

<div>
	<div class="flex h-full flex-row gap-[20px] py-[20px]">
		<EmailList {selectEmail} bind:this={emailList} />
		<EmailDetailView
			{email}
			{removeEmail}
			{archiveEmail}
			{markEmailAsUnread}
			bind:this={emailDetailView}
		/>
	</div>
</div>
