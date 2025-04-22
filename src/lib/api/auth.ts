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
		goto('/inbox');
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
		goto('/inbox');
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

export const addEmailAccount = async (user: string) => {
	try {
		const response = await apiRequest(`user/${user}/email_accounts/register`, {
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
