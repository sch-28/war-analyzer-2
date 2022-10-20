<script lang="ts">
	import type { War } from '$root/types/data';
	import { getContext } from 'svelte';
	const { close } = getContext('simple-modal') as any;
	import dayjs from 'dayjs';
	import { manager } from '$root/components/store';
	import { goto } from '$app/navigation';
	let form: HTMLFormElement;

	export let war: War;

	let new_date: string;
	let new_name = '';
	let new_is_nodewar = 0;

	let error = '';

	$: {
		if (war) {
			init_values();
		}
	}

	function init_values() {
		new_date = dayjs(war.date).format('YYYY-MM-DD');
		new_name = war.name;
		new_is_nodewar = +war.is_nodewar;
	}

	let form_validity = false;

	$: {
		new_is_nodewar;
		new_date;
		new_name;

		const valid_war = $manager.is_valid_war(new_date, new_name);
		form_validity = valid_war && form && form.checkValidity();

		if (!valid_war) {
			error = 'War already exists';
		} else if (valid_war && !form_validity) {
			error = 'Fill out all inputs';
		} else {
			error = '';
		}
	}

	function edit_war(e: Event) {
		e.preventDefault();
		war.date = new_date;
		war.name = new_name;
		war.is_nodewar = !!new_is_nodewar;

		$manager = $manager;

		close();
	}

	function delete_war(e: Event) {
		e.preventDefault();
		//TODO
		//$manager.delete_war(war.id);
		$manager.wars = $manager.wars.filter((w) => w.id != war.id);

		window.location.reload();
		close();
	}
</script>

<div class="wrapper ">
	<h2>{war.name}</h2>
	<form action="" bind:this={form}>
		<div class="field inline">
			<div class="field ">
				<label class="label " for="name">Name</label>
				<div class="control">
					<input
						class="input is-dark"
						type="text"
						placeholder="Text input"
						id="name"
						required
						bind:value={new_name}
					/>
				</div>
			</div>
			<div class="field ">
				<label class="label " for="name">Date</label>
				<div class="control">
					<input class="input is-dark " type="date" id="name" required bind:value={new_date} />
				</div>
			</div>
		</div>
		<div class="control">
			<label class="radio">
				<input type="radio" name="answer" value={1} bind:group={new_is_nodewar} />
				Nodewar
			</label>
			<label class="radio">
				<input type="radio" name="answer" value={0} bind:group={war.is_nodewar} />
				GvG
			</label>
		</div>

		<div class="control is-flex submit_control">
			<button class="button is-link" on:click={edit_war} disabled={!form_validity}>Edit</button>
			{#if error.length > 0}
				<span>{error}</span>
			{/if}
			<button class="button is-danger ml-auto" on:click={delete_war} 
				>Delete</button
			>
		</div>
	</form>
</div>

<style>
	h2 {
		color: #fff;
	}
	.inline {
		display: flex;
		width: 100%;
		gap: 15px;
	}
	.inline .field {
		width: 100%;
	}

	input {
		font-size: 1rem;
		color: #fff;
		border-color: var(--color-bg-secondary);
	}

	.submit_control {
		margin-top: 12px;
		display: flex;
		align-items: center;
		gap: 10px;
		text-align: center;
	}

	.submit_control span {
		color: var(--color-danger);
	}
</style>
