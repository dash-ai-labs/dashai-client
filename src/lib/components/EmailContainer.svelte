<script lang="ts">
	import { ComposeEmailMode, type Email } from '$lib/types';
	import EmailDetailView from './EmailDetailView.svelte';
	import ComposeEmail from './emailEditor/ComposeEmail.svelte';
	import EmailList from './EmailList.svelte';

	let email = $state<Email | undefined>(undefined);
	let emailList: EmailList | undefined = undefined;
	let emailDetailView: EmailDetailView | undefined = undefined;
	let showComposeEmail = $state(false);
	let composeEmailMode = $state<ComposeEmailMode>(ComposeEmailMode.NewEmail);

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

	const setShowComposeEmail = (show: boolean) => {
		showComposeEmail = show;
	};

	const setComposeEmailMode = (mode: ComposeEmailMode) => {
		composeEmailMode = mode;
	};
</script>

<!-- <div class="relative"> -->
<div class="flex h-[calc(100vh-280px)] flex-row gap-[20px] overflow-hidden pt-[20px]">
	<EmailList {selectEmail} bind:this={emailList} />
	<div class="relative h-full">
		<EmailDetailView
			{email}
			{removeEmail}
			{archiveEmail}
			{markEmailAsUnread}
			{setShowComposeEmail}
			{setComposeEmailMode}
			bind:this={emailDetailView}
		/>
		{#if showComposeEmail}
			<!-- <div class="absolute bottom-[-35px] right-0 w-[calc(100%-340px)]"> -->
			<ComposeEmail {email} {setShowComposeEmail} {composeEmailMode} {setComposeEmailMode} />
			<!-- </div> -->
		{/if}
	</div>
</div>
<!-- </div> -->
