import { writable, type Writable } from 'svelte/store';
export interface User {
	id: number;
	email: string;
	name: string;
}

// Define the type for the user store with optional initial value
function persistentWritable(key: string, initialValue: any): Writable<any> {
	// Create a writable store with the initial value
	const store = writable(initialValue, (set) => {
		if (typeof window !== 'undefined') {
			// Only run this code in the browser
			const storedValue = localStorage.getItem(key);
			if (storedValue) {
				set(JSON.parse(storedValue)); // Set the store to the value from localStorage
			}
		}

		return () => {
			// Cleanup logic (optional, for example, remove listeners)
		};
	});

	// Subscribe to changes and update localStorage (in the browser)
	if (typeof window !== 'undefined') {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const user: Writable<User> = persistentWritable('user', {
	id: null,
	email: null,
	name: null
});

export const emailAccount: Writable<any> = persistentWritable('emailAccount', {
	email: 'All Emails'
});