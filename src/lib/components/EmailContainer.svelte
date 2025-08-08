<script lang="ts">
	import { markAsUnread } from '$lib/api/email';
	import { EmailCategory, EmailFolder, type Email } from '$lib/types';
	import { get } from 'svelte/store';
	import EmailDetailView from './EmailDetailView.svelte';
	import ComposeEmail from './emailEditor/ComposeEmail.svelte';
	import { emailServiceState, user } from '$lib/store';
	import EmailCommandBar from './emailCommandBar/EmailCommandBar.svelte';
	import EmailList from '$lib/components/emailListContainer/EmailList.svelte';
	import MiniEmailList from './emailListContainer/MiniEmailList.svelte';

	let { folder = EmailFolder.INBOX }: { folder: EmailFolder } = $props();
	let email = $state<Email | null>(null);
	let emailDetailView: EmailDetailView | undefined = undefined;
	let showComposeEmail = $state(get(emailServiceState).showComposeEmail);
	let composeEmailMode = $state(get(emailServiceState).composeEmailMode);

	emailServiceState.subscribe((state) => {
		if (showComposeEmail !== state.showComposeEmail) {
			showComposeEmail = state.showComposeEmail;
			composeEmailMode = state.composeEmailMode;
		}
		if (email !== state.currentEmail) {
			email = state.currentEmail;
		}
	});

	const selectEmail = (selectedEmail: Email) => {
		emailServiceState.update((state) => ({
			...state,
			currentEmail: selectedEmail
		}));
	};

	const markEmailAsUnread = (email: Email) => {
		const _markAsUnread = async () => {
			const res = await markAsUnread({
				user: get(user)?.id?.toString() || '',
				email_id: email.email_id
			});
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

<div class={folder === EmailFolder.HOME ? 'mini-email-container' : 'email-container'}>
	<div class="email-section">
		<EmailCommandBar {markEmailAsUnread} {folder} />
		<div class="content">
			{#if folder === EmailFolder.HOME}
				<div class="multiple-email-list-container">
					<MiniEmailList
						{selectEmail}
						folder={EmailFolder.INBOX}
						limit={40}
						category={[EmailCategory.URGENT, EmailCategory.ACTIONABLE]}
					/>
					<MiniEmailList
						{selectEmail}
						folder={EmailFolder.INBOX}
						limit={40}
						category={[EmailCategory.INFORMATION]}
					/>
				</div>
			{:else}
				<EmailList {selectEmail} {folder} />
			{/if}
			{#if showComposeEmail && email}
				{#key showComposeEmail}
					<ComposeEmail {email} {composeEmailMode} height={600} />
				{/key}
			{/if}
		</div>
	</div>

	<!-- EmailDetailView is now rendered as a drawer overlay -->
	<EmailDetailView bind:this={emailDetailView} />
</div>

<style>
	.email-container {
		width: 100%;
		height: 100%; /* Use 100% to take full parent height */
		padding-block: 4px;
		display: flex;
		flex-direction: column;
		overflow: visible;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-container);

		border-radius: 10px;
	}

	.mini-email-container {
		width: 100%;
		height: 100%; /* Use 100% to take full parent height */
		padding-block: 4px;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: visible;
	}

	.email-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		flex: 1;
		min-height: 0; /* Important for flex child to shrink */
	}
	.content {
		flex: 1;
		width: 100%;
		min-height: 0; /* Important for flex child to shrink */
	}
	.multiple-email-list-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		flex: 1;
		height: 100%;
		min-height: 0; /* Important for flex child to shrink */
	}
</style>
