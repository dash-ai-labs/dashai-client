<script lang="ts">
	import { archive, emailLabelAction, markAsUnread, remove } from '$lib/api/email';
	import { EmailLabelAction, type Email, type Label } from '$lib/types';
	import { get } from 'svelte/store';
	import EmailDetailView from './EmailDetailView.svelte';
	import ComposeEmail from './emailEditor/ComposeEmail.svelte';
	import EmailList from './emailListContainer/EmailList.svelte';
	import { emailServiceState, user } from '$lib/store';
	import EmailCommandBar from './emailCommandBar/EmailCommandBar.svelte';

	let email = $state<Email | undefined>(undefined);
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
		const _remove = async () => {
			const res = await remove({ user: get(user)?.id.toString(), email_id: removedEmail.email_id });
			if (res) {
				emailServiceState.update((state) => ({
					...state,
					emailList: state.emailList.filter((e) => e.email_id !== removedEmail.email_id)
				}));
			}
		};
		_remove();
	};

	const archiveEmail = (achivedEmail: Email) => {
		const _archive = async () => {
			const res = await archive({
				user: get(user)?.id.toString(),
				email_id: achivedEmail.email_id
			});
			if (res) {
				emailServiceState.update((state) => ({
					...state,
					emailList: state.emailList.filter((e) => e.email_id !== achivedEmail.email_id)
				}));
			}
		};
		_archive();
	};

	const markEmailAsUnread = (email: Email) => {
		const _markAsUnread = async () => {
			const res = await markAsUnread({ user: get(user)?.id.toString(), email_id: email.email_id });
			if (res) {
				emailServiceState.update((state) => ({
					...state,
					emailList: state.emailList.map((e) => (e.email_id === email.email_id ? res : e))
				}));
			}
		};
		_markAsUnread();
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
	<EmailCommandBar {removeEmail} {archiveEmail} {markEmailAsUnread} />
	<div class="content">
		<EmailList {selectEmail} />
		<div class="detail-view">
			<EmailDetailView {addLabelToEmail} {removeLabelFromEmail} bind:this={emailDetailView} />
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

	.content {
		display: flex;
		flex: 1;
		flex-direction: row;
		gap: 10px;
		overflow: hidden;
	}

	.detail-view {
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>
