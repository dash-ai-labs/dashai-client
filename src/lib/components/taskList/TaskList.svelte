<script lang="ts">
	import type { Task } from '$lib/types';
	import { get } from 'svelte/store';
	import { emailServiceState } from '$lib/store';
	import { onMount } from 'svelte';
	import { refreshTaskListAction } from '$lib/actions/task';
	import TaskItem from './TaskItem.svelte';
	import { slide } from 'svelte/transition';

	let taskList = $state<Task[]>(get(emailServiceState).taskList);
	let isCollapsed = $state(get(emailServiceState).showTaskList);
	onMount(() => {
		refreshTaskListAction();
	});
	emailServiceState.subscribe((state) => {
		taskList = state.taskList;
		isCollapsed = !state.showTaskList;
	});
</script>

<div
	class="task-list-container {isCollapsed ? 'collapsed' : ''}"
	transition:slide={{ duration: 300, axis: 'x' }}
>
	<div class="task-list-body">
		{#if taskList.length > 0}
			{#each taskList as task}
				<TaskItem {task} />
			{/each}
		{:else}
			<div class="task-list-empty">No tasks created</div>
		{/if}
	</div>
</div>

<style>
	.task-list-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 10px;
		width: 320px;
	}
	.collapsed {
		width: 0;
		display: none;
	}
	.task-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.task-list-empty {
		text-align: center;
		padding: 10px;
		margin-top: 80px;
		color: var(--color-primary-gray);
	}

	.task-list-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.task-list-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
