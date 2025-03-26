<script lang="ts">
	import { fade } from 'svelte/transition';
	import { user, emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, markEmailAsRead, searchEmails } from '$lib/api/email';
	import EmailListItem from '$lib/components/emailListContainer/EmailListItem.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import { type Email, type EmailAccount } from '$lib/types';
	import EmailListSearch from './EmailListSearch.svelte';
	import { onMount } from 'svelte';

	let { selectEmail }: { selectEmail: (email: Email) => void } = $props();
	let container = $state<HTMLElement | null>(null);
	let _emailAccount = $state<EmailAccount | undefined>(get(emailServiceState).emailAccount);
	let pageNumber = $state(1);
	let limit = $state(30);
	let listEnd = $state(false);
	let selectedEmail = $state<Email | undefined>(undefined);
	let isLoading = $state(false); // Track if data is being fetched
	let toggleOptions = $state(['All Mail', 'Unread']);
	let isToggleLoading = $state(false); // Loading state for toggle change
	let lastFilter = $state(['INBOX']);
	let disableTransition = $state(false); // New state variable to disable transition
	let previousAccountValue = $state<EmailAccount | undefined>(get(emailServiceState).emailAccount);
	let selectedToggleOption: number = $state(0);
	let _emailList = $state<Email[]>(get(emailServiceState).emailList);

	$effect(() => {
		const state = get(emailServiceState);
		if (state.emailSearchQueryList && state.emailSearchQueryList.length > 0) {
			const _searchEmails = async () => {
				const emailResults = await searchEmails({
					user: get(user)?.id.toString(),
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
		filter: string[] = []
	) => {
		// Only load emails if the filter has changed

		isLoading = true;
		let newEmails;
		if (email === 'All Emails') {
			const { emails, end } = await getEmailList({
				user,
				limit,
				page,
				filter
			});
			newEmails = emails;
			listEnd = end;
		} else {
			const { emails, end } = await getEmailList({
				user,
				account: email,
				limit,
				page,
				filter
			});
			newEmails = emails;
			listEnd = end;
		}
		// Append the new emails to the existing ones, avoiding duplicates
		if (newEmails && newEmails.length > 0) {
			if (_emailList.length === 0) {
				emailServiceState.update((state) => ({
					...state,
					emailList: newEmails
				}));
			} else {
				emailServiceState.update((state) => ({
					...state,
					emailList: [
						...state.emailList,
						...newEmails.filter((newEmail) => !state.emailList.some((e) => e.id === newEmail.id))
					]
				}));
			}
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
		await loadEmails(_emailAccount?.email, get(user)?.id.toString(), limit, pageNumber, lastFilter);
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
				user: get(user)?.id.toString(),
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
		if (selectedEmail?.labels.includes('UNREAD')) updateEmailAsRead();

		// After the update, reset the transition state
		disableTransition = false;
	};

	// const removeEmail = (email: Email) => {
	// 	emails = emails.filter((e) => e.id !== email.id);
	// };

	// Handle toggle change and load emails based on selected option
	const handleToggleChange = async (value: number) => {
		pageNumber = 1; // Reset page number for new filter
		isToggleLoading = true; // Set loading state to true when toggling
		_emailList = []; // Clear the email list to reload for the new filter
		if (value !== 0) {
			if (!lastFilter.includes(toggleOptions[value].toUpperCase())) {
				lastFilter.push(toggleOptions[value].toUpperCase());
			}
		} else {
			lastFilter.pop();
		}

		await loadEmails(_emailAccount?.email, get(user)?.id.toString(), limit, pageNumber, lastFilter);
		isToggleLoading = false; // Set loading state to false after emails are loaded
	};

	const handleAccountChange = () => {
		// Implement the logic to handle account change
	};
</script>

<div class="email-container">
	<div class="email-header">
		<EmailListSearch />
		<div class="radio-group-container">
			<RadioGroup
				active="variant-filled-primary"
				border={0}
				rounded={'rounded-md'}
				size={'sm'}
				background={'bg-primary-black'}
			>
				{#each toggleOptions as option, index}
					<RadioItem
						bind:group={selectedToggleOption}
						name={option}
						value={index}
						on:click={() => handleToggleChange(index)}>{option}</RadioItem
					>
				{/each}
			</RadioGroup>
		</div>
	</div>
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
		flex-direction: column;
		border-radius: 0.5rem;
		background-color: var(--color-primary-container);
	}

	.email-header {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		align-items: start;
		justify-content: center;
		border-bottom: 1px solid var(--color-primary-gray);
		padding: 0.15rem;
		font-size: var(--text-h4);
	}

	.radio-group-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0.15rem;
	}

	.email-list-container {
		flex: 1;
		overflow-y: auto;
		width: 320px;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.email-list-container::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.email-list-container {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
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
