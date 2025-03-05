<script lang="ts">
	import { getPrevText } from '$lib/components/emailEditor/lib/editor';
	import { LoadingCircle } from '$lib/components/emailEditor/icons/index';
	import type { CommandItemProps } from './slash-command';
	import { anyify } from '$lib/components/emailEditor/lib/utils';
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
	console.log(items);
	const { complete, isLoading } = useCompletion({
		id: 'novel',
		api: `${PUBLIC_API_URL}/user/${get(user)?.id.toString()}/suggestion`,
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
			if (item.title === 'Continue writing') {
				if (isLoading) return;
				complete(
					getPrevText(editor, {
						chars: 5000,
						offset: 1
					})
				);
			} else {
				command(item);
			}
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
	<div
		id="slash-command"
		class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all"
		bind:this={container}
	>
		{#each items as item, index (index)}
			<button
				class="flex w-full scroll-my-2 items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100
				{index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''}"
				onclick={() => selectItem(index)}
				data-index={index}
				type="button"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white"
				>
					{#if item.title === 'Continue writing' && isLoading}
						<LoadingCircle />
					{:else}
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component this={item.icon} size={18} />
					{/if}
				</div>
				<div>
					<p class="font-medium">{item.title}</p>
					<p class="text-xs text-stone-500">{item.description}</p>
				</div>
			</button>
		{/each}
	</div>
{/if}
