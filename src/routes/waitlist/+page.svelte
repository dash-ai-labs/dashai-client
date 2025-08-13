<script lang="ts">
	import { createCheckoutSession } from '$lib/api/payment';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

	let visible = false;
	let isLoading = false;
	let errorMessage: string | null = null;

	onMount(() => {
		visible = true;
	});

	async function startTrial() {
		isLoading = true;
		errorMessage = null;
		try {
			const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
			const data: any = await createCheckoutSession();
			const url = data?.url || data?.checkout_url || data?.sessionUrl;
			const sessionId = data?.id || data?.sessionId;

			if (url && typeof url === 'string') {
				window.location.assign(url);
				return;
			}

			if (sessionId && stripe) {
				await stripe.redirectToCheckout({ sessionId });
				return;
			}

			errorMessage = 'Unable to start checkout. Please try again.';
		} catch (err) {
			console.error('Failed to create Stripe checkout session', err);
			errorMessage = 'Something went wrong. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="waitlist-page-container">
	{#if visible}
		<div class="waitlist-card" in:fly={{ y: 20, duration: 600 }}>
			<div class="waitlist-header">
				<div class="waitlist-icon">🚀</div>
				<h1 class="waitlist-title" in:fade={{ delay: 300 }}>Thanks for choosing Dash AI</h1>
			</div>
			<div class="waitlist-image-container">
				<img class="waitlist-image" src="/images/group_dash.png" alt="waitlist" />
			</div>
			<div class="waitlist-content">
				<p class="intro">Please start your free trial below to continue.</p>
				<div class="cta-container">
					<button class="cta-btn" on:click={startTrial} disabled={isLoading} aria-live="polite">
						{isLoading ? 'Redirecting…' : 'Start free trial'}
					</button>
					{#if errorMessage}
						<div class="error-text">{errorMessage}</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.waitlist-page-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		width: 100%;
		padding: 20px;
		background: linear-gradient(135deg, var(--color-primary-hazy-black), #1a1a1a);
	}
	.waitlist-image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		padding: 10px;
		margin-inline: auto;
		width: 400px;
		border-radius: 16px;
		overflow: hidden;
	}
	.waitlist-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 16px;
		border: 1px solid var(--color-primary-dark-gray);
	}
	.waitlist-card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-primary-hazy-black);
		color: white;
		border-radius: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		max-width: 600px;
		width: 100%;
		border: 1px solid var(--color-primary-dark-gray);
		overflow: hidden;
	}

	.waitlist-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30px 8px 16px;
	}

	.waitlist-title {
		font-size: 32px;
		line-height: 1.2;
	}

	.waitlist-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.waitlist-content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 32px 40px 40px;
		text-align: left;
		line-height: 1.6;
	}

	.intro {
		margin-top: 8px;
		margin-bottom: 16px;
		color: #e0e0e0;
		font-size: 18px;
	}

	h1 {
		font-size: 28px;
		font-weight: 700;
		margin-bottom: 8px;
		background: linear-gradient(90deg, #fff, #bbb);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	p {
		margin-bottom: 16px;
		color: #e0e0e0;
	}

	.cta-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 14px 22px;
		border-radius: 12px;
		font-weight: 700;
		font-size: 16px;
		color: #fff;
		background: var(--color-primary-button);
		border: 1px solid rgba(255, 255, 255, 0.12);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}

	.cta-btn:hover:enabled {
		transform: translateY(-1px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
	}

	.cta-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-text {
		color: #ffb4b4;
		font-size: 14px;
	}

	@media (max-width: 768px) {
		.waitlist-content {
			padding: 24px 20px 32px;
		}

		.waitlist-card {
			max-width: 100%;
		}

		h1 {
			font-size: 24px;
		}
	}
</style>
