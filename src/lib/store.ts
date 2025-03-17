import { writable, type Writable } from 'svelte/store';
import type { SearchEntry, User, Email } from './types';
import { goto } from '$app/navigation';

// Define the type for the user store with optional initial value
function persistentWritable(key: string, initialValue: any): Writable<any> {
	// Create a writable store with the initial value
	const store = writable(initialValue, (set) => {
		if (typeof window !== 'undefined') {
			// Only run this code in the browser
			const storedValue = localStorage.getItem(key);
			if (storedValue && storedValue !== 'undefined') {
				try {
					set(JSON.parse(storedValue)); // Set the store to the value from localStorage
				} catch (e) {
					console.error(`Failed to parse stored value for ${key}:`, e);
					// Fall back to initial value
				}
			}
		}

		return () => {
			// Cleanup logic (optional, for example, remove listeners)
		};
	});

	// Subscribe to changes and update localStorage (in the browser)
	if (typeof window !== 'undefined') {
		store.subscribe((value) => {
			if (value !== undefined) {
				localStorage.setItem(key, JSON.stringify(value));
			}
		});
	}

	return store;
}

export const user: Writable<User | null> = persistentWritable('user', null);
export const nonce: Writable<string | null> = writable(null);
export const emailAccount: Writable<any> = persistentWritable('emailAccount', {
	email: 'All Emails'
});
export const emailLabels: Writable<any> = persistentWritable('emailLabels', []);
export const showErrorModal: Writable<boolean> = writable(false);
export const errorMessage: Writable<string> = writable('');
export const emailSearchList: Writable<SearchEntry[]> = writable([]);
export const emailList: Writable<any> = persistentWritable('emailList', []);
export const aiSearchQuery: Writable<string> = writable('');
export const currentEmail: Writable<Email> = writable(null);
