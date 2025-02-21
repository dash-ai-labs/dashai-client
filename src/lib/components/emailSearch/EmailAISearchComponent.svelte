<script lang="ts">
	import { emailSearchList, user } from '$lib/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';
	import SearchEntry from './SearchEntry.svelte';
	import { searchEmailsStreaming } from '$lib/api/email';

	let searchQuery = $state('');
	let showError = $state(false);
	let containerDiv: HTMLDivElement | null = $state(null);

	// Add auto-scroll when content updates
	$effect(() => {
		emailSearchList.subscribe((values) => {
			if (values.some((item) => item.resultReader && item.loading)) {
				containerDiv?.scrollTo({
					top: containerDiv.scrollHeight,
					behavior: 'smooth'
				});
			}
		});
	});

	let searchHistory: string[] = [
		// 'How many emails have I receive in the past week?',
		// 'How many emails have I receive in the past week?',
		// 'How many emails have I receive in the past week?',
		// 'How many emails have I receive in the past week?'
	];
	const modalStore = getModalStore();

	const handleSubmit = async () => {
		if (searchQuery.length > 0) {
			const id = crypto.randomUUID();
			emailSearchList.update((list) => [
				...list,
				{
					query: searchQuery,
					resultReader: null,
					loading: true,
					id: id
				}
			]);
			// Scroll to bottom after adding new entry

			const reader = await searchEmailsStreaming({
				user: get(user)?.id.toString(),
				search: searchQuery
			});
			if (reader) {
				emailSearchList.update((list) =>
					list.map((item) =>
						item.id === id
							? {
									...item,
									resultReader: reader,
									loading: false
								}
							: item
					)
				);
			}
		} else {
			showError = true;
		}
		searchQuery = '';
	};
</script>

{#if $modalStore[0]}
	<div
		class="z-50 flex max-h-[80vh] w-[80%] flex-col gap-6 self-start rounded-xl bg-primary-dark-gray/95 p-6"
	>
		<!-- Search Input Area -->

		<div class="h-full w-full overflow-y-auto" bind:this={containerDiv}>
			{#each $emailSearchList as emailSearch}
				<SearchEntry
					query={emailSearch.query}
					resultReader={emailSearch.resultReader}
					loading={emailSearch.loading}
				/>
			{/each}
			<form onsubmit={handleSubmit}>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Ask Smart Search"
					class="w-full rounded-xl bg-primary-dark-container p-4 pr-12 text-primary-white"
				/>
				<!-- Microphone Icon -->
				<!-- <button class="absolute right-4 top-1/2 -translate-y-1/2 text-primary-gray">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
					<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
					<line x1="12" x2="12" y1="19" y2="22" />
				</svg>
			</button> -->
			</form>
		</div>

		<!-- Filter Pills -->
		<!-- <div class="flex gap-2">
			<div class="rounded-full bg-primary-orange/20 px-4 py-1"></div>
			<div class="rounded-full bg-primary-purple/20 px-4 py-1"></div>
			<div class="rounded-full bg-primary-blue/20 px-4 py-1"></div>
		</div> -->

		<!-- History Section -->
		<!-- <div class="flex flex-col gap-4">
			<h2 class="text-section-header text-font-gray">History</h2>
			<div class="flex flex-col gap-3">
				{#each searchHistory as query}
					<div
						class="flex items-center justify-between rounded-lg bg-primary-dark-container p-4 text-primary-white"
					>
						<span>{query}</span>
						<button class="text-primary-gray">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14" />
								<path d="m12 5 7 7-7 7" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div> -->
	</div>
{/if}
