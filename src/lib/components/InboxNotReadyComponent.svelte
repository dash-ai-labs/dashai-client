<script lang="ts">
	import type { EmailAccount } from '$lib/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconLoader2 } from '@tabler/icons-svelte';

	let { emailAccount }: { emailAccount: EmailAccount } = $props();
	const modalStore = getModalStore();
	const cBase =
		'overflow-hidden rounded-lg self-center border border-primary-dark-gray bg-primary-black p-[24px] text-font-light-gray';
	const cHeader = 'text-2xl font-bold';
	const cBody = 'text-md py-2';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<div class="flex flex-row items-center">
			<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
			<IconLoader2 class="w-10 animate-spin px-2" />
		</div>
		<article class={cBody}>{$modalStore[0].body ?? '(body missing)'}</article>
		<div class="items-center justify-items-center self-center">
			<img src="/images/robot.gif" alt="robot" width="480" height="360" />
		</div>
	</div>
{/if}
