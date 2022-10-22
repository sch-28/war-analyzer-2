<script lang="ts">
	import type { War as WarType } from '$root/types/data';
	import War from '$root/components/dashboard/war.svelte';
	import { page } from '$app/stores';
	import { manager } from '$root/components/store';
	import { error } from '@sveltejs/kit';
	import Error from '$root/routes/+error.svelte';

	let war: WarType | undefined;
	$: {
		const war_id = $page.params.war_id;
		if (war_id) {
			war = $manager.get_war(war_id);
		}
	}
</script>

{#if war}
	<War {war} />
{:else}
	<Error message="War not found" status={404} />
{/if}
