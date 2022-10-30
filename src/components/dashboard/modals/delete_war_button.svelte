<script lang="ts">
	import { getContext } from 'svelte';
	import type { War } from '$root/types/data';
	import DeleteWarForm from './delete_war_form.svelte';
	const { open } = getContext('simple-modal') as any;
	export let war: War;

	function open_add_war() {
		open(DeleteWarForm, { war: war });
	}
</script>

<button class="button is-danger" on:click={open_add_war}
	><span class="icon is-small ">
		<i class="fa-solid fa-trash" />
	</span>
	<span>Delete</span></button
>
