<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import { getEmailAccounts, type EmailAccount } from '$lib/auth';
	import { user, emailAccount } from '$lib/store';
	import { get } from 'svelte/store';
	import AccountDropdownButton from './AccountDropdownButton.svelte';

	let emailAccounts: EmailAccount[] = [];
	let selectedOption: number = 0;
	let options: any[] = [{ label: 'All Emails' }];
	$: if (get(user)?.id) {
		loadEmailAccounts();
	}
	async function loadEmailAccounts() {
		const currentUser = get(user); // Access current user value
		if (currentUser?.id) {
			emailAccounts = await getEmailAccounts({ user: currentUser.id.toString() });
			options.push(
				...emailAccounts.map((account) => ({
					component: AccountDropdownButton,
					icon: account.profile_pic,
					label: account.email
				}))
			);
		}
	}

	const addAccount = {
		label: '+ Add Email',
		icon: null,
		fn: () => {
			console.log('add account');
		}
	};
</script>

<Dropdown
	{options}
	bind:selectedOption
	onSelectOption={(option: number) => emailAccount.set(options[option].label)}
	{addAccount}
/>
