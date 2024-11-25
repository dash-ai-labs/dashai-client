<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import { onMount } from 'svelte';

	onMount(() => {
		user.subscribe(($user) => {
			if (!$user) {
				// Redirect to the login page
				goto('/auth');
				return;
			}

			return {
				props: {
					user: $user
				}
			};
		});
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
		padding: 2rem;
		flex: 1;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
	}
</style>
