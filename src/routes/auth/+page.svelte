<script>
	import { goto } from '$app/navigation';
	import AuthScreenBackgroundVector from '$lib/assets/AuthScreenBackgroundVector.svelte';
	import GoogleLogo from '$lib/assets/GoogleLogo.svelte';
	import { initiateGoogleLogin } from '$lib/api/auth';
	import Logo from '$lib/assets/Logo.svelte';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	onMount(() => {
		user.subscribe(($user) => {
			if ($user) {
				// Redirect to the login page
				goto('/inbox');
				return;
			}
		});
	});
</script>

<div class="h-screen w-full bg-primary-black">
	<div class="flex flex-row">
		<div>
			<AuthScreenBackgroundVector />
			<div class="-mt-24"><Logo height="254" width="250" /></div>
		</div>
		<div class="flex w-full items-center justify-center text-font-light-gray">
			<div class="mt-[200px] flex flex-col gap-4 self-center">
				<div>
					<div class="text-2xl font-bold">Welcome</div>
					<div>Your AI dashboard awaits...</div>
				</div>
				<button
					onclick={initiateGoogleLogin}
					class=" w-[360px] rounded-md border-[1px] border-primary-gray bg-primary-container px-2 py-1"
					><div class="flex flex-row justify-center gap-3">
						<GoogleLogo />Sign In with Google
					</div></button
				>
			</div>
		</div>
	</div>
</div>
