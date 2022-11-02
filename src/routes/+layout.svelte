<script lang="ts">
	import '../app.scss';
	import Header from '$root/components/header.svelte';

	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import type { User } from '$root/types/user';
	import { manager } from '$root/components/store';
	import { page } from '$app/stores';

	export let data: User | undefined;

	if (data && Object.keys(data).length > 0) {
		$manager.user = data;
	}

	onMount(() => {
		const app = new SvelteToast({
			// Set where the toast container should be appended into
			target: document.body,
			props: {
				options: {}
			}
		});
	});
</script>

<svelte:head>
	<meta content={$page.data.title} property="og:title" />
	<meta name="title" content={$page.data.title} />
	<meta content={$page.data.description} property="og:description" />
	<meta name="description" content={$page.data.description} />
	<meta property="twitter:description" content={$page.data.description} />
	<meta content={$page.url.href} property="og:url" />
</svelte:head>

<div class="body">
	<Header user={data} />
	<slot />
</div>

<style>
	.body {
		width: 95%;
		max-width: 1448px;
		margin: 0 auto;
		position: relative;
		height: 100vh;
		z-index: 1;
	}
</style>
