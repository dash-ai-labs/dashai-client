<script lang="ts">
	import { fade } from 'svelte/transition';
	import { user, emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { getEmailList, markEmailAsRead, searchEmails } from '$lib/api/email';
	import EmailListItem from './EmailListItem.svelte';
	import { EmailCategory, EmailFolder, type Email, type EmailAccount } from '$lib/types';
	import { onMount } from 'svelte';
	import { clearEmails } from '$lib/actions/email';

	let {
		selectEmail,
		folder = EmailFolder.INBOX,
		category,
		limit = 50
	}: {
		selectEmail: (email: Email) => void;
		folder?: EmailFolder;
		category?: EmailCategory[];
		limit?: number;
	} = $props();
	let container = $state<HTMLElement | null>(null);
	let _emailAccount = $state<EmailAccount | undefined>(get(emailServiceState).emailAccount);
	let pageNumber = $state(1);
	let listEnd = $state(false);
	let selectedEmail = $state<Email | undefined>(undefined);
	let isLoading = $state(false); // Track if data is being fetched
	let isToggleLoading = $state(false); // Loading state for toggle change
	let lastFilter = $state([]);
	let disableTransition = $state(false); // New state variable to disable transition
	let user_id = $derived(get(user)?.id?.toString());
	let lastFolder = $state<EmailFolder>(folder);
	// Removed scroll-based pagination variables
	let hasNextPage = $state(true); // Track if there are more pages
	let hasPrevPage = $state(false); // Track if there are previous pages

	const getEmailStateList = () => {
		if (category?.includes(EmailCategory.URGENT)) {
			return get(emailServiceState).urgentEmailList;
		} else if (category?.includes(EmailCategory.INFORMATION)) {
			return get(emailServiceState).informationalEmailList;
		} else {
			return get(emailServiceState).emailList;
		}
	};
	let _emailList = $state<Email[]>(getEmailStateList());

	const updateEmailList = async (emails: Email[]) => {
		if (category?.includes(EmailCategory.URGENT)) {
			emailServiceState.update((state) => ({
				...state,
				urgentEmailList: emails
			}));
		} else if (category?.includes(EmailCategory.INFORMATION)) {
			emailServiceState.update((state) => ({
				...state,
				informationalEmailList: emails
			}));
		} else {
			emailServiceState.update((state) => ({
				...state,
				emailList: emails
			}));
		}
	};

	$effect(() => {
		const state = get(emailServiceState);
		if (state.emailSearchQueryList && state.emailSearchQueryList.length > 0) {
			const _searchEmails = async () => {
				const emailResults = await searchEmails({
					user: user_id || '',
					search: state.emailSearchQueryList[0].query
				});
				await updateEmailList(emailResults);
			};
			_searchEmails();
		}
	});

	onMount(() => {
		clearEmails();
		loadNextPage();
	});

	// Remove scroll-based pagination - now using button controls
	const handleScroll = () => {
		// No automatic loading on scroll anymore
	};

	$effect(() => {
		if (lastFolder !== folder) {
			lastFolder = folder;
			clearEmails();
			pageNumber = 1; // Reset to first page
			hasNextPage = true;
			hasPrevPage = false;
			loadNextPage();
		}
	});

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
				account: undefined,
				limit,
				page,
				filter,
				folder,
				category
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
				folder,
				category
			});
			newEmails = emails;
			listEnd = end;
		}
		// Replace the email list with new emails for pagination
		if (newEmails) {
			await updateEmailList(newEmails);

			// Update pagination state
			hasNextPage = !listEnd && newEmails.length === limit;
			hasPrevPage = pageNumber > 1;
		}
		isLoading = false;
	};

	emailServiceState.subscribe(async (state) => {
		if (state.emailList || state.urgentEmailList || state.informationalEmailList) {
			_emailList = getEmailStateList();
		}
	});

	// Function to load a specific page of emails
	const loadPage = async (targetPage: number) => {
		if (isLoading || targetPage < 1) return; // Prevent concurrent calls and invalid pages
		pageNumber = targetPage;
		await loadEmails(
			_emailAccount?.email || 'All Emails',
			user_id || '',
			limit,
			pageNumber,
			lastFilter
		);
	};

	// Function to load the next page of emails (for initial load)
	const loadNextPage = async () => {
		await loadPage(1); // Start with page 1
	};

	// Navigation functions for pagination controls
	const goToNextPage = async () => {
		if (hasNextPage && !isLoading) {
			await loadPage(pageNumber + 1);
		}
	};

	const goToPrevPage = async () => {
		if (hasPrevPage && !isLoading) {
			await loadPage(pageNumber - 1);
		}
	};

	// Pagination functions are available for button handlers

	// Handle email selection
	const handleEmailSelect = (event: CustomEvent) => {
		selectedEmail = event.detail;
		if (selectedEmail) {
			selectEmail(selectedEmail);
		}

		// Disable transition before updating the email as read
		disableTransition = true;

		const updateEmailAsRead = async () => {
			const newEmail = await markEmailAsRead({
				user: user_id || '',
				email_id: selectedEmail?.email_id || ''
			});
			const index = _emailList.findIndex(
				(item: Email) => item.email_id === selectedEmail?.email_id
			);
			if (index !== -1 && newEmail) {
				// Update the object directly

				_emailList = _emailList.map((email: Email) =>
					email.email_id === selectedEmail?.email_id ? newEmail : email
				);

				await updateEmailList(_emailList);
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

<div class="mini-email-container">
	<div class="email-list-container" bind:this={container} onscroll={handleScroll}>
		<div class="email-list-container-header">
			<h3>{category?.join(' / ').toLocaleUpperCase()}</h3>
		</div>
		{#if isToggleLoading}
			<!-- Loading indicator when toggle is changing -->
			<div class="loading-indicator" transition:fade={{ duration: 500 }}>Loading...</div>
		{:else}
			{#each _emailList as email (email.id)}
				{#if !category || (category && category.some((c) => email.categories?.includes(c)))}
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
				{/if}
			{/each}
		{/if}
	</div>

	<!-- Pagination Controls -->
	<div class="mini-list-pagination-controls">
		<button
			class="pagination-btn"
			disabled={!hasPrevPage || isLoading}
			onclick={goToPrevPage}
			aria-label="Previous page"
		>
			&lt;
		</button>
		<span class="page-info">
			Page {pageNumber}
		</span>
		<button
			class="pagination-btn"
			disabled={!hasNextPage || isLoading}
			onclick={goToNextPage}
			aria-label="Next page"
		>
			&gt;
		</button>
	</div>
</div>

<style>
	.mini-email-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
		overflow: hidden;
		border: 1px solid var(--color-primary-dark-gray);
		background-color: var(--color-primary-container);
		border-radius: 10px;
	}

	.email-list-container-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px;
	}

	.email-list-container {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		width: 100%;
		padding: 0 8px;
		min-height: 0; /* Important for flex child to shrink */
	}

	.loading-indicator {
		width: 300px;
		padding-top: 1rem;
		padding-bottom: 1rem;
		text-align: center;
	}

	.mini-list-pagination-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 5px;
		background-color: var(--color-primary-container);
		flex-shrink: 0; /* Don't allow pagination controls to shrink */
		min-height: 60px; /* Fixed height for pagination */
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 8px;
		border: 1px solid var(--color-primary-gray);
		background-color: var(--color-primary-container);
		color: var(--color-primary-light-gray);
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pagination-btn:hover:not(:disabled) {
		background-color: var(--color-primary-dark-gray);
		border-color: var(--color-primary-light-gray);
	}

	.pagination-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info {
		font-size: 0.875rem;
		color: var(--color-primary-light-gray);
		font-weight: 500;
		min-width: 80px;
		text-align: center;
	}
</style>
