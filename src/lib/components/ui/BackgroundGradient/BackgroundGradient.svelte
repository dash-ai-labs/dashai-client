<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Motion } from 'svelte-motion';

	export let className: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;
	export let animate: boolean | undefined = true;

	const variants = {
		initial: {
			backgroundPosition: '0 50%'
		},
		animate: {
			backgroundPosition: ['0, 20%', '50% 20%', '0 20%']
		}
	};
</script>

<div class={cn('group relative p-[2px]', containerClassName)}>
	<Motion
		let:motion
		variants={animate ? variants : undefined}
		initial={animate ? 'initial' : undefined}
		animate={animate ? 'animate' : undefined}
		transition={animate
			? {
					duration: 5,
					repeat: Infinity,
					repeatType: 'reverse'
				}
			: undefined}
		style={{
			backgroundSize: animate ? '100% 100%' : undefined
		}}
	>
		<div
			use:motion
			class={cn(
				'absolute inset-0 z-[1] rounded-lg opacity-60 blur-xl transition  duration-500 group-hover:opacity-100',
				' bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]'
			)}
		/>
	</Motion>

	<Motion
		let:motion
		variants={animate ? variants : undefined}
		initial={animate ? 'initial' : undefined}
		animate={animate ? 'animate' : undefined}
		transition={animate
			? {
					duration: 5,
					repeat: Infinity,
					repeatType: 'reverse'
				}
			: undefined}
		style={{
			backgroundSize: animate ? '200% 200%' : undefined
		}}
	>
		<div
			use:motion
			class={cn(
				'absolute inset-0 z-[1] rounded-lg',
				'bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]'
			)}
		/>
	</Motion>

	<div class={cn('relative z-10', className)}><slot /></div>
</div>
