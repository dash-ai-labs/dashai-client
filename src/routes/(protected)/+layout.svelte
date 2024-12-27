<script lang="ts">
	import { goto } from '$app/navigation';
	import { user, errorMessage, showErrorModal } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import { onMount } from 'svelte';
	import { getUserProfile } from '$lib/auth';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	onMount(() => {
		const unsubscribe = user.subscribe(($user) => {
			if (!$user) {
				goto('/auth');
				return;
			}
		});

		return () => {
			unsubscribe();
		};
	});
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
	}

	@media (max-width: 768px) {
	}
</style>
