import { user } from '$lib/store';

import { getUserProfile } from '$lib/api/auth';
import { get } from 'svelte/store';

const refreshUser = async () => {
	const _refreshUser = async () => {
		const response = await getUserProfile(get(user)?.id.toString());
		user.set(response);
	};
	_refreshUser();
};

export default refreshUser;
