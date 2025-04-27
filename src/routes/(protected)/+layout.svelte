<script lang="ts">
	import { goto } from '$app/navigation';
	import { errorMessage, showErrorModal } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	import { Toast } from '@skeletonlabs/skeleton';
	import TaskList from '$lib/components/taskList/TaskList.svelte';
	import InboxAccountDropdown from '$lib/components/InboxAccountDropdown.svelte';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import ToggleTaskListButton from '$lib/components/taskList/ToggleTaskListButton.svelte';
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
		<div class="content">
			<ErrorModal
				bind:showModal={$showErrorModal}
				error={$errorMessage}
				on:closeModal={() => ($showErrorModal = false)}
			/>
			<div class="inbox-header">
				<InboxSearchBar />
				<div class="header-buttons-container">
					<ToggleTaskListButton />
				</div>
			</div>

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
		background-color: #1a1a1a;
		color: white;
		width: 100%;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
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
</style>
