<script lang="ts">
	import { setCurrentEmail } from '$lib/actions/email';
	import { archiveTaskAction } from '$lib/actions/task';
	import type { Task } from '$lib/types';
	import { IconCalendar } from '@tabler/icons-svelte';

	let { task }: { task: Task } = $props();

	const getDueDate = (date: string) => {
		const dueDate = new Date(date);
		const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
		return dueDate.toLocaleDateString('en-US', options);
	};
</script>

<div class="task-item">
	<div class="task-item-header">
		{#if task.thumbnail_url}
			<div class="task-item-header-left">
				<img src={task.thumbnail_url} alt={task.title} />
			</div>
		{/if}

		<div class="task-item-header-right">
			<div class="task-item-header-right-title">
				<h2>{task.title}</h2>
			</div>
			{#if task.due_date}
				<div class="task-item-header-due-date">
					<IconCalendar size={20} color="var(--color-primary-gray)" />
					<p class="task-item-header-due-date-text">{getDueDate(task.due_date)}</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="task-item-body">
		<p class="task-item-body-description">
			<b style="color: var(--color-primary-white)">Notes:</b><br />
			{task.description}
		</p>
		<div class="task-item-buttons-container">
			{#if task.url && task.url_text}
				<button class="task-item-action-button" onclick={() => window.open(task.url, '_blank')}>
					{task.url_text}
				</button>
			{/if}
			<div class="task-item-email-buttons-container">
				<button
					class="task-item-go-to-email-button"
					onclick={async () => await setCurrentEmail({ email_id: task.email_id })}
				>
					Go to Email
				</button>
				<button
					class="task-item-archive-button"
					onclick={async () =>
						await archiveTaskAction({ task_id: task.id, email_id: task.email_id })}
				>
					Archive
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.task-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--color-primary-container);
		border-radius: 10px;
		padding: 20px;
	}
	.task-item-header {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		gap: 20px;
	}
	.task-item-header-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 10px;
		padding: 4px;
		background-color: var(--color-primary-white);
	}
	.task-item-header-right {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 8px;
	}
	.task-item-header-right-title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.task-item-header-due-date {
		display: flex;
		align-items: center;
	}
	.task-item-header-due-date-text {
		font-size: 14px;
		color: var(--color-primary-gray);
		align-self: center;
		justify-self: center;
	}
	.task-item-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.task-item-body-description {
		font-size: 14px;
		align-self: start;
		color: var(--color-primary-gray);
	}
	.task-item-buttons-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}
	.task-item-email-buttons-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}
	.task-item-action-button {
		background-color: var(--color-primary-button);
		color: var(--color-primary-white);
		border-radius: 5px;
		padding: 0.5rem;
		align-self: center;
		justify-content: center;
		width: 100%;
	}
	.task-item-go-to-email-button {
		background-color: var(--color-primary-task-button);
		color: var(--color-primary-white);
		border-radius: 5px;
		padding: 0.5rem;
		width: 100%;
		border: 1px solid var(--color-primary-task-button);
	}
	.task-item-archive-button {
		background-color: var(--color-primary-container);
		color: var(--color-primary-gray);
		border-radius: 5px;
		padding: 0.5rem;
		width: 100%;
		border: 1px solid var(--color-primary-gray);
	}
</style>
