import { handleOutlookCallback } from '$lib/api/auth';

export function processCallback() {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const sessionState = urlParams.get('state');
	if (code) {
		if (sessionState) {
			handleOutlookCallback(code, sessionState);
		} else {
			handleOutlookCallback(code);
		}
	}
}
