<script lang="ts">
	import { getPrevText } from '$lib/components/emailEditor/lib/editor';
	import { LoadingCircle } from '$lib/components/emailEditor/icons/index';
	import type { CommandItemProps } from './slash-command.svelte';
	import { useCompletion } from '@ai-sdk/svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { get } from 'svelte/store';
	import { user } from '$lib/store';

	let {
		items,
		command,
		editor,
		range
	}: {
		items: CommandItemProps[];
		command: any;
		editor: any;
		range: any;
	} = $props();

	let selectedIndex = $state(0);

	const { complete, isLoading } = useCompletion({
		id: 'novel',
		api: `${PUBLIC_API_URL}/user/${get(user)?.id.toString()}/suggestion`,
		body: {},
		credentials: 'include',
		onResponse: (response) => {
			if (response.status === 429) {
				// addToast({
				// 	data: {
				// 		text: 'You have reached your request limit for the day.',
				// 		type: 'error'
				// 	}
				// });
				// va.track('Rate Limit Reached');
				return;
			}
			editor.chain().focus().deleteRange(range).run();
		},
		onFinish: (_prompt, completion) => {
			// highlight the generated text
			editor.commands.setTextSelection({
				from: range.from,
				to: range.from + completion.length
			});
		},
		onError: (e) => {
			// addToast({
			// 	data: {
			// 		text: e.message,
			// 		type: 'error'
			// 	}
			// });
		}
	});

	const selectItem = (index: number) => {
		const item = items[index];
		// va.track('Slash Command Used', {
		// 	command: item.title
		// });

		if (item) {
			command(item);
			// if (item.title === 'Continue writing') {
			// 	if (isLoading) return;
			// 	complete(
			// 		getPrevText(editor, {
			// 			chars: 5000,
			// 			offset: 1
			// 		})
			// 	);
			// } else {
			// 	command(item);
			// }
		}
	};

	const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
	const onKeyDown = (e: KeyboardEvent) => {
		if (!navigationKeys.includes(e.key)) return;
		e.preventDefault();
		if (e.key === 'ArrowUp') {
			selectedIndex = (selectedIndex + items.length - 1) % items.length;
		} else if (e.key === 'ArrowDown') {
			selectedIndex = (selectedIndex + 1) % items.length;
		} else if (e.key === 'Enter') {
			selectItem(selectedIndex);
		}

		const item = container?.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
		if (item)
			item.scrollIntoView({
				block: 'nearest'
			});
	};

	let container: HTMLElement | undefined = $state(undefined);
</script>

<svelte:window on:keydown={onKeyDown} />

{#if items.length > 0}
	<div id="slash-command" class="slash-command-container" bind:this={container}>
		{#each items as item, index (index)}
			<button
				class="command-item {index === selectedIndex ? 'selected' : ''}"
				onclick={() => selectItem(index)}
				data-index={index}
				type="button"
			>
				<div class="icon-container">
					{#if item.title === 'Continue writing' && isLoading}
						<LoadingCircle />
					{:else}
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component this={item.icon} size={18} />
					{/if}
				</div>
				<div>
					<p class="item-title">{item.title}</p>
					<p class="item-description">{item.description}</p>
				</div>
			</button>
		{/each}
	</div>
{/if}

<style>
	.slash-command-container {
		z-index: 50;
		height: auto;
		max-height: 330px;
		width: 18rem;
		overflow-y: auto;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		padding: 0.5rem 0.25rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		transition: all;
	}

	.command-item {
		display: flex;
		width: 100%;
		scroll-margin: 0.5rem;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.375rem;
		padding: 0.25rem 0.5rem;
		text-align: left;
		font-size: 0.875rem;
		color: #1c1917;
	}

	.command-item:hover {
		background-color: #f5f5f4;
	}

	.command-item.selected {
		background-color: #f5f5f4;
		color: #1c1917;
	}

	.icon-container {
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		background-color: white;
	}

	.item-title {
		font-weight: 500;
	}

	.item-description {
		font-size: 0.75rem;
		color: #78716c;
	}
</style>
