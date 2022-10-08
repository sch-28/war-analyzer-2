<script lang="ts">
	import { getContext } from 'svelte';
	import type { War } from '$root/types/data';
	import EditWarForm from './edit_war_form.svelte';
	const { open } = getContext('simple-modal') as any;
	export let war: War;

	function open_add_war() {
		open(EditWarForm, { war: war });
	}
</script>

<button class="button" on:click={open_add_war}
	><span class="icon is-small">
		<i class="fas fa-edit" />
	</span>
	<span>Edit</span></button
>
