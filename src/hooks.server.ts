import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { randomBytes } from 'crypto';

const handleCSP: Handle = async ({ event, resolve }) => {
	// Skip CSP in development
	if (import.meta.env.DEV) {
		return await resolve(event);
	}

	// Generate a random nonce
	const nonce = randomBytes(16).toString('base64');

	// Store nonce in event.locals so it's available to your app
	event.locals.nonce = nonce;

	const response = await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			if (done) {
				// Add nonce to inline scripts and styles
				return html
					.replace(/<script>/g, `<script nonce="${nonce}">`)
					.replace(/<style>/g, `<style nonce="${nonce}">`);
			}
			return html;
		}
	});

	// Set security headers
	response.headers.set(
		'Content-Security-Policy',
		`default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline' https: data:; img-src 'self' data: https:; font-src 'self' https: data:; frame-src 'self' data:; child-src 'self' data:; connect-src 'self' https://api.getdash.ai; frame-ancestors 'none'; form-action 'self'`
	);
	response.headers.set('Access-Control-Allow-Origin', 'https://app.getdash.ai');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), interest-cohort=()'
	);
	response.headers.set('X-Content-Security-Policy-Nonce', nonce);

	// Don't set Cache-Control here as it should be handled per-route
	// or in your page endpoints for more granular control

	return response;
};

// If you have other hooks, use sequence to combine them
export const handle = sequence(handleCSP);
