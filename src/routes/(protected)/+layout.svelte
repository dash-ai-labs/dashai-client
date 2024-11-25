<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/store';
	import SideBar from '$lib/components/SideBar.svelte';
	import '@material/web/button/filled-tonal-button';
	import { onMount } from 'svelte';

	onMount(() => {
		user.subscribe(($user) => {
			console.log($user);
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

	.sidebar {
		width: 240px;
		background-color: #1e1e1e;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.brand {
		font-size: 1.25rem;
		font-weight: 600;
		padding: 0.5rem;
	}

	.nav-menu {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		color: #a1a1aa;
		background: none;
		border: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nav-item:hover {
		background-color: #27272a;
		color: white;
	}

	.nav-item.active {
		background-color: #27272a;
		color: white;
	}

	.badge {
		margin-left: auto;
		background-color: #27272a;
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;
		font-size: 0.875rem;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #27272a;
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		max-width: 600px;
	}

	.menu-button {
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background-color: #27272a;
		border: none;
		color: white;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dropdown-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.content {
		padding: 2rem;
		flex: 1;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 80px;
		}

		.nav-item span:not(.badge) {
			display: none;
		}

		.brand {
			text-align: center;
			font-size: 1rem;
		}
	}
</style>
