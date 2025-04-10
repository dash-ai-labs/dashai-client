<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { IconIndentIncrease } from '@tabler/icons-svelte';
	import { emailServiceState } from '$lib/store';
	import { get } from 'svelte/store';
	import { toggleTaskListAction } from '$lib/actions/task';

	let showTaskList = $state(get(emailServiceState).showTaskList);
	emailServiceState.subscribe((state) => {
		showTaskList = state.showTaskList;
	});
</script>

<PrimaryButton on:click={toggleTaskListAction} classes="task-list-button">
	<IconIndentIncrease rotate={180} color="var(--color-primary-white)" size={24} />
	{#if showTaskList}
		Task List
	{/if}
</PrimaryButton>

<style>
	.task-list-button {
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
