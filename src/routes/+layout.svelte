<script lang="ts">
	import '../app.css';
	import { user } from '$lib/store';

	user.subscribe(($user) => {
		if (!$user) {
			return { status: 302, redirect: '/auth' };
		}
	});
</script>

<div class="dashboard">
	<slot />
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
		background-color: #1a1a1a;
		color: white;
	}
</style>
