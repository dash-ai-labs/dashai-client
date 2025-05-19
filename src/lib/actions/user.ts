import { deleteUser, getUserProfile, updateUser } from '$lib/api/auth';
import { get } from 'svelte/store';
import {
	user,
	emailAccount,
	emailList,
	emailServiceState,
	emailLabels,
	emailSearchList
} from '$lib/store';
import { goto } from '$app/navigation';
import { type EmailServiceState } from '$lib/types';

const refreshUser = async () => {
	const _refreshUser = async () => {
		const response = await getUserProfile(get(user)?.id.toString());
		user.set(response);
	};
	_refreshUser();
};

const handleLogout = async () => {
	emailList.set([]);
	emailLabels.set([]);
	emailSearchList.set([]);
	emailAccount.set({ email: 'All Emails' });
	emailServiceState.set({} as EmailServiceState);
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

const deleteAccount = async () => {
	const userId = get(user)?.id.toString();
	const response = await deleteUser(userId);
	if (response) {
		handleLogout();
	}
};

const updateUserAction = async (show_tutorial: boolean = true) => {
	const userId = get(user)?.id.toString();
	const response = await updateUser(userId, show_tutorial);
	if (response) {
		refreshUser();
	}
};

export { refreshUser, handleLogout, deleteAccount, updateUserAction };
