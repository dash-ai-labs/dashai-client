<script lang="ts">
	import '../app.css';
	import { user } from '$lib/store';

	user.subscribe(($user) => {
		if (!$user) {
			return { status: 302, redirect: '/auth' };
		}
	});
</script>

<slot />
