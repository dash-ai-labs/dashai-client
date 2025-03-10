<script lang="ts">
	import { goto } from '$app/navigation';
	import Power from '$lib/assets/Power.svelte';
	import { user, emailAccount, emailList, emailLabels, emailSearchList } from '$lib/store';

	const handleLogout = async () => {
		// First, clear or reset all stores with proper initial values
		// Using empty arrays instead of null where expected
		emailList.set([]);
		emailLabels.set([]);
		emailSearchList.set([]);
		emailAccount.set({ email: 'All Emails' });

		// Wait a small amount to allow store updates to propagate
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Clear localStorage to prevent stale data
		if (typeof window !== 'undefined') {
			localStorage.clear();
		}

		// Finally set user to null (this might trigger components to reset)
		user.set(null);

		// Small delay before navigation to ensure store changes have propagated
		setTimeout(() => {
			goto('/auth');
		}, 10);
	};
</script>

<div class="mx-auto flex justify-center">
	<button
		class="flex flex-row justify-center gap-2 rounded p-2 text-center text-primary-gray hover:bg-primary-dark-gray"
		on:click={handleLogout}><Power fill="text-primary-gray" />Logout</button
	>
</div>
