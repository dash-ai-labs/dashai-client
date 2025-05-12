<script lang="ts">
</script>

<div class="settings-container">
	<div>
		<h1 class="settings-header">Settings</h1>
		<div class="settings-description">Manage your preferences here</div>
	</div>
	<slot />
</div>

<style>
	.settings-container {
		display: flex;
		flex-direction: column;
		padding-inline: 10px;
		padding-block: 20px;
	}
	.settings-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24px;
		padding-block: 8px;
	}
	.settings-description {
		color: var(--color-primary-gray);
	}
</style>
