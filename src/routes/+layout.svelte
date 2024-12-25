<script lang="ts">
	import '../app.css';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getUserProfile } from '$lib/auth';
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

		// Only fetch profile once on mount
		if ($user) {
			(async () => {
				try {
					const response = await getUserProfile($user.id.toString());
					if (response) {
						user.set(response);
						goto('/inbox');
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
	{@render children?.()}
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}
</style>
