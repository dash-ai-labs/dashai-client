<script lang="ts">
	import snarkdown from 'snarkdown';
	import { fade } from 'svelte/transition';

	const { query, resultReader } = $props();

	let searchResultsHTML = $state<string>('');
	let searchResults = $state<string[]>([]);
	let isLoading = $state(false);

	$effect(() => {
		if (searchResults.length > 0) {
			searchResultsHTML = snarkdown(searchResults.join(' '));
		}
	});
	$effect(() => {
		let buffer = '';
		if (resultReader) {
			isLoading = true;
			const readStream = async () => {
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
			readStream();
		}
	});
</script>

<div class="flex flex-row items-center gap-2 py-2">
	<div class="flex w-full flex-col items-center gap-2">
		<div class="self-end">
			<div class="rounded-lg bg-primary-container px-3 py-1 text-primary-white">{query}</div>
		</div>
		{#if searchResultsHTML.length > 0}
			<div class="justify-start overflow-hidden overflow-y-auto py-2">
				<div
					class="markdown prose prose-invert flex flex-col gap-2 rounded-lg text-primary-white"
					transition:fade={{ duration: 200 }}
				>
					{@html searchResultsHTML}
				</div>
			</div>
		{/if}
	</div>
</div>
