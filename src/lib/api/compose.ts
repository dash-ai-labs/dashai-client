import { apiRequest } from './base';
export const writeEmailSuggestion = async ({
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
		const response = await apiRequest(`user/${user}/suggestion`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email_id: email_id,
				subject: subject,
				body: body
			})
		});
		return response.body?.getReader();
	} catch (error) {
		console.error('Error fetching email accounts:', error);
	}
};
