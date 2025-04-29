<script>
	import { goto } from '$app/navigation';
	import AuthScreenBackgroundVector from '$lib/assets/AuthScreenBackgroundVector.svelte';
	import GoogleLogo from '$lib/assets/GoogleLogo.svelte';
	import { initiateGoogleLogin, initiateOutlookLogin } from '$lib/api/auth';
	import Logo_Login from '$lib/assets/Logo_Login.svelte';
	import OutlookLogo from '$lib/assets/OutlookLogo.svelte';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	onMount(() => {
		user.subscribe(($user) => {
			if ($user && $user.id) {
				// Redirect to the login page
				goto('/inbox');
				return;
			}
		});
	});
</script>

<div class="auth-container">
	<div class="auth-content">
		<div class="vector-container">
			<AuthScreenBackgroundVector />
			<div class="logo-container"><Logo_Login height="254" width="250" /></div>
		</div>
		<div class="form-container">
			<div class="welcome-section">
				<div class="welcome-content">
					<div class="welcome-title">Welcome</div>
					<div>Your AI dashboard awaits...</div>
				</div>
				<button onclick={initiateGoogleLogin} class="google-button">
					<div class="button-content">
						<GoogleLogo />Sign In with Google
					</div>
				</button>
				<button onclick={initiateOutlookLogin} class="outlook-button">
					<div class="button-content">
						<OutlookLogo />Sign In with Outlook
					</div>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.auth-container {
		height: 100vh;
		width: 100%;
		background-color: var(--color-primary-black);
	}

	.auth-content {
		display: flex;
		flex-direction: row;
	}

	.logo-container {
		margin-top: -6rem; /* -mt-24 (24px = 6rem) */
	}

	.form-container {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		color: var(--color-font-light-gray);
	}

	.welcome-section {
		margin-top: 200px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-self: center;
	}

	.welcome-content {
		/* Container for welcome text */
	}

	.welcome-title {
		font-size: 1.5rem; /* text-2xl */
		font-weight: 700; /* font-bold */
	}

	.google-button {
		width: 360px;
		border-radius: 0.375rem; /* rounded-md */
		border: 1px solid var(--color-primary-gray);
		background-color: var(--color-primary-container);
		padding: 0.25rem 0.5rem; /* px-2 py-1 */
	}

	.outlook-button {
		width: 360px;
		border-radius: 0.375rem; /* rounded-md */
		border: 1px solid var(--color-primary-gray);
		background-color: var(--color-primary-container);
		padding: 0.25rem 0.5rem; /* px-2 py-1 */
	}

	.button-content {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 0.75rem; /* gap-3 */
	}
</style>
