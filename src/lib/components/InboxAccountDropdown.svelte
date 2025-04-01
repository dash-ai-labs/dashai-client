<script lang="ts">
	import { addEmailAccount, getEmailAccounts } from '$lib/api/auth';
	import { user, emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import type { EmailAccount } from '$lib/types';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { refreshEmailList } from '$lib/actions';
	import { onMount } from 'svelte';

	let emailAccounts: EmailAccount[] = [];
	type Option = {
		label: string;
		icon: string | null;
	};
	let options: Option[] = $state([{ label: 'All Emails', icon: null }]);
	let selectedOption: Option = $state(options[0]);
	let currentUser = $state(get(user));
	let emailAccount = $state(get(emailServiceState).emailAccount);
	// Update currentUser when user store changes
	user.subscribe((value) => {
		currentUser = value;
	});
	emailServiceState.subscribe((value) => {
		emailAccount = value.emailAccount;
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
			emailServiceState.update((state) => ({ ...state, emailAccount: { email: option.label } }));
			refreshEmailList();
		}
	};

	const addAccount = async () => {
		if (currentUser?.id) {
			await addEmailAccount(currentUser.id.toString());
		}
	};

	onMount(() => {
		if (currentUser?.id) {
			loadEmailAccounts();
			emailServiceState.update((state) => ({
				...state,
				emailAccount: { email: selectedOption.label }
			}));
		}
	});
</script>

<div class="dropdown-container">
	<Button>
		{emailAccount?.email || 'All Emails'}
		<ChevronDownOutline class="chevron-icon" />
	</Button>
	<Dropdown class="dropdown-menu">
		{#each options as option}
			<DropdownItem
				class="dropdown-item {option === selectedOption ? 'selected' : ''}"
				on:click={() => onSelectOption(option)}
			>
				{#if option.icon}
					<img src={option.icon} alt={option.label} class="account-icon" />
				{/if}
				<p class="option-label">{option.label}</p>
			</DropdownItem>
		{/each}
		<!-- {#snippet footer()} -->
		<DropdownItem class="dropdown-item" on:click={addAccount}>+ Add Email</DropdownItem>
		<!-- {/snippet} -->
	</Dropdown>
</div>

<style>
	.dropdown-container {
		display: flex;
		justify-content: flex-end;
		padding-inline: 10px;
		width: 100%;
	}

	.account-icon {
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 9999px;
	}

	.option-label {
		margin-left: 0.5rem;
		align-self: center;
	}
</style>
