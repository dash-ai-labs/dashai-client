import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { user } from '$lib/store';

export interface EmailAccount {
	email: string;
	profile_pic: string;
}
export async function initiateGoogleLogin() {
	const response = await fetch(`${PUBLIC_API_URL}/auth/google/url`, { credentials: 'include' });
	const { url } = await response.json();
	window.location.href = url;
}

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

export const getUser = async (): Promise<any> => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/profile/`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
};

export async function logout(): Promise<void> {
	await fetch(`${PUBLIC_API_URL}/api/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});
}
