<script lang="ts">
	import '../app.scss';
	import Header from '$root/components/header.svelte';

	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import type { User } from '$root/types/user';
	import { manager } from '$root/components/store';
	import { page } from '$app/stores';

	export let data: User | undefined;
	let is_migration_info_visible = false;

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

		is_migration_info_visible = localStorage.getItem('migration_info') == null;
	});

	function hide_migration_info() {
		is_migration_info_visible = false;
		localStorage.setItem('migration_info', 'true');
	}
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
	{#if is_migration_info_visible}
		<div class="info is-flex is-flex-direction-column">
			This website is no longer maintained.<br />
			<span
				>Check out my new version at
				<a target="_blank" href="https://ikusa.site">Ikusa.site</a></span
			><br />
			To migrate your data, click: <br />
			<button
				class="button is-dark migrate-button"
				on:click={() => {
					$manager.migrate();
				}}
			>
				Migrate
			</button>

			<button class="close" on:click={hide_migration_info}
				><span class="icon is-small">
					<i class="fas fa-solid fa-x" />
				</span></button
			>
		</div>
	{/if}
	<Header user={data} />
	<slot />
</div>

<style>
	.info {
		position: absolute;
		top: 16px;
		left: 50%;
		transform: translateX(-50%);
		padding: 16px 32px;
		background-color: #f5cd40;
		color: #000;
		font-weight: bold;
		z-index: 100;
		border-radius: 8px;
	}

	.info .close {
		position: absolute;
		top: 4px;
		right: 4px;
		background-color: transparent;
		border: none;
		font-weight: bold;
		z-index: 100;
		border-radius: 100%;
		cursor: pointer;
		padding: 0;
		background-color: #000;
		width: 20px;
		height: 20px;
	}

	.migrate-button {
		margin-right: auto;
		margin-left: auto;
	}

	.body {
		width: 95%;
		max-width: 1448px;
		margin: 0 auto;
		position: relative;
		height: 100vh;
		z-index: 1;
	}
</style>
