import { PUBLIC_API_URL } from '$env/static/public';

export interface Email {
	id: string;
	subject: string;
	snippet: string;
	sender: string[];
	sender_name: string[];
	thread_id: string;
	to: string[];
	raw_content: string;
	created_at: Date;
	content: string;
	summary: string;
	email_id: string;
	labels: string[];
	date: Date;
	processed: boolean;
}

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
