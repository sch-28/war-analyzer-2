<script lang="ts">
	import type { War as WarType } from '$root/types/data';
	import War from '$root/components/dashboard/war.svelte';
	import { page } from '$app/stores';
	import { manager } from '$root/components/store';
	import { error } from '@sveltejs/kit';

	let war: WarType | undefined;
	$: {
		const war_id = $page.params.war_id;
		if (war_id) {
			war = $manager.get_war(war_id);
			//FIXME 500 Wrong Error Code
			if (!war) throw error(404, 'Not found');
		}
	}
</script>

<War {war} />
