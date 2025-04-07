import { emailServiceState, user } from '$lib/store';
import { ComposeEmailMode } from '$lib/types';
import { get } from 'svelte/store';
import { getEmailList } from './api/email';
const setShowComposeEmail = (show: boolean, mode: ComposeEmailMode = ComposeEmailMode.NewEmail) => {
	emailServiceState.update((state) => ({
		...state,
		showComposeEmail: show,
		composeEmailMode: mode
	}));
};

const setComposeEmailMode = (mode: ComposeEmailMode) => {
	emailServiceState.update((state) => ({
		...state,
		composeEmailMode: mode
	}));
};

const refreshEmailList = (filter: string[] = ['INBOX']) => {
	const _getEmailList = async () => {
		const emailList = await getEmailList({
			user: get(user)?.id.toString(),
			account:
				get(emailServiceState).emailAccount.email === 'All Emails'
					? undefined
					: get(emailServiceState).emailAccount.email,
			limit: 30,
			page: 1,
			filter: filter
		});
		emailServiceState.update((state) => ({
			...state,
			emailList: emailList.emails
		}));
	};
	_getEmailList();
};

export { setShowComposeEmail, setComposeEmailMode, refreshEmailList };
