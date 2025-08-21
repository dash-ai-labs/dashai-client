import { get } from 'svelte/store';
import { archive, getEmail, getEmailList, inbox, remove, spam } from '$lib/api/email';
import { emailServiceState, user } from '$lib/store';
import { EmailCategory, type Email } from '$lib/types';
import { EmailFolder } from '$lib/types';
const refreshEmailList = (
	filter: { key: string; value: string }[],
	folder: EmailFolder = EmailFolder.INBOX,
	category?: EmailCategory[]
) => {
	const _getEmailList = async () => {
		const emailList = await getEmailList({
			user: get(user)?.id.toString(),
			account:
				get(emailServiceState).emailAccount.email === 'All Emails'
					? undefined
					: get(emailServiceState).emailAccount.email,
			limit: 30,
			page: 1,
			filter,
			folder,
			category
		});
		emailServiceState.update((state) => ({
			...state,
			emailList: emailList.emails
		}));
	};
	_getEmailList();
};

const clearEmails = async () => {
	await emailServiceState.update((state) => ({
		...state,
		emailList: [],
		currentEmail: null,
		email_id: null
	}));
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

const removeEmailAction = (removedEmail: Email) => {
	const _remove = async () => {
		const res = await remove({ user: get(user)?.id.toString(), email_id: removedEmail.email_id });
		if (res) {
			emailServiceState.update((state) => ({
				...state,
				emailList: state.emailList.filter((e) => e.email_id !== removedEmail.email_id)
			}));
		}
	};
	_remove();
};
const archiveEmailAction = (achivedEmail: Email) => {
	const _archive = async () => {
		const res = await archive({
			user: get(user)?.id.toString(),
			email_id: achivedEmail.email_id
		});
		if (res) {
			emailServiceState.update((state) => ({
				...state,
				emailList: state.emailList.filter((e) => e.email_id !== achivedEmail.email_id)
			}));
		}
	};
	_archive();
};

const spamEmailAction = (spamEmail: Email) => {
	const _spam = async () => {
		const res = await spam({ user: get(user)?.id.toString(), email_id: spamEmail.email_id });
		if (res) {
			emailServiceState.update((state) => ({
				...state,
				emailList: state.emailList.filter((e) => e.email_id !== spamEmail.email_id)
			}));
		}
	};
	_spam();
};

const inboxEmailAction = (inboxEmail: Email) => {
	const _inbox = async () => {
		const res = await inbox({ user: get(user)?.id.toString(), email_id: inboxEmail.email_id });
		if (res) {
			emailServiceState.update((state) => ({
				...state,
				emailList: state.emailList.filter((e) => e.email_id !== inboxEmail.email_id)
			}));
		}
	};
	_inbox();
};
export {
	refreshEmailList,
	setCurrentEmail,
	clearEmails,
	removeEmailAction,
	archiveEmailAction,
	spamEmailAction,
	inboxEmailAction
};
