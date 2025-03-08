<script lang="ts">
	import { run } from 'svelte/legacy';

	import { addEmailAccount, getEmailAccounts } from '$lib/api/auth';
	import { user, emailAccount } from '$lib/store';
	import { get } from 'svelte/store';
	import type { EmailAccount } from '$lib/types';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let emailAccounts: EmailAccount[] = [];
	type Option = {
		label: string;
		icon: string | null;
	};
	let options: Option[] = $state([{ label: 'All Emails', icon: null }]);
	let selectedOption: Option = $state(options[0]);
	let currentUser = $state(get(user));

	// Update currentUser when user store changes
	user.subscribe((value) => {
		currentUser = value;
	});

	async function loadEmailAccounts() {
		if (currentUser?.id) {
			emailAccounts = await getEmailAccounts({ user: currentUser.id.toString() });
			options = [{ label: 'All Emails', icon: null }];

			options = [
				...options,
				...emailAccounts.map((account) => ({
					icon: account.profile_pic,
					label: account.email
				}))
			];
		}
	}

	const onSelectOption = (option: Option) => {
		if (option !== selectedOption) {
			selectedOption = option;
			emailAccount.set({ email: option.label });
		}
	};

	const addAccount = async () => {
		if (currentUser?.id) {
			await addEmailAccount(currentUser.id.toString());
		}
	};

	run(() => {
		if (currentUser?.id) {
			loadEmailAccounts();
			emailAccount.set({ email: selectedOption.label });
		}
	});
</script>

<div class="flex w-[200px] justify-end">
	<Button>{$emailAccount?.email || 'All Emails'}<ChevronDownOutline class="ms-2 h-6 w-6" /></Button>
	<Dropdown color="#00000" class="rounded-lg bg-primary-container">
		{#each options as option}
			<DropdownItem
				class="flex flex-row justify-center {option === selectedOption
					? 'bg-secondary-active-button-background'
					: ''} hover:bg-secondary-active-button-background"
				on:click={() => onSelectOption(option)}
			>
				{#if option.icon}
					<img src={option.icon} alt={option.label} class="h-6 w-6 rounded-full" />
				{/if}
				<p class="ml-2 self-center">{option.label}</p>
			</DropdownItem>
		{/each}
		{#snippet footer()}
			<DropdownItem
				onclick={addAccount}
				class="rounded-lg bg-primary-container hover:bg-secondary-active-button-background"
				>+ Add Email</DropdownItem
			>
		{/snippet}
	</Dropdown>
</div>
