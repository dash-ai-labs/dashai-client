export function load({ locals }) {
	console.log('Server nonce:', locals.nonce);
	return {
		nonce: locals.nonce
	};
}
