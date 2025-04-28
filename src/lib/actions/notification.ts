import { getNotifications } from '$lib/api/notification';
import { user } from '$lib/store';
import { get } from 'svelte/store';

export const refreshNotifications = async () => {
	const _getNotifications = async () => {
		const notifications = await getNotifications(get(user)?.id?.toString() ?? '');
		user.update((state) => ({
			...state,
			profile: {
				...state?.profile,
				notifications: notifications
			}
		}));
	};
	_getNotifications();
};
