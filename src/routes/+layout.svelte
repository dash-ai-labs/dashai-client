<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { user } from '$lib/store';
	user.subscribe(($user) => {
		if (!$user) {
			goto('/auth');
		}
	});
</script>

<slot />
