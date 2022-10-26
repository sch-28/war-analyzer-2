<script lang="ts">
	import type { War as WarType } from '$root/types/data';
	import War from '$root/components/dashboard/war.svelte';
	import { page } from '$app/stores';
	import { Manager, manager, type War_JSON } from '$root/components/store';

	export let data: War_JSON;

	const temp_manager = new Manager();
	const war = temp_manager.add_war(
		data.guild_name,
		data.name,
		data.date,
		data.is_nodewar,
		data.logs
	)!;
</script>

<svelte:head>
	<title>{war.name}</title>
	<meta content={war.name} property="og:title" />
	<meta content="Site Description" property="og:description" />
	<meta content={$page.url.href} property="og:url" />
</svelte:head>

<div class="wrapper">
	<War {war} />
</div>

<style>
	.wrapper {
		display: flex;
		height: calc(100vh - 72px);
		padding-bottom: 20px;
		flex-direction: column;
	}
</style>
