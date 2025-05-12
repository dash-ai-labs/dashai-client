import { getEmailSettings, updateEmailSettings } from '$lib/api/settings';
import { emailServiceState, user } from '$lib/store';
import type { UpdateEmailSettings } from '$lib/types';
import { get } from 'svelte/store';

const refreshEmailSettings = () => {
	const userId = get(user)?.id?.toString();
	const emailAccounts = get(user)?.profile?.email_accounts;
	const _refreshEmailSettings = async () => {
		const emailSettingsPromises = emailAccounts?.map(async (account) => {
			return getEmailSettings(userId, account.id);
		});
		const emailSettings = await Promise.all(emailSettingsPromises);
		emailServiceState.update((state) => ({
			...state,
			emailSettings: emailSettings
		}));
	};
	_refreshEmailSettings();
};

const updateEmailSettingsAction = async (
	emailAccountId: string,
	emailSettings: UpdateEmailSettings
) => {
	const response = await updateEmailSettings(
		get(user)?.id?.toString() || '',
		emailAccountId,
		emailSettings
	);
	refreshEmailSettings();
	return response;
};

export { refreshEmailSettings, updateEmailSettingsAction };
