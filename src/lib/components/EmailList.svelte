<script lang="ts">
	import { fade } from 'svelte/transition';
	import { emailAccount, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, markEmailAsRead, type Email } from '$lib/email';
	import EmailListItem from './EmailListItem.svelte';
	import ToggleOptions from './ToggleOptions.svelte';
	import InboxSearchBar from './InboxSearchBar.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let emails: Email[] = [];
	let container;
	let pageNumber = 1;
	let limit = 30;
	let selectedEmail: Email | undefined = undefined;
	let isLoading = false; // Track if data is being fetched
	let toggleOptions = ['All Mail', 'Unread'];
	let selectedToggleOption = 0;
	let isToggleLoading = false; // Loading state for toggle change
	let lastFilter = ['INBOX'];
	let disableTransition = false; // New state variable to disable transition

	// Load initial emails when user changes
	$: if (get(user)?.id) {
		emailAccount.subscribe(() => {
			pageNumber = 1; // Reset page number for new account
			emails = []; // Clear existing emails
			loadNextPage();
		});
	}

	// Function to handle scroll and load next page
	const handleScroll = () => {
		if (!container || isLoading) return; // Prevent duplicate calls while loading
		const { scrollTop, scrollHeight, clientHeight } = container;
		if (scrollTop + clientHeight >= scrollHeight - 70) {
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
			newEmails = await getEmailList({
				user,
				limit,
				page,
				filter
			});
		} else {
			newEmails = await getEmailList({
				user,
				account: email,
				limit,
				page,
				filter
			});
		}

		// Append the new emails to the existing ones, avoiding duplicates
		emails = [
			...emails,
			...newEmails.filter((newEmail) => !emails.some((e) => e.id === newEmail.id))
		];
		isLoading = false;
	};

	// Function to load the next page of emails
	const loadNextPage = async () => {
		if (isLoading) return; // Prevent concurrent calls
		await loadEmails($emailAccount.email, get(user)?.id.toString(), limit, pageNumber, lastFilter);
		pageNumber++; // Increment after a successful fetch
	};

	// Handle email selection
	const handleEmailSelect = (event) => {
		selectedEmail = event.detail;
		dispatch('selectEmail', selectedEmail);

		// Disable transition before updating the email as read
		disableTransition = true;

		const updateEmailAsRead = async () => {
			const newEmail = await markEmailAsRead({
				user: get(user)?.id.toString(),
				email_id: selectedEmail?.email_id
			});
			const index = emails.findIndex((item) => item.id === selectedEmail.id);
			if (index !== -1 && newEmail) {
				// Update the object directly
				emails[index] = newEmail; // Ensure reactivity by creating a new object
			}
		};
		if (selectedEmail?.labels.includes('UNREAD')) updateEmailAsRead();

		// After the update, reset the transition state
		disableTransition = false;
	};

	// Handle toggle change and load emails based on selected option
	const handleToggleChange = async (index: number) => {
		selectedToggleOption = index;
		pageNumber = 1; // Reset page number for new filter
		isToggleLoading = true; // Set loading state to true when toggling
		emails = []; // Clear the email list to reload for the new filter
		if (selectedToggleOption !== 0) {
			lastFilter.push(toggleOptions[selectedToggleOption].toUpperCase());
		} else {
			lastFilter.pop();
		}

		await loadEmails($emailAccount.email, get(user)?.id.toString(), limit, pageNumber, lastFilter);
		isToggleLoading = false; // Set loading state to false after emails are loaded
	};
</script>

<div class="w-80 rounded-lg bg-primary-container">
	<div
		class="flex h-[60px] items-center justify-between border-b border-primary-gray p-[10px] text-h4"
	>
		<div class="mx-[4px]">Emails</div>
		<ToggleOptions
			options={toggleOptions}
			activeIndex={selectedToggleOption}
			onChange={handleToggleChange}
		/>
	</div>

	<InboxSearchBar />
	<div
		class="no-scrollbar max-h-[630px] overflow-y-scroll"
		bind:this={container}
		on:scroll={handleScroll}
	>
		{#if isToggleLoading}
			<!-- Loading indicator when toggle is changing -->
			<div class="w-[300px] py-4 text-center" transition:fade={{ duration: 500 }}>Loading...</div>
		{:else}
			{#key emails}
				{#each emails as email (email.id)}
					{#if !disableTransition}
						<div transition:fade={{ duration: 300 }}>
							<svelte:component
								this={EmailListItem}
								{email}
								on:handleEmailSelect={handleEmailSelect}
								selected={selectedEmail ? selectedEmail.id === email.id : false}
							/>
						</div>
					{:else}
						<svelte:component
							this={EmailListItem}
							{email}
							on:handleEmailSelect={handleEmailSelect}
							selected={selectedEmail ? selectedEmail.id === email.id : false}
						/>
					{/if}
				{/each}
			{/key}
		{/if}
	</div>
</div>
