<script lang="ts">
	import { manager } from '$root/components/store';
	import { onMount } from 'svelte';
</script>

<div class="wars">
	{#each $manager.wars as war}
		<div class="war">
			<strong>{war.name}</strong>
			{war.date}
			<br />
			Players: {war.players.length}
		</div>
	{/each}
</div>
