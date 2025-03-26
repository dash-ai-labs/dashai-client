<script lang="ts">
	import { archive, markAsUnread, remove } from '$lib/api/email';
	import { type Email } from '$lib/types';
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
</script>

<div class="container">
	<div class="email-section">
		<EmailCommandBar {removeEmail} {archiveEmail} {markEmailAsUnread} />
		<div class="content">
			<EmailList {selectEmail} />
			<EmailDetailView bind:this={emailDetailView} />
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

	.email-section {
		display: flex;
		flex-direction: column;
		width: 1200px;
		height: 100%;
	}
	.content {
		display: flex;
		flex: 1;
		flex-direction: row;
		gap: 10px;
		overflow: hidden;
	}
</style>
