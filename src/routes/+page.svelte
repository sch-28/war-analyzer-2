<script lang="ts">
	import Logs from '$root/components/home/logs.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="landing">
	<span class="sub">Black Desert Online Tool</span>
	<h1>Nodewar Analyzer</h1>
	<span>A website allowing you to analyze your combat logs from Nodewars and GvGs</span>
	<br />
	<a class="button is-primary" data-sveltekit-prefetch href="/dashboard">Get Started</a>
</section>

<section class="guide">
	<div class="text">
		<h2>More than boring Logs</h2>
		<span
			>Find out more about each individual Member and see who performs best. Keep track of your
			enemies and their numbers to gain a competitive advantage.
		</span>
	</div>
	<Logs />
</section>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 430px;
		text-align: center;
		height: calc(100vh - 72px);
		padding-bottom: 200px;
	}
	.landing h1 {
		margin-bottom: 10px;
	}

	.landing span {
		font-weight: 100;
	}

	a.button.is-primary:hover {
		color: white !important;
	}

	.sub {
		color: var(--color-brand);
	}

	.guide {
		display: flex;
		width: 75%;
		gap: 60px;
	}

	.guide .text {
		width: 68%;
	}

	.guide .text span {
		text-align: center;
		display: block;
	}

	section {
		margin-left: auto;
		margin-right: auto;
	}
</style>
