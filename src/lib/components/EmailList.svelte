<script lang="ts">
	import { fade } from 'svelte/transition';
	import { emailAccount, user } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, type Email } from '$lib/email';
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
	let lastFilter = '';

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
		if (scrollTop + clientHeight >= scrollHeight - 50) {
			// Trigger slightly before the end
			loadNextPage();
		}
	};

	// Function to load emails based on the selected toggle option and filter
	const loadEmails = async (email: string, user: string, limit: number = 30, page: number = 1) => {
		const filter = ['INBOX'];
		if (selectedToggleOption !== 0) {
			filter.push(toggleOptions[selectedToggleOption].toUpperCase());
		}

		// Only load emails if the filter has changed
		if (lastFilter !== filter.join(',')) {
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
			emails = [...newEmails.filter((newEmail) => !emails.some((e) => e.id === newEmail.id))];
			isLoading = false;
			lastFilter = filter.join(',');
		}
	};

	// Function to load the next page of emails
	const loadNextPage = async () => {
		if (isLoading) return; // Prevent concurrent calls
		await loadEmails($emailAccount.email, get(user)?.id.toString(), limit, pageNumber);
		pageNumber++; // Increment after a successful fetch
	};

	// Handle email selection
	const handleEmailSelect = (event) => {
		selectedEmail = event.detail;
		dispatch('selectEmail', selectedEmail);
	};

	// Handle toggle change and load emails based on selected option
	const handleToggleChange = async (index: number) => {
		selectedToggleOption = index;
		pageNumber = 1; // Reset page number for new filter
		isToggleLoading = true; // Set loading state to true when toggling
		emails = []; // Clear the email list to reload for the new filter
		await loadEmails($emailAccount.email, get(user)?.id.toString(), limit, pageNumber);
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
		class="no-scrollbar h-[760px] max-h-[760px] overflow-y-scroll"
		bind:this={container}
		on:scroll={handleScroll}
	>
		{#if isToggleLoading}
			<!-- Loading indicator when toggle is changing -->
			<div class="py-4 text-center" transition:fade={{ duration: 300 }}>Loading...</div>
		{:else}
			{#key emails}
				<div transition:fade={{ duration: 300 }}>
					{#each emails as email (email.id)}
						<svelte:component
							this={EmailListItem}
							{email}
							on:handleEmailSelect={handleEmailSelect}
							selected={selectedEmail ? selectedEmail.id === email.id : false}
						/>
					{/each}
				</div>
			{/key}
		{/if}
	</div>
</div>
