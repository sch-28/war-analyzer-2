<script lang="ts">
	import type { War } from '$root/types/data';
	import { getContext } from 'svelte';
	const { close } = getContext('simple-modal') as any;
	import { manager } from '$root/components/store';

	export let war: War;

	async function delete_war(e: Event) {
		e.preventDefault();
		//TODO
		//$manager.delete_war(war.id);
		//$manager.wars = $manager.wars.filter((w) => w.id != war.id);
		const result = await fetch('/api/delete', {
			method: 'DELETE',
			body: JSON.stringify({
				name: war.name,
				date: war.date
			})
		});
		close();
		window.location.reload();
	}
</script>

<div class="wrapper ">
	<h2>Are you sure?</h2>
	<span> This action cannot be undone. The war will be completly wiped from the database. </span>

	<div class="control is-flex submit_control">
		<button class="button" on:click={close}>Cancel</button>
		<button class="button is-danger" on:click={delete_war}>Delete</button>
	</div>
</div>

<style>
	h2 {
		color: #fff;
	}
	.submit_control {
		margin-top: 12px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		text-align: center;
	}

	span {
		color: #fff;
		font-size: var(--font-10);
		line-height: 1.3;
		display: block;
	}
</style>
