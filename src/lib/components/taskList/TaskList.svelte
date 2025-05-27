<script lang="ts">
	import type { Task } from '$lib/types';
	import { get } from 'svelte/store';
	import { emailServiceState } from '$lib/store';
	import { onMount } from 'svelte';
	import { refreshTaskListAction } from '$lib/actions/task';
	import TaskItem from './TaskItem.svelte';
	import { slide } from 'svelte/transition';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	const toggleOptions = ['To Do', 'Archived'];
	let selectedToggleOption = $state(0);

	function handleToggleChange(index: number) {
		selectedToggleOption = index;
	}

	let taskList = $state<Task[]>(get(emailServiceState).taskList);
	let isCollapsed = $state(get(emailServiceState).showTaskList);
	let containerWidth = $state(400); // Default width
	let isResizing = $state(false);
	let resizeStartX = $state(0);
	let resizeStartWidth = $state(0);

	const MIN_WIDTH = 240;
	const MAX_WIDTH = 420;

	function startResize(event: MouseEvent) {
		isResizing = true;
		resizeStartX = event.clientX;
		resizeStartWidth = containerWidth;
		document.addEventListener('mousemove', handleResize);
		document.addEventListener('mouseup', stopResize);
		event.preventDefault();
	}

	function handleResize(event: MouseEvent) {
		if (!isResizing) return;

		const deltaX = event.clientX - resizeStartX;
		let newWidth = resizeStartWidth - deltaX; // Inverted for left-side dragging

		// Apply constraints
		if (newWidth < MIN_WIDTH) {
			newWidth = 0; // Collapse
			isCollapsed = true;
		} else if (newWidth > MAX_WIDTH) {
			newWidth = MAX_WIDTH;
		} else {
			isCollapsed = false;
		}

		containerWidth = newWidth;
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', handleResize);
		document.removeEventListener('mouseup', stopResize);
	}

	onMount(() => {
		refreshTaskListAction();
		return () => {
			document.removeEventListener('mousemove', handleResize);
			document.removeEventListener('mouseup', stopResize);
		};
	});

	emailServiceState.subscribe((state) => {
		taskList = state.taskList;
		if (state.showTaskList !== !isCollapsed) {
			isCollapsed = !state.showTaskList;
			if (!isCollapsed && containerWidth === 0) {
				containerWidth = 400; // Restore default width when expanding
			}
		}
	});
</script>

<div
	class="task-list-container {isCollapsed ? 'collapsed' : ''}"
	style="width: {containerWidth}px;"
	transition:slide={{ duration: 300, axis: 'x' }}
>
	<div class="task-list-header">
		<RadioGroup
			active="bg-primary-container"
			border="0"
			rounded={'rounded-md'}
			size={'sm'}
			background={'bg-primary-dark-gray'}
		>
			{#each toggleOptions as option, index}
				<RadioItem
					bind:group={selectedToggleOption}
					name={option}
					value={index}
					on:click={() => handleToggleChange(index)}>{option}</RadioItem
				>
			{/each}
		</RadioGroup>
	</div>
	<div class="task-list-body">
		{#if taskList.length > 0}
			{#each taskList as task}
				<TaskItem {task} />
			{/each}
		{:else}
			<div class="task-list-empty">No tasks created</div>
		{/if}
	</div>

	<!-- Resize handle -->
	{#if !isCollapsed}
		<div class="resize-handle" on:mousedown={startResize}></div>
	{/if}
</div>

<style>
	.task-list-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 10px;
		min-width: 0;
		max-width: 420px;
		overflow-y: auto;
		position: relative;
		transition: width 0.3s ease;
	}

	.collapsed {
		width: 0 !important;
		display: none;
	}

	.task-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.task-list-header-radio-group {
		width: 100%;
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
		width: 100%;
	}

	.task-list-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.resize-handle {
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		cursor: col-resize;
		background-color: transparent;
		border-left: 2px solid transparent;
		transition: border-color 0.2s ease;
	}

	.resize-handle:hover {
		border-color: var(--color-primary-500, #3b82f6);
	}

	.resize-handle:active {
		border-color: var(--color-primary-700, #1d4ed8);
	}
</style>
