import { goto } from '$app/navigation';
import { user } from '$lib/store';
import { apiRequest } from './base';
import type { EmailAccount } from './types';

export async function initiateGoogleLogin() {
	const response = await apiRequest(`auth/google/url`, { credentials: 'include' });
	const { url } = await response.json();
	window.location.href = url;
}

export async function initiateOutlookLogin() {
	const response = await apiRequest(`auth/outlook/url`, { credentials: 'include' });
	const { url } = await response.json();
	window.location.href = url;
}

export const getUserProfile = async (user_id: string) => {
	const response = await apiRequest(`user/${user_id}/profile`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.json();
};

export const handleGoogleCallback = async (code: string, state: string) => {
	try {
		const response = await apiRequest(`auth/google/callback`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code, state })
		});
		user.set(await response.json());
		if (response.json().waitlisted) {
			goto('/waitlist');
		} else {
			goto('/inbox/actionable');
		}
	} catch (error) {
		console.error('Authentication error:', error);
	}
};

export const handleOutlookCallback = async (
	code: string,
	state: string | undefined = undefined
) => {
	try {
		const response = await apiRequest(`auth/outlook/callback`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code, state })
		});
		user.set(await response.json());
		if (response.json().waitlisted) {
			goto('/waitlist');
		} else {
			goto('/inbox/actionable');
		}
	} catch (error) {
		console.error('Authentication error:', error);
	}
};

export const getEmailAccounts = async ({ user }: { user: string }): Promise<EmailAccount[]> => {
	try {
		const response = await apiRequest(`user/${user}/email_accounts`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
		return [];
	}
};

export async function logout(): Promise<void> {
	await apiRequest(`auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});
}

export const addGoogleAccount = async (user: string) => {
	try {
		const response = await apiRequest(`user/${user}/email_accounts/register_google`, {
			method: 'POST',
			credentials: 'include'
		});
		const { url } = await response.json();
		window.location.href = url;
	} catch (error) {
		console.error('Error adding email account:', error);
		return [];
	}
};

export const addOutlookAccount = async (user: string) => {
	try {
		const response = await apiRequest(`user/${user}/email_accounts/register_outlook`, {
			method: 'POST',
			credentials: 'include'
		});
		const { url } = await response.json();
		window.location.href = url;
	} catch (error) {
		console.error('Error adding email account:', error);
		return [];
	}
};

export const deleteUser = async (user_id: string) => {
	const response = await apiRequest(`user/${user_id}`, {
		method: 'DELETE',
		credentials: 'include'
	});
	return response.json();
};

export const updateUser = async (user_id: string, show_tutorial: boolean) => {
	const response = await apiRequest(`user/${user_id}`, {
		method: 'PUT',
		credentials: 'include',
		body: JSON.stringify({ show_tutorial: show_tutorial })
	});
	return response.json();
};
