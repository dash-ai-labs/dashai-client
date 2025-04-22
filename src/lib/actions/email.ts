import { get } from 'svelte/store';
import { getEmail, getEmailList } from '$lib/api/email';
import { emailServiceState, user } from '$lib/store';
import type { Email } from '$lib/types';

const refreshEmailList = (filter: { key: string; value: string }[]) => {
	const _getEmailList = async () => {
		const emailList = await getEmailList({
			user: get(user)?.id.toString(),
			account:
				get(emailServiceState).emailAccount.email === 'All Emails'
					? undefined
					: get(emailServiceState).emailAccount.email,
			limit: 30,
			page: 1,
			filter
		});
		emailServiceState.update((state) => ({
			...state,
			emailList: emailList.emails
		}));
	};
	_getEmailList();
};

const setCurrentEmail = async ({
	email,
	email_id
}: {
	email?: Email;
	email_id?: string;
}): Promise<void> => {
	if (email && !email_id) {
		await emailServiceState.update((state) => ({
			...state,
			currentEmail: email,
			email_id: email_id
		}));
	} else if (email_id && !email) {
		const email = await getEmail({
			user: get(user)?.id.toString(),
			email_id: email_id
		});
		emailServiceState.update((state) => ({
			...state,
			currentEmail: email
		}));
	} else {
		throw new Error('Email or email_id is required');
	}
};

export { refreshEmailList, setCurrentEmail };
