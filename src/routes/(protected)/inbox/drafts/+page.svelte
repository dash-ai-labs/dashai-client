<script lang="ts">
	import EmailContainer from '$lib/components/EmailContainer.svelte';
	import { EmailFolder } from '$lib/types';
</script>

<div class="inbox-container">
	<div class="inbox-content">
		<!-- <div class="inbox-title-row">
			<div class="inbox-title">Inbox</div>

			<div class="inbox-actions">
				<PrimaryButton on:click={modalComponentForm}>+ Email Label</PrimaryButton>
			</div>
		</div> -->
		<!-- <Widgets /> -->
		<EmailContainer folder={EmailFolder.DRAFTS} />
	</div>
</div>
