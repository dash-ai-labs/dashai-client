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

	import { type Email, type EmailAccount } from '$lib/types';
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

	const { selectEmail } = $props();
	let _emailList = $state<Email[]>(get(emailList));
	let container = $state<HTMLElement | null>(null);
	let _emailAccount = $state<EmailAccount | undefined>(get(emailAccount));
	let pageNumber = $state(1);
	let limit = $state(30);
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
		if (newEmails && newEmails.length > 0) {
			if (_emailList.length === 0) {
				emailList.set(newEmails);
			} else {
				emailList.update((emails) => [
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
			const index = _emailList.findIndex((item) => item.email_id === selectedEmail?.email_id);
			if (index !== -1 && newEmail) {
				// Update the object directly
				_emailList = [..._emailList.slice(0, index), newEmail, ..._emailList.slice(index + 1)];
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
</script>

<div class="w-86 rounded-lg bg-primary-container">
	<div
		class="flex h-[60px] items-center justify-between border-b border-primary-gray p-[10px] text-h4"
	>
		<div class="mx-[2px]">Emails</div>
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

	<div
		class="no-scrollbar max-h-[calc(100vh-300px)] overflow-y-scroll"
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
		{/if}
	</div>
</div>
