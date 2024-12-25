<script lang="ts">
	import X from '$lib/assets/X.svelte';
	import { user } from '$lib/store';
	import type { Email, EmailAccount } from '$lib/types';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import {
		ChevronDownOutline,
		ForwardOutline,
		ReplyOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import type { Component } from 'svelte';

	type ResponseAction = {
		icon: Component;
		text: string;
	};
	const {
		email,
		setToEmails,
		setBccEmails,
		setCcEmails,
		setSubject,
		setFromEmail
	}: {
		email: Email;
		setToEmails: (emails: string[]) => void;
		setBccEmails: (emails: string[]) => void;
		setCcEmails: (emails: string[]) => void;
		setSubject: (subject: string) => void;
		setFromEmail: (email: string) => void;
	} = $props();

	let fromEmailAccounts: EmailAccount[] | undefined = $user?.email_accounts;
	let selectedFromEmailAccount: EmailAccount | undefined = $state($user?.email_accounts?.[0]);
	let toEmails: string[] = $state([]);
	$effect(() => {
		toEmails = [email.sender[0]];
	});

	let toEmailsInput: string = $state('');
	let toEmailsError: boolean = $state(false);
	let selectedAction: ResponseAction = $state({
		icon: ReplyOutline,
		text: 'Reply'
	});

	$effect(() => {
		setToEmails(toEmails);
		setFromEmail(selectedFromEmailAccount?.email ?? '');
	});

	const responseOptions: ResponseAction[] = [
		{
			icon: ReplyOutline,
			text: 'Reply'
		},
		{
			icon: ForwardOutline,
			text: 'Forward'
		}
	];

	function onSelectResponseOption(action: ResponseAction) {
		selectedAction = { ...action };
		if (action.text === 'Reply') {
			setToEmails(toEmails);
		}
	}

	const onSelectFromEmailAccount = (account: EmailAccount) => {
		setFromEmail(account.email);
		selectedFromEmailAccount = account;
	};

	const removeEmail = (email: string) => {
		toEmails = toEmails.filter((k) => k !== email);
		setToEmails(toEmails);
	};

	const handleEnterKey = (e) => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (emailRegex.test(toEmailsInput)) {
				toEmails = [...toEmails, toEmailsInput];
				toEmailsInput = '';
				toEmailsError = false;
				setToEmails(toEmails);
			} else {
				toEmailsError = true;
			}
		}
	};
</script>

<div class="mx-1 my-1 flex w-full flex-row">
	<!-- Response -->
	<Button class="h-[30px] px-[2px] py-[1px] hover:bg-secondary-active-button-background">
		<selectedAction.icon class="h-[18px] w-[18px] " size="md" />
		<ChevronDownOutline class="h-6 w-5 " />
	</Button>
	<Dropdown
		class="z-50 w-full rounded-lg border border-primary-gray bg-primary-container shadow-sm "
	>
		{#each responseOptions as action}
			<DropdownItem
				onclick={() => onSelectResponseOption(action)}
				class="w-full justify-center overflow-hidden px-2 hover:cursor-pointer hover:bg-secondary-active-button-background"
			>
				<div class="flex w-full flex-row">
					<!-- svelte-ignore svelte_component_deprecated -->
					<action.icon class="h-6 w-6" />
					{action.text}
				</div>
			</DropdownItem>
		{/each}
	</Dropdown>
	<div class="flex w-full flex-col items-center">
		<!-- From -->
		{#if fromEmailAccounts && selectedFromEmailAccount}
			<div class="w-full">
				From:
				<Button class="px-[2px] py-[1px] hover:bg-secondary-active-button-background">
					<p class="pl-1">{selectedFromEmailAccount?.email}</p>
					<ChevronDownOutline class="ms-[2px] h-6 w-6 " />
				</Button>
				<Dropdown
					class="z-50 w-full rounded-lg border border-primary-gray bg-primary-container shadow-sm"
				>
					{#each fromEmailAccounts as account}
						<DropdownItem
							class="w-full justify-center overflow-hidden px-2 hover:cursor-pointer hover:bg-secondary-active-button-background"
							onclick={() => onSelectFromEmailAccount(account)}
						>
							<div class="flex w-full flex-row items-center">
								<span>{account.email}</span>
							</div>
						</DropdownItem>
					{/each}
				</Dropdown>
			</div>
		{/if}
		<!-- To -->
		{#if email.sender}
			<div class="flex w-full flex-row items-center">
				<span class="mr-2 flex items-center">To:</span>
				{#if toEmails.length > 0}
					<div class="flex w-full flex-wrap items-center gap-[8px]">
						{#each toEmails as toEmail}
							<div
								class="flex w-fit flex-row items-center rounded-lg bg-primary-button px-[8px] py-[1px] text-primary-container hover:bg-primary-button"
							>
								{toEmail}
								<button
									class="ml-[2px] items-center justify-center"
									onclick={() => removeEmail(toEmail)}
									><X stroke="stroke-primary-container" size={17} /></button
								>
							</div>
						{/each}
					</div>
				{/if}
				<input
					bind:value={toEmailsInput}
					type="text"
					class="w-full rounded-lg border-0 bg-primary-container focus:outline-none focus:ring-0"
					onkeydown={handleEnterKey}
				/>
			</div>
			{#if toEmailsError}
				<div class="flex w-full flex-row items-center justify-start gap-[2px] text-primary-red">
					<ExclamationCircleOutline /> Invalid email
				</div>
			{/if}
		{/if}
	</div>
</div>
