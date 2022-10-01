<script lang="ts">
	import '../app.scss';
	import Header from '$root/components/header.svelte';
</script>

<div class="body">
	<img src="/images/background.jpg" alt="test" class="background" />
	<Header />
	<slot />
</div>

<style>
	.body {
		width: 95%;
		max-width: 1448px;
		margin: 0 auto;
		height: 100%;
	}

	.background {
		top: 0;
		position: absolute;
		object-fit: cover;
		width: 100%;
		height: 100%;
		left: 0;
		filter: opacity(0.15) blur(10px);
		z-index: 0;
		pointer-events: none;
	}
</style>
