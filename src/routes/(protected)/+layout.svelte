<script lang="ts">
	import { goto } from '$app/navigation';
	import { errorMessage, showErrorModal } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	import { Toast } from '@skeletonlabs/skeleton';

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
			<!-- Dynamic content based on route -->
			{@render children?.()}
		</div>
	</main>
	<Toast />
</div>

<style>
	.dashboard {
		display: flex;
		background-color: #1a1a1a;
		color: white;
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
	}
</style>
