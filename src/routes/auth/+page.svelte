<script>
	import { initiateGoogleLogin } from '$lib/auth';
</script>

<div>
	<button on:click={initiateGoogleLogin}>Sign In with Google</button>
</div>
