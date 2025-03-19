<script lang="ts">
	import { IconLoader2 } from '@tabler/icons-svelte';
	import snarkdown from 'snarkdown';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const { query, resultReader, loading } = $props();

	let searchResultsHTML = $state<string>('');
	let searchResults = $state<string[]>([]);
	let isLoading = $state(false);

	$effect(() => {
		if (searchResults.length > 0) {
			searchResultsHTML = snarkdown(searchResults.join(' '));
		}
	});

	const readStream = async () => {
		let buffer = '';
		searchResults = []; // Reset results when starting new search
		const decoder = new TextDecoder('utf-8');

		try {
			while (true) {
				const { done, value } = await resultReader!.read();
				if (done) break;
				const chunk = decoder.decode(value);
				buffer += chunk;

				// Add artificial delay
				await new Promise((resolve) => setTimeout(resolve, 50));

				let boundary = buffer.indexOf('\n'); // Assume newline-separated JSON
				while (boundary !== -1) {
					const jsonString = buffer.slice(0, boundary); // Extract one JSON object
					buffer = buffer.slice(boundary + 1); // Remove processed part
					boundary = buffer.indexOf('\n');

					try {
						const { data } = JSON.parse(jsonString);
						// Handle parsed data
						if (!data.startsWith(' ') && searchResults.length > 0) {
							const lastIndex = searchResults.length - 1;
							searchResults = [
								...searchResults.slice(0, lastIndex),
								searchResults[lastIndex] + data
							];
						} else {
							searchResults = [...searchResults, data];
						}
					} catch (error) {
						console.error('Error parsing JSON string:', jsonString, error);
					}
				}
			}
		} catch (error) {
			console.error('Error reading search stream:', error);
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		if (resultReader) {
			isLoading = true;
			readStream();
		}
	});

	$effect(() => {
		if (resultReader) {
			isLoading = true;
			readStream();
		}
	});
</script>

<div class="search-entry">
	<div class="content-container">
		<div class="query-container">
			{#if loading}
				<IconLoader2 class="spinner" />
			{/if}
			<div class="query-bubble">{query}</div>
		</div>
		{#if searchResultsHTML.length > 0}
			<div class="results-container">
				<div class="markdown-content" transition:fade={{ duration: 200 }}>
					{@html searchResultsHTML}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.search-entry {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.content-container {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.query-container {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		align-self: flex-end;
	}

	.query-bubble {
		border-radius: 0.5rem;
		background-color: var(--color-primary-container);
		color: var(--color-primary-white);
		padding: 0.25rem 0.75rem;
	}

	.results-container {
		justify-content: flex-start;
		overflow: hidden;
		overflow-y: auto;
		padding: 0.5rem 0;
	}

	.markdown-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-radius: 0.5rem;
		color: var(--color-primary-white);
	}

	.markdown-content :global(.markdown),
	.markdown-content :global(.prose),
	.markdown-content :global(.prose-invert) {
		/* Preserve any global styles applied to markdown content */
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
