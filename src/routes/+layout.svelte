<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { user } from '$lib/store';
	console.log('layout');
	user.subscribe(($user) => {
		console.log($user);
		if (!$user) {
			goto('/auth');
		}
	});
</script>

<slot />
