<script lang="ts">
	import { getContext } from 'svelte';
	import AddWar from '$root/components/dashboard/modals/add_war_form.svelte';
	const { open } = getContext('simple-modal') as any;
	function open_add_war() {
		open(AddWar);
	}
</script>

<button class="button is-link" on:click={open_add_war}>Add War</button>

