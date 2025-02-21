<script lang="ts">
	import Power from '$lib/assets/Power.svelte';
	import { logout } from '$lib/api/auth';
	import { emailAccount, user } from '$lib/store';
	import { goto } from '$app/navigation';

	const clearStoresAndLogout = () => {
		const _logout = async () => {
			localStorage.removeItem('authToken');

			await emailAccount.set(null);
			await user.set(null);
			await logout();
			goto('/auth');
		};

		_logout();
	};
</script>

<div class="mx-auto flex justify-center">
	<button
		class="flex flex-row justify-center gap-2 rounded p-2 text-center text-primary-gray hover:bg-primary-dark-gray"
		onclick={clearStoresAndLogout}><Power fill="text-primary-gray" />Logout</button
	>
</div>
