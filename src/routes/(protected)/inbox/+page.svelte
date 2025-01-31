<script lang="ts">
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import InboxAccountDropdown from '$lib/components/InboxAccountDropdown.svelte';
	import InboxSearchBar from '$lib/components/InboxSearchBar.svelte';
	import NewEmailLabelComponent from '$lib/components/NewEmailLabelComponent.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { refreshEmailLabels } from '$lib/helpers';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import snarkdown from 'snarkdown';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let queryResponseReader = $state<ReadableStreamDefaultReader<Uint8Array> | null>(null);

	const setQueryResponseReader = (reader: ReadableStreamDefaultReader) => {
		queryResponseReader = reader;
	};

	let searchResults = $state<string[]>([]);

	let searchResultsHTML = $state<string>('');

	let isLoading = $state(false);

	$effect(() => {
		if (searchResults.length > 0) {
			searchResultsHTML = snarkdown(searchResults.join(' '));
		}
	});

	onMount(() => {
		refreshEmailLabels();
	});

	$effect(() => {
		let buffer = '';
		if (queryResponseReader && queryResponseReader instanceof ReadableStreamDefaultReader) {
			isLoading = true;
			const readStream = async () => {
				searchResults = []; // Reset results when starting new search
				const decoder = new TextDecoder('utf-8');

				try {
					while (true) {
						const { done, value } = await queryResponseReader!.read();
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
	const modalStore = getModalStore();

	function modalComponentForm(): void {
		const c: ModalComponent = { ref: NewEmailLabelComponent };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Email Label',
			body: 'Add new email label',
			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
</script>

<div class="mx-[40px]">
	<div class="flex flex-row items-center">
		<InboxSearchBar {setQueryResponseReader} />
		<InboxAccountDropdown />
	</div>

	{#if searchResultsHTML.length > 0}
		<div class="relative max-h-[400px] max-w-full overflow-hidden overflow-y-auto py-2">
			<div
				class="markdown prose prose-invert flex flex-col gap-2 rounded-lg border border-primary-white bg-secondary-container p-3 text-primary-white"
				transition:fade={{ duration: 200 }}
			>
				{@html searchResultsHTML}
			</div>
		</div>
	{/if}
	<div class="mt-[40px] flex-col gap-[25px]">
		<div class="flex flex-row">
			<div class="w-full text-h2">Inbox</div>

			<div class="flex w-full justify-end">
				<PrimaryButton on:click={modalComponentForm}>+ Email Label</PrimaryButton>
			</div>
		</div>
		<!-- <Widgets /> -->
		<EmailContainer />
	</div>
</div>
