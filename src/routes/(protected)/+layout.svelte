<script lang="ts">
	import { goto } from '$app/navigation';
	import { errorMessage, showErrorModal } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	import { Toast } from '@skeletonlabs/skeleton';
	import TaskList from '$lib/components/taskList/TaskList.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Handle navigation
	function handleNavigation(path: string) {
		goto(path);
	}
</script>

<div class="dashboard">
	<!-- Sidebar -->
	<SideBar {handleNavigation} />
	<!-- Main Content -->
	<main class="main-content">
		<div class="content-header">
			<ThemeToggle />
		</div>
		<div class="content">
			<ErrorModal
				bind:showModal={$showErrorModal}
				error={$errorMessage}
				on:closeModal={() => ($showErrorModal = false)}
			/>

			<!-- Dynamic content based on route -->
			{@render children?.()}
		</div>
	</main>
	<TaskList />
	<Toast />
</div>

<style>
	.dashboard {
		display: flex;
		background-color: var(--color-primary-black);
		color: var(--color-font-black);
		width: 100%;
		height: 100vh;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.content-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid var(--color-secondary-separator);
		background-color: var(--color-primary-container);
	}

	.content {
		flex: 1;
		height: 100%;
		overflow-y: auto;
		width: 100%;
		padding-inline: 10px;
	}

	.inbox-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.header-buttons-container {
		align-self: center;
		gap: 10px;
		display: flex;
		justify-content: flex-end;
	}
	.notification-button {
		background-color: var(--color-primary-light-container);
		border-radius: 10px;
		padding-inline: 10px;
		padding-block: 5px;
		border: 1px solid var(--color-primary-dark-gray);
		color: var(--color-font-black);
	}
	.notification-button:hover {
		background-color: var(--color-secondary-active-button-background);
	}
</style>
