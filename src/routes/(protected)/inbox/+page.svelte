<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_LINKEDIN_TAG_ID } from '$env/static/public';
	import { onMount } from 'svelte';

	// LinkedIn tracking setup
	const initializeLinkedInTracking = () => {
		// Declare global variables
		(window as any)._linkedin_partner_id = PUBLIC_LINKEDIN_TAG_ID;
		(window as any)._linkedin_data_partner_ids = (window as any)._linkedin_data_partner_ids || [];
		(window as any)._linkedin_data_partner_ids.push(PUBLIC_LINKEDIN_TAG_ID);

		// Initialize LinkedIn tracking
		if (!(window as any).lintrk) {
			(window as any).lintrk = function (a: any, b: any) {
				(window as any).lintrk.q.push([a, b]);
			};
			(window as any).lintrk.q = [];
		}

		// Inject LinkedIn tracking script
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';

		const firstScript = document.getElementsByTagName('script')[0];
		if (firstScript && firstScript.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		}
	};

	onMount(() => {
		initializeLinkedInTracking();
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
