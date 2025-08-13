import { apiRequest } from './base';

export const createCheckoutSession = async () => {
	try {
		const response = await apiRequest(`stripe/create_checkout_session`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return [];
	}
};
