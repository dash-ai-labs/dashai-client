<script lang="ts">
	import { fade } from 'svelte/transition';
	import { emailAccount, emailList, emailSearchList, user } from '$lib/store';
	import { get } from 'svelte/store';
	import {
		archive,
		getEmailList,
		markAsUnread,
		markEmailAsRead,
		remove,
		searchEmails
	} from '$lib/api/email';
	import EmailListItem from '$lib/components/emailListContainer/EmailListItem.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { IconReload } from '@tabler/icons-svelte';

	import { ComposeEmailMode, type Email, type EmailAccount } from '$lib/types';
	import EmailListSearch from './EmailListSearch.svelte';

	export const markEmailAsUnread = (email: Email) => {
		const _markAsUnread = async () => {
			const res = await markAsUnread({ user: get(user)?.id.toString(), email_id: email.email_id });
			if (res) {
				_emailList = [..._emailList.map((e) => (e.email_id === email.email_id ? res : e))];
			}
		};
		_markAsUnread();
	};
	export const removeEmail = (email: Email) => {
		const _remove = async () => {
			const res = await remove({ user: get(user)?.id.toString(), email_id: email.email_id });
			if (res) {
				_emailList = [..._emailList.filter((e) => e.email_id !== email.email_id)];
			}
		};
		_remove();
	};
	export const archiveEmail = (email: Email) => {
		const _archive = async () => {
			const res = await archive({ user: get(user)?.id.toString(), email_id: email.email_id });
			if (res) {
				_emailList = [..._emailList.filter((e) => e.email_id !== email.email_id)];
			}
		};
		_archive();
	};

	const { selectEmail, setShowComposeEmail, setComposeEmailMode } = $props();
	let _emailList = $state<Email[]>(get(emailList));
	let container = $state<HTMLElement | null>(null);
	let _emailAccount = $state<EmailAccount | undefined>(get(emailAccount));
	let pageNumber = $state(1);
	let limit = $state(30);
	let listEnd = $state(false);
	let selectedEmail = $state<Email | undefined>(undefined);
	let isLoading = $state(false); // Track if data is being fetched
	let toggleOptions = $state(['All Mail', 'Unread']);
	let isToggleLoading = $state(false); // Loading state for toggle change
	let lastFilter = $state(['INBOX']);
	let disableTransition = $state(false); // New state variable to disable transition
	let previousAccountValue = $state<EmailAccount | undefined>(get(emailAccount));
	let selectedToggleOption: number = $state(0);

	emailSearchList.subscribe((searchList) => {
		if (searchList && searchList.length > 0) {
			const _searchEmails = async () => {
				const emailResults = await searchEmails({
					user: get(user)?.id.toString(),
					search: searchList[0].query
				});
				_emailList = emailResults;
			};
			_searchEmails();
		}
	});

	$effect(() => {
		const unsubscribe = emailAccount.subscribe((value) => {
			if (
				value &&
				previousAccountValue &&
				(!previousAccountValue.email || value.email !== previousAccountValue.email)
			) {
				pageNumber = 1; // Reset page number for new account
				_emailList = []; // Clear existing emails
				_emailAccount = value;
				loadNextPage();

				// Update the previous value to prevent repeated calls
				previousAccountValue = value;
			}
		});

		return () => unsubscribe();
	});

	const setEmailList = (emails: Email[]) => {
		_emailList = emails;
	};
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
				emailList.set(newEmails);
			} else {
				emailList.update((emails: Email[]) => [
					...emails,
					...newEmails.filter((newEmail) => !emails.some((e) => e.id === newEmail.id))
				]);
			}
		}
		isLoading = false;
	};

	emailList.subscribe((value) => {
		_emailList = value;
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
				emailList.set(_emailList);
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

	// Add a refresh function
	const refreshEmails = async () => {
		pageNumber = 1; // Reset page number
		_emailList = []; // Clear existing emails
		isLoading = true; // Set loading indicator
		emailList.set([]); // Clear the store too

		const userId = get(user)?.id;
		if (!userId) {
			isLoading = false;
			return;
		}

		await loadEmails(
			_emailAccount?.email || 'All Emails',
			userId.toString(),
			limit,
			pageNumber,
			lastFilter
		);

		pageNumber++; // Increment after a successful fetch
		isLoading = false;
	};
</script>

<div class="w-86 rounded-lg bg-primary-container">
	<div
		class="flex h-[60px] items-center justify-between border-b border-primary-gray p-[10px] text-h4"
	>
		<div class="mx-[2px] flex items-center">
			<div>Emails</div>
			<button
				class="ml-2 rounded-full p-1 hover:bg-primary-gray/20"
				onclick={refreshEmails}
				aria-label="Refresh emails"
			>
				<IconReload size="18" color="gray" />
			</button>
		</div>
		<RadioGroup
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
			border={'border-0'}
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
	<EmailListSearch
		setShowComposeEmail={() => {
			setShowComposeEmail(true);
			setComposeEmailMode(ComposeEmailMode.NewEmail);
		}}
		{setEmailList}
	/>
	<div
		class="no-scrollbar max-h-[calc(100vh-400px)] overflow-y-scroll"
		bind:this={container}
		onscroll={handleScroll}
	>
		{#if isToggleLoading}
			<!-- Loading indicator when toggle is changing -->
			<div class="w-[300px] py-4 text-center" transition:fade={{ duration: 500 }}>Loading...</div>
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
				<div
					class="w-full py-4 text-center font-light text-primary-gray"
					transition:fade={{ duration: 500 }}
				>
					No more emails.
				</div>
			{/if}
		{/if}
	</div>
</div>
