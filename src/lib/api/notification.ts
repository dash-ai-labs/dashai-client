import { NotificationStatus } from '$lib/types';
import { apiRequest } from './base';

export const getNotifications = async (user: string) => {
	try {
		const response = await apiRequest(`user/${user}/notifications`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching notifications:', error);
		return [];
	}
};

export const readNotification = async (user: string, notificationId: string) => {
	try {
		const response = await apiRequest(
			`user/${user}/notification/${notificationId}/${NotificationStatus.READ}`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		return response.json();
	} catch (error) {
		console.error('Error reading notification:', error);
		return null;
	}
};

export const archiveNotification = async (user: string, notificationId: string) => {
	try {
		const response = await apiRequest(
			`user/${user}/notification/${notificationId}/${NotificationStatus.ARCHIVED}`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		return response.json();
	} catch (error) {
		console.error('Error archiving notification:', error);
		return null;
	}
};
