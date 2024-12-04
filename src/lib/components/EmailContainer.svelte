<script lang="ts">
	import type { Email } from '$lib/email';
	import EmailDetailView from './EmailDetailView.svelte';
	import EmailList from './EmailList.svelte';

	let email: Email | undefined = undefined;

	const selectEmail = (event) => {
		email = event.detail;
	};
</script>

<div>
	<div class="flex flex-row gap-[20px] py-[20px]">
		<EmailList on:selectEmail={selectEmail} />
		<EmailDetailView {email} />
	</div>
</div>
