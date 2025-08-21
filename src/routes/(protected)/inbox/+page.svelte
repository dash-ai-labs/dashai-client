<script lang="ts">
	import { goto } from '$app/navigation';

	$effect(() => {
		goto('/inbox/actionable');
	});
</script>
