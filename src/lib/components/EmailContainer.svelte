<script lang="ts">
	import { emailLabelAction } from '$lib/api/email';
	import { ComposeEmailMode, EmailLabelAction, type Email, type Label } from '$lib/types';
	import { get } from 'svelte/store';
	import EmailDetailView from './EmailDetailView.svelte';
	import ComposeEmail from './emailEditor/ComposeEmail.svelte';
	import EmailList from './emailListContainer/EmailList.svelte';
	import { user } from '$lib/store';

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

	export const addLabelToEmail = (_email: Email, emailLabel: Label) => {
		const _addLabelToEmail = async () => {
			const res = await emailLabelAction({
				user: get(user)?.id.toString(),
				email_id: _email.email_id,
				label_id: emailLabel.id,
				action: EmailLabelAction.Add
			});
			if (res) {
				email = res;
			}
		};
		_addLabelToEmail();
	};

	export const removeLabelFromEmail = (_email: Email, emailLabel: Label) => {
		const _removeLabelFromEmail = async () => {
			const res = await emailLabelAction({
				user: get(user)?.id.toString(),
				email_id: _email.email_id,
				label_id: emailLabel.id,
				action: EmailLabelAction.Remove
			});
			if (res) {
				email = res;
			}
		};
		_removeLabelFromEmail();
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
	<EmailList {setShowComposeEmail} {selectEmail} {setComposeEmailMode} bind:this={emailList} />
	<div class="relative h-full w-full">
		<EmailDetailView
			{email}
			{removeEmail}
			{archiveEmail}
			{markEmailAsUnread}
			{setShowComposeEmail}
			{setComposeEmailMode}
			{addLabelToEmail}
			{removeLabelFromEmail}
			bind:this={emailDetailView}
		/>
		{#if showComposeEmail}
			{#key showComposeEmail}
				<ComposeEmail {email} {setShowComposeEmail} {composeEmailMode} {setComposeEmailMode} />
			{/key}
		{/if}
	</div>
</div>
<!-- </div> -->
