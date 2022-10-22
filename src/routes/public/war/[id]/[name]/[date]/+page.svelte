<script lang="ts">
	import type { War as WarType } from '$root/types/data';
	import War from '$root/components/dashboard/war.svelte';
	import { page } from '$app/stores';
	import { Manager, manager, type Manager_JSON } from '$root/components/store';

	export let data: Manager_JSON;

	const temp_manager = new Manager();
	const war = temp_manager.add_war(data.guild_name, data.name, data.date, data.is_nodewar, data.logs)!;
</script>

<div class="wrapper">
	<War {war} />
</div>

<style>
	.wrapper {
		display: flex;
		height: calc(100vh - 72px);
		padding: 20px 0;
		gap: 25px;
		flex-direction: column;
	}
</style>
