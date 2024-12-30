import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			options: {
				headers: {
					'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
					'Content-Security-Policy':
						"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
					'X-Frame-Options': 'DENY',
					'X-Content-Type-Options': 'nosniff',
					Pragma: 'no-cache',
					Expires: '0'
				}
			}
		})
	}
};

export default config;
