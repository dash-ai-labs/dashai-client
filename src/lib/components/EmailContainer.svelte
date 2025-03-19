<script lang="ts">
	import { emailLabelAction } from '$lib/api/email';
	import { ComposeEmailMode, EmailLabelAction, type Email, type Label } from '$lib/types';
	import { get } from 'svelte/store';
	import EmailDetailView from './EmailDetailView.svelte';
	import ComposeEmail from './emailEditor/ComposeEmail.svelte';
	import EmailList from './emailListContainer/EmailList.svelte';
	import { emailServiceState, user } from '$lib/store';
	import EmailCommandBar from './emailCommandBar/EmailCommandBar.svelte';

	let email = $state<Email | undefined>(undefined);
	let emailList: EmailList | undefined = undefined;
	let emailDetailView: EmailDetailView | undefined = undefined;
	let showComposeEmail = $state(get(emailServiceState).showComposeEmail);
	let composeEmailMode = $state(get(emailServiceState).composeEmailMode);

	const selectEmail = (selectedEmail: Email) => {
		if (emailDetailView) {
			email = selectedEmail;
			emailServiceState.update((state) => ({
				...state,
				currentEmail: selectedEmail
			}));
		} // Set the email to be passed as a prop
	};
	emailServiceState.subscribe((state) => {
		if (showComposeEmail !== state.showComposeEmail) {
			showComposeEmail = state.showComposeEmail;
			composeEmailMode = state.composeEmailMode;
		}
	});

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
			const currentUser = get(user);
			if (!currentUser?.id || !_email) return;

			const res = await emailLabelAction({
				user: currentUser.id.toString(),
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
			const currentUser = get(user);
			if (!currentUser?.id || !_email) return;

			const res = await emailLabelAction({
				user: currentUser.id.toString(),
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
</script>

<div class="container">
	<EmailCommandBar class="command-bar" {removeEmail} {archiveEmail} {markEmailAsUnread} />
	<div class="content">
		<EmailList {selectEmail} bind:this={emailList} />
		<div class="detail-view">
			<EmailDetailView
				{removeEmail}
				{archiveEmail}
				{markEmailAsUnread}
				{addLabelToEmail}
				{removeLabelFromEmail}
				bind:this={emailDetailView}
			/>
			{#if showComposeEmail}
				{#key showComposeEmail}
					<ComposeEmail {email} {composeEmailMode} />
				{/key}
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		height: 100%;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.command-bar {
		flex-shrink: 0;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: row;
		gap: 20px;
		overflow: hidden;
	}

	.detail-view {
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>
