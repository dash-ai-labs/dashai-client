import { PUBLIC_API_URL, PUBLIC_STAGE } from '$env/static/public';
import { nonce } from '$lib/store';
import { get } from 'svelte/store';

export async function apiRequest(
	url: string,
	options: RequestInit = {},
	event?: { locals: { nonce: string } }
): Promise<Response> {
	// Wait for nonce to be available
	let currentNonce = get(nonce);

	while (!currentNonce && PUBLIC_STAGE === 'prod') {
		await new Promise((resolve) => setTimeout(resolve, 100));
		currentNonce = get(nonce);
	}

	const defaultHeaders = {
		'Content-Type': 'application/json',
		'X-Content-Security-Policy-Nonce': currentNonce
	};

	const finalOptions = {
		...options,
		headers: {
			...defaultHeaders,
			...(options.headers || {})
		}
	};

	return fetch(`${PUBLIC_API_URL}/${url}`, finalOptions);
}
