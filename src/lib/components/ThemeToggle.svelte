<script lang="ts">
	import { theme, type Theme } from '$lib/store';
	import { onMount } from 'svelte';

	// Icons for light/dark mode
	const sunIcon = '☀️';
	const moonIcon = '🌙';

	function toggleTheme() {
		theme.update((currentTheme: Theme) => {
			const newTheme = currentTheme === 'light' ? 'dark' : 'light';
			// Apply theme class to document
			if (typeof document !== 'undefined') {
				document.documentElement.className = newTheme === 'dark' ? 'dark-theme' : '';
			}
			return newTheme;
		});
	}

	// Apply theme on mount
	onMount(() => {
		const unsubscribe = theme.subscribe((currentTheme: Theme) => {
			if (typeof document !== 'undefined') {
				document.documentElement.className = currentTheme === 'dark' ? 'dark-theme' : '';
			}
		});

		return unsubscribe;
	});
</script>

<button class="theme-toggle" on:click={toggleTheme} title="Toggle theme">
	<span class="theme-icon">
		{$theme === 'light' ? moonIcon : sunIcon}
	</span>
	<span class="theme-label">
		{$theme === 'light' ? 'Dark' : 'Light'}
	</span>
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background-color: var(--color-primary-container);
		border: 1px solid var(--color-primary-dark-gray);
		color: var(--color-font-black);
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.theme-toggle:hover {
		background-color: var(--color-secondary-active-button-background);
		transform: translateY(-1px);
	}

	.theme-toggle:active {
		transform: translateY(0);
	}

	.theme-icon {
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;
	}

	.theme-toggle:hover .theme-icon {
		transform: scale(1.1);
	}

	.theme-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-font-gray);
	}

	@media (max-width: 768px) {
		.theme-toggle {
			padding: 0.4rem 0.8rem;
			font-size: 0.8rem;
		}

		.theme-label {
			display: none;
		}

		.theme-icon {
			font-size: 1.2rem;
		}
	}
</style>
