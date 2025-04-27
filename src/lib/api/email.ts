import type { EmailLabelAction, Email, EmailData, EmailFolder } from '$lib/types';
import { apiRequest } from './base';

interface EmailListResponse {
	emails: Email[];
	end: boolean;
}

export const getEmailList = async ({
	user,
	account,
	limit,
	page,
	filter,
	folder
}: {
	user: string;
	account: string | undefined;
	limit: number;
	page: number;
	filter?: { key: string; value: string }[];
	folder: EmailFolder;
}): Promise<EmailListResponse> => {
	const limitString = limit.toString();
	const pageString = page.toString();
	try {
		const params = new URLSearchParams({ limit: limitString, page: pageString, folder });
		if (filter && filter.length > 0) {
			filter.forEach((item) => {
				params.append(`filter[${item.key}]`, item.value);
			});
		}
		if (!!account) params.append('account', account);

		const url = `user/${user}/emails?${params.toString()}`;
		const response = await apiRequest(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
		return { emails: [], end: false };
	}
};

export const markEmailAsRead = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email/${email_id}/read`, {
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

export const getEmailContent = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email/${email_id}/content`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.text();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
		return [];
	}
};

export const getEmail = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email?id=${email_id}`, {
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
export const archive = async ({ user, email_id }: { user: string; email_id: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email/${email_id}/archive`, {
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
		const response = await apiRequest(`user/${user}/email/${email_id}/unread`, {
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
		const response = await apiRequest(`user/${user}/email/${email_id}/delete`, {
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
		const response = await apiRequest(`user/${user}/email`, {
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

export const searchEmailsStreaming = async ({ user, search }: { user: string; search: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email/chat?query=${search}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.body?.getReader();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
	}
};

export const searchEmails = async ({ user, search }: { user: string; search: string }) => {
	try {
		const response = await apiRequest(`user/${user}/email/search?query=${search}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
	}
};

export const emailLabelAction = async ({
	user,
	email_id,
	label_id,
	action
}: {
	user: string;
	email_id: string;
	label_id: string;
	action: EmailLabelAction;
}) => {
	try {
		const response = await apiRequest(
			`user/${user}/email/${email_id}/label/${label_id}/${action}`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
		return [];
	}
};

export const getEmailFolderCount = async ({
	user,
	folder
}: {
	user: string;
	folder: EmailFolder;
}) => {
	try {
		const response = await apiRequest(`user/${user}/emails/${folder}/count`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
		return 0;
	}
};
