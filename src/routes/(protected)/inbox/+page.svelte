<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_TAG_ID } from '$env/static/public';
	import { onMount } from 'svelte';

	const initializeGoogleAnalytics = () => {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'gtm.start': new Date().getTime(),
			event: 'gtm.js'
		});
		var f = document.getElementsByTagName('script')[0],
			j = document.createElement('script'),
			dl = 'dataLayer' != 'dataLayer' ? '&l=' + 'dataLayer' : '';
		j.async = true;
		j.src = 'https://www.googletagmanager.com/gtm.js?id=' + `GTM-${PUBLIC_TAG_ID}` + dl;
		f.parentNode?.insertBefore(j, f);
	};
	onMount(() => {
		initializeGoogleAnalytics();
	});

	$effect(() => {
		goto('/inbox/actionable');
	});
</script>

<!-- LinkedIn tracking noscript fallback -->
<noscript>
	<img
		height="1"
		width="1"
		style="display:none;"
		alt=""
		src="https://px.ads.linkedin.com/collect/?pid=7727372&fmt=gif"
	/>
</noscript>
