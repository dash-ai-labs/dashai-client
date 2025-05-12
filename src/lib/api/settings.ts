import type { UpdateEmailSettings } from '$lib/types';
import { apiRequest } from './base';

const getEmailSettings = async (user: string, account: string) => {
	const response = await apiRequest(`user/${user}/email_account/${account}/settings`, {
		method: 'GET',
		credentials: 'include'
	});
	return response.json();
};

const updateEmailSettings = async (
	user: string,
	account: string,
	updateEmailSettings: UpdateEmailSettings
) => {
	const response = await apiRequest(`user/${user}/email_account/${account}/settings`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(updateEmailSettings)
	});
	return response.json();
};

export { getEmailSettings, updateEmailSettings };
