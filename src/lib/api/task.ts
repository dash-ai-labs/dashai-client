import { TaskAction, type Task, type TaskStatus } from '$lib/types';
import { apiRequest } from './base';

export const getTaskList = async ({
	user,
	email_account_id,
	status,
	page = 1,
	limit = 10
}: {
	user: string;
	email_account_id: string;
	status: TaskStatus;
	page: number;
	limit: number;
}): Promise<Task[]> => {
	const pageString = page.toString();
	const limitString = limit.toString();

	try {
		const params = new URLSearchParams({
			page: pageString,
			limit: limitString
		});
		if (!!email_account_id) params.append('email_account_id', email_account_id.toString());
		if (!!status) params.append('status', status.toString());

		const url = `user/${user}/tasks?${params.toString()}`;
		const response = await apiRequest(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching task list:', error);
		return [];
	}
};

export const createTask = async ({
	user,
	email_id
}: {
	user: string;
	email_id: string;
}): Promise<Task | null> => {
	try {
		const response = await apiRequest(`user/${user}/task`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email_id, action: TaskAction.CREATE })
		});
		return response.json();
	} catch (error) {
		console.error('Error creating task:', error);
		return null;
	}
};

export const updateTask = async ({
	user,
	task_id,
	email_id,
	status,
	due_date,
	title,
	description
}: {
	user: string;
	task_id: string;
	email_id: string;
	status: TaskStatus;
	due_date: Date;
	title: string;
	description: string;
}): Promise<Task | null> => {
	try {
		const response = await apiRequest(`user/${user}/task`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email_id,
				status,
				task_id,
				due_date,
				title,
				description,
				action: TaskAction.UPDATE
			})
		});
		return response.json();
	} catch (error) {
		console.error('Error updating task:', error);
		return null;
	}
};

export const archiveTask = async ({
	user,
	task_id,
	email_id
}: {
	user: string;
	task_id: string;
	email_id: string;
}): Promise<Task | null> => {
	try {
		const response = await apiRequest(`user/${user}/task`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ task_id, email_id, action: TaskAction.ARCHIVE })
		});
		return response.json();
	} catch (error) {
		console.error('Error deleting task:', error);
		return null;
	}
};
