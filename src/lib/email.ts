import { PUBLIC_API_URL } from '$env/static/public';
import type { Email, EmailData } from './types';

export const getEmailList = async ({
	user,
	account,
	limit,
	page,
	filter
}: {
	user: string;
	account: string | undefined;
	limit: number;
	page: number;
	filter?: string[];
}): Promise<Email[]> => {
	const limitString = limit.toString();
	const pageString = page.toString();
	try {
		const params = new URLSearchParams({ limit: limitString, page: pageString });
		if (filter) params.append('filter', filter.toString());
		if (!!account) params.append('account', account);

		const url = `${PUBLIC_API_URL}/user/${user}/emails?${params.toString()}`;
		const response = await fetch(url, {
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

export const markEmailAsRead = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email/${email_id}/read`, {
			method: 'POST',
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

export const archive = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email/${email_id}/archive`, {
			method: 'POST',
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

export const markAsUnread = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email/${email_id}/unread`, {
			method: 'POST',
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

export const remove = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email/${email_id}/delete`, {
			method: 'POST',
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

export const sendEmail = async ({ user, email }: { user: string; email: EmailData }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/email`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(email)
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
	}
};
