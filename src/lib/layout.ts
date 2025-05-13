import { user } from '$lib/store';
import { goto } from '$app/navigation';
import { getUserProfile } from '$lib/api/auth';

let isUpdating = false;

export function initializeLayout() {
	return user.subscribe(($user) => {
		if (!$user || !$user.id) {
			goto('/auth');
			return;
		}
		if ((!$user.profile || !$user.profile?.email) && !isUpdating) {
			isUpdating = true;
			(async () => {
				try {
					const response = await getUserProfile($user.id?.toString());
					if (response) {
						user.update((state) => ({
							...state,
							profile: response
						}));
						if (response.waitlisted) {
							goto('/waitlist');
						} else {
							goto('/inbox');
						}
					}
				} catch (error) {
					console.error('Failed to refresh user profile:', error);
				} finally {
					isUpdating = false;
				}
			})();
		}
	});
}

export function handleNavigation(path: string) {
	goto(path);
}
