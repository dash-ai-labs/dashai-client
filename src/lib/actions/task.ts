import { archiveTask, createTask, getTaskList } from '$lib/api/task';
import { emailServiceState, user } from '$lib/store';
import { TaskStatus } from '$lib/types';
import { get } from 'svelte/store';

const createTaskAction = async (email_id: string) => {
	const userId = get(user)?.id.toString();
	const task = await createTask({
		user: userId,
		email_id
	});
	if (task) {
		await refreshTaskListAction();
	}
	return task;
};

const refreshTaskListAction = async () => {
	const { emailAccount } = get(emailServiceState);
	const userId = get(user)?.id.toString();
	const taskList = await getTaskList({
		user: userId,
		email_account_id: emailAccount.id,
		status: TaskStatus.PENDING,
		page: 1,
		limit: 10
	});
	if (taskList) {
		emailServiceState.update((state) => ({
			...state,
			taskList: taskList
		}));
	}
};

const archiveTaskAction = async ({ task_id, email_id }: { task_id: string; email_id: string }) => {
	const userId = get(user)?.id.toString();
	const task = await archiveTask({
		user: userId,
		task_id,
		email_id
	});
	if (task) {
		await refreshTaskListAction();
		toggleTaskListAction(true);
	}
};

const toggleTaskListAction = async (show?: boolean) => {
	emailServiceState.update((state) => ({
		...state,
		showTaskList: typeof show === 'boolean' ? show : !state.showTaskList
	}));
};

export { createTaskAction, refreshTaskListAction, archiveTaskAction, toggleTaskListAction };
