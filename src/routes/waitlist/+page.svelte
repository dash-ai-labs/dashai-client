<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<div class="waitlist-page-container">
	{#if visible}
		<div class="waitlist-card" in:fly={{ y: 20, duration: 600 }}>
			<div class="waitlist-header">
				<div class="waitlist-icon">🚀</div>
				<h1 in:fade={{ delay: 300 }}>You're on the waitlist!</h1>
			</div>
			<div class="waitlist-image-container">
				<img class="waitlist-image" src="/images/group_dash.png" alt="waitlist" />
			</div>
			<div class="waitlist-content">
				<p>
					To ensure we can provide the best experience for you and our existing users, we're
					currently onboarding users on a first-come, first-served basis.
				</p>
				<p>We'll notify you when you're approved.</p>

				<div class="divider"></div>

				<div class="waitlist-skip-container">
					<h2>Want to skip the line?</h2>
					<div class="waitlist-skip-info">
						<p>
							Post about what feature got you excited to join Dash AI on X (formerly Twitter) and
							we'll approve you instantly.
						</p>
						<p>
							Tag <a href="https://twitter.com/getDashAI" target="_blank" rel="noopener noreferrer"
								>@getDashAI</a
							> so we can find you!
						</p>
					</div>

					<a
						href="https://twitter.com/intent/tweet?text=I'm excited to join @getDashAI because..."
						class="twitter-btn"
						target="_blank"
						rel="noopener noreferrer"
					>
						Post on <img src="/images/x_logo.png" alt="X" class="twitter-logo" />
					</a>
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
		padding: 40px 20px 0;
	}

	.waitlist-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.waitlist-content {
		display: flex;
		flex-direction: column;
		padding: 32px 40px 40px;
		text-align: left;
		line-height: 1.6;
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

	h2 {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 16px;
		color: #f0f0f0;
	}

	p {
		margin-bottom: 16px;
		color: #e0e0e0;
	}

	.divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-primary-dark-gray), transparent);
		margin: 24px 0;
	}

	.waitlist-skip-container {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 24px;
		margin-top: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.waitlist-skip-info {
		margin-bottom: 24px;
	}

	a {
		color: #3a9bf4;
		text-decoration: none;
		transition: color 0.2s;
	}

	a:hover {
		color: #5daefd;
		text-decoration: underline;
	}

	.twitter-btn {
		display: inline-block;
		background-color: var(--color-primary-hazy-black);
		color: white;
		padding: 12px 24px;
		border-radius: 30px;
		font-weight: 600;
		text-align: center;
		transition: all 0.2s;
		text-decoration: none;
		border: none;
		cursor: pointer;
		display: flex;
		width: fit-content;
		justify-content: center;
		align-items: center;
	}

	.twitter-btn:hover {
		color: white;
		background-color: var(--color-primary-container);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px var(--color-primary-dark-gray);
		text-decoration: none;
	}

	.twitter-logo {
		width: 30px;
		height: 30px;
		margin-left: 6px;
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
