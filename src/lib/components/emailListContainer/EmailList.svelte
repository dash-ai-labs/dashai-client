<script lang="ts">
	import { fade } from 'svelte/transition';
	import { user, emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, markEmailAsRead, searchEmails } from '$lib/api/email';
	import EmailListItem from './EmailListItem.svelte';
	import { EmailFolder, type Email, type EmailAccount } from '$lib/types';
	import { onMount } from 'svelte';
	import { clearEmails } from '$lib/actions/email';

	let { selectEmail, folder }: { selectEmail: (email: Email) => void; folder: EmailFolder } =
		$props();
	let container = $state<HTMLElement | null>(null);
	let _emailAccount = $state<EmailAccount | undefined>(get(emailServiceState).emailAccount);
	let pageNumber = $state(1);
	let limit = $state(30);
	let listEnd = $state(false);
	let selectedEmail = $state<Email | undefined>(undefined);
	let isLoading = $state(false); // Track if data is being fetched
	let isToggleLoading = $state(false); // Loading state for toggle change
	let lastFilter = $state([]);
	let disableTransition = $state(false); // New state variable to disable transition
	let user_id = $derived(get(user)?.id?.toString());

	let _emailList = $state<Email[]>(get(emailServiceState).emailList);

	$effect(() => {
		const state = get(emailServiceState);
		if (state.emailSearchQueryList && state.emailSearchQueryList.length > 0) {
			const _searchEmails = async () => {
				const emailResults = await searchEmails({
					user: user_id,
					search: state.emailSearchQueryList[0].query
				});
				emailServiceState.update((state) => ({
					...state,
					emailList: emailResults
				}));
			};
			_searchEmails();
		}
	});

	onMount(() => {
		clearEmails();
		loadNextPage();
	});

	// Function to handle scroll and load next page
	const handleScroll = () => {
		if (!container || isLoading) return; // Prevent duplicate calls while loading
		const { scrollTop, scrollHeight, clientHeight } = container;
		if (scrollTop + clientHeight >= scrollHeight - 100) {
			// Trigger slightly before the end
			loadNextPage();
		}
	};

	// Function to load emails based on the selected toggle option and filter
	const loadEmails = async (
		email: string,
		user: string,
		limit: number = 30,
		page: number = 1,
		filter: { key: string; value: string }[] = []
	) => {
		// Only load emails if the filter has changed
		isLoading = true;
		let newEmails;
		if (email === 'All Emails') {
			const { emails, end } = await getEmailList({
				user,
				limit,
				page,
				filter,
				folder
			});
			newEmails = emails;
			listEnd = end;
		} else {
			const { emails, end } = await getEmailList({
				user,
				account: email,
				limit,
				page,
				filter,
				folder
			});
			newEmails = emails;
			listEnd = end;
		}
		// Append the new emails to the existing ones, avoiding duplicates
		if (newEmails && newEmails.length > 0) {
			emailServiceState.update((state) => ({
				...state,
				emailList: [
					...state.emailList,
					...newEmails.filter((newEmail) => !state.emailList.some((e) => e.id === newEmail.id))
				]
			}));
		}
		isLoading = false;
	};

	emailServiceState.subscribe((state) => {
		if (state.emailList) {
			_emailList = state.emailList;
		}
	});

	// Function to load the next page of emails
	const loadNextPage = async () => {
		if (isLoading) return; // Prevent concurrent calls
		await loadEmails(_emailAccount?.email, user_id, limit, pageNumber, lastFilter);
		pageNumber++; // Increment after a successful fetch
	};

	// Handle email selection
	const handleEmailSelect = (event) => {
		selectedEmail = event.detail;
		selectEmail(selectedEmail);

		// Disable transition before updating the email as read
		disableTransition = true;

		const updateEmailAsRead = async () => {
			const newEmail = await markEmailAsRead({
				user: user_id,
				email_id: selectedEmail?.email_id
			});
			const index = _emailList.findIndex(
				(item: Email) => item.email_id === selectedEmail?.email_id
			);
			if (index !== -1 && newEmail) {
				// Update the object directly

				_emailList = _emailList.map((email: Email) =>
					email.email_id === selectedEmail?.email_id ? newEmail : email
				);
				emailServiceState.update((state) => ({
					...state,
					emailList: _emailList
				}));
			}
		};
		if (!selectedEmail?.is_read && folder === EmailFolder.INBOX) updateEmailAsRead();

		// After the update, reset the transition state
		disableTransition = false;
	};

	// const removeEmail = (email: Email) => {
	// 	emails = emails.filter((e) => e.id !== email.id);
	// };

	// Handle toggle change and load emails based on selected option

	const handleAccountChange = () => {
		// Implement the logic to handle account change
	};
</script>

<div class="email-container">
	<div class="email-list-container" bind:this={container} onscroll={handleScroll}>
		{#if isToggleLoading}
			<!-- Loading indicator when toggle is changing -->
			<div class="loading-indicator" transition:fade={{ duration: 500 }}>Loading...</div>
		{:else}
			{#each _emailList as email (email.id)}
				{#if !disableTransition}
					<div transition:fade={{ duration: 300 }}>
						<EmailListItem
							{email}
							on:handleEmailSelect={handleEmailSelect}
							selected={selectedEmail ? selectedEmail.id === email.id : false}
						/>
					</div>
				{:else}
					<EmailListItem
						{email}
						on:handleEmailSelect={handleEmailSelect}
						selected={selectedEmail ? selectedEmail.id === email.id : false}
					/>
				{/if}
			{/each}
			{#if listEnd}
				<div class="end-of-list" transition:fade={{ duration: 500 }}>No more emails.</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.email-container {
		width: 320px;
		display: flex;
		height: 100%;
		margin: 2px;
		flex-direction: column;
		background-color: var(--color-primary-container);
	}

	.email-list-container {
		flex: 1;
		overflow-y: auto;
		width: 320px;
	}

	.loading-indicator {
		width: 300px;
		padding-top: 1rem;
		padding-bottom: 1rem;
		text-align: center;
	}

	.end-of-list {
		width: 100%;
		padding-top: 1rem;
		padding-bottom: 1rem;
		text-align: center;
		font-weight: 300;
		color: var(--color-primary-gray);
	}
</style>
