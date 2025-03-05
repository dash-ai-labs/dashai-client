import { apiRequest } from './base';

export const getSuggestion = async ({
	user,
	email_id,
	subject,
	body
}: {
	user: string;
	email_id: string;
	subject: string;
	body: string;
}) => {
	try {
		const params = new URLSearchParams({ email_id, subject, body });

		const response = await apiRequest(`user/${user}/suggestion?${params.toString()}`, {
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
