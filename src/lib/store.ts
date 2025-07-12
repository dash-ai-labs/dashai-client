import { writable, type Writable } from 'svelte/store';
import type { SearchEntry, User, EmailServiceState, ComposeEmail } from './types';
import { ComposeEmailMode } from './types';

export type Theme = 'light' | 'dark';
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

export const user: Writable<User | null> = persistentWritable('user', {
	id: null,
	email: null,
	name: null,
	profile: null
});
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
export const composeEmail: Writable<ComposeEmail> = persistentWritable('composeEmail', {
	email: {
		from_addr: '',
		to: [],
		cc: [],
		bcc: [],
		subject: '',
		body: '',
		attachments: []
	},
	isLoadingTextGeneration: false
});
export const emailServiceState: Writable<EmailServiceState> = persistentWritable(
	'emailServiceState',
	{
		currentEmail: null,
		emailSearchQueryList: [],
		aiSearchQuery: '',
		emailLabels: [],
		showComposeEmail: false,
		composeEmailMode: ComposeEmailMode.NewEmail,
		emailAccount: { email: 'All Emails' },
		emailList: [],
		emailListFilter: [],
		taskList: [],
		emailSettings: [],
		showTaskList: false,
		showEmailHeader: true
	}
);

// Theme store - defaults to light mode
export const theme: Writable<Theme> = persistentWritable('theme', 'light');

// Reset currentEmail on app load
if (typeof window !== 'undefined') {
	emailServiceState.update((state) => ({
		...state,
		currentEmail: null,
		showComposeEmail: false,
		emailList: [],
		emailListFilter: ['INBOX'],
		taskList: [],
		composeEmailMode: ComposeEmailMode.NewEmail,
		emailSearchQueryList: [],
		emailLabels: [],
		emailAccount: { email: 'All Emails' },
		showTaskList: false,
		showEmailHeader: true,
		emailSettings: []
	}));
	user.update((state) => ({
		...state,
		profile: {
			...state?.profile,
			notifications: [],
			email_accounts: [],
			id: 0,
			email: null,
			name: null,
			profile_pic: null,
			last_login: null,
			email_settings: []
		}
	}));
	composeEmail.update((state) => ({
		...state,
		email: {
			from_addr: '',
			to: [],
			cc: [],
			bcc: [],
			subject: '',
			body: '',
			attachments: []
		},
		isLoadingTextGeneration: false
	}));
}
