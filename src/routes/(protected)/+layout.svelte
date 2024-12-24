<script lang="ts">
	import { goto } from '$app/navigation';
	import { user, errorMessage, showErrorModal } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import { onMount } from 'svelte';
	import { getUserProfile } from '$lib/auth';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	onMount(() => {
		const unsubscribe = user.subscribe(($user) => {
			if (!$user) {
				goto('/auth');
				return;
			}
		});

		// Only fetch profile once on mount
		if ($user) {
			(async () => {
				try {
					const response = await getUserProfile($user.id.toString());
					if (response) {
						user.set(response);
					}
				} catch (error) {
					console.error('Failed to refresh user profile:', error);
				}
			})();
		}

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
			<slot />
		</div>
	</main>
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
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
		overflow-y: auto;
	}

	@media (max-width: 768px) {
	}
</style>
