<script>
	import { initiateGoogleLogin } from '$lib/auth';
	import { user } from '$lib/store';
	import { get } from 'svelte/store';
	user.subscribe(($user) => {
		console.log($user);
	});
</script>

<div>
	<button on:click={initiateGoogleLogin}>Sign In with Google</button>
</div>
