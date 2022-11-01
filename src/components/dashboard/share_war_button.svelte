<script lang="ts">
	import { goto } from '$app/navigation';
	import type { War } from '$root/types/data';
	import { manager } from '../store';

	async function share_war() {
		if (!war || !$manager.user) return;

		if (!is_shared()) {
			const result = await fetch('/api/share', {
				method: 'POST',
				body: JSON.stringify(war.to_json())
			});
			if (result.status == 200) {
				$manager.user.wars.push(war.to_json());
			}
		}
		goto(`/public/war/${$manager.user.id}/${war.name}/${war.date}`);
	}

	function is_shared() {
		if (war == undefined || !$manager.user) return null;

		return $manager.user.wars.find((w) => war && w.date + w.name == war.date + war.name);
	}

	export let war: War | undefined;
</script>

<button class="button is-primary" on:click={() => share_war()} disabled={!war}>
	{#if is_shared()}
		<span class="icon is-small">
			<i class="fas fa-solid fa-globe" />
		</span>
		<span>Public</span>
	{:else}
		<span class="icon is-small">
			<i class="fas fa-solid fa-share" />
		</span>
		<span>Share</span>
	{/if}
</button>
