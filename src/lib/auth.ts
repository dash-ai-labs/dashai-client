import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { user } from '$lib/store';
import type { EmailAccount } from './types';

export async function initiateGoogleLogin() {
	const response = await fetch(`${PUBLIC_API_URL}/auth/google/url`, { credentials: 'include' });
	const { url } = await response.json();
	window.location.href = url;
}

export const getUserProfile = async (user_id: string) => {
	const response = await fetch(`${PUBLIC_API_URL}/user/${user_id}/profile`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.json();
};

export const handleCallback = async (code: string, state: string) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/auth/google/callback`, {
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
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email_accounts`, {
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
	await fetch(`${PUBLIC_API_URL}/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});
}
