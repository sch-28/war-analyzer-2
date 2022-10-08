<script lang="ts">
	import { Log } from '$root/types/data';
	import { toast } from '@zerodevx/svelte-toast';
	import { getContext } from 'svelte';
	import { manager } from '../store';

	const { close } = getContext('simple-modal') as any;

	let files: FileList;
	let name: string;
	let date: Date;
	let is_nodewar = 1;
	let form: HTMLFormElement;

	let form_validity = false;

	let loaded_logs: Log[] = [];
	$: {
		if (files && files.length > 0) {
			check_file(files[0]);
		}
	}

	$: {
		files;
		name;
		date;
		is_nodewar;

		form_validity = form && !form.checkValidity();
	}

	async function check_file(file: File) {
		try {
			const result = await load_data(file);
			loaded_logs = result;
		} catch (e) {
			console.error(e);
			toast.push('Invalid File', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}

	function add_war(e: Event) {
		e.preventDefault();

		if (loaded_logs && loaded_logs.length > 0) {
			$manager.add_war(name, date, !!is_nodewar, loaded_logs);
			$manager = $manager;
		}

		close();
	}

	async function load_data(file: File) {
		return new Promise<Log[]>((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = function (e: ProgressEvent<FileReader>) {
				const content = this.result as string;
				const results = [
					...content.matchAll(/\[.*\] (\w*) (died to|has killed) (\w*) from (\w*)/g)
				];
				if (results.length > 0) {
					const logs = results.map((log) => Log.parse_log(log[0]));
					resolve(logs);
				} else {
					return reject(new Error('Invalid File'));
				}
			};
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}
</script>

<div class="wrapper ">
	<h2>Add War</h2>
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
						bind:value={name}
					/>
				</div>
			</div>
			<div class="field ">
				<label class="label " for="name">Date</label>
				<div class="control">
					<input
						class="input is-dark "
						type="date"
						placeholder="Text input"
						id="name"
						required
						bind:value={date}
					/>
				</div>
			</div>
		</div>
		<div class="field">
			<div class="file is-dark" class:has-name={files && files.length > 0}>
				<label class="file-label">
					<input class="file-input" type="file" name="resume" bind:files required />
					<span class="file-cta ">
						<span class="file-icon">
							<i class="fas fa-upload" />
						</span>
						<span class="file-label"> Choose a file… </span>
					</span>
					{#if files && files.length > 0}
						<span class="file-name is-dark">{files[0].name}</span>
					{/if}
				</label>
			</div>
		</div>
		<div class="control">
			<label class="radio">
				<input type="radio" name="answer" value={1} bind:group={is_nodewar} />
				Nodewar
			</label>
			<label class="radio">
				<input type="radio" name="answer" value={0} bind:group={is_nodewar} />
				GvG
			</label>
		</div>

		<div class="control">
			<button class="button is-link" on:click={add_war} disabled={form_validity}>Add</button>
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

	.file-cta,
	.file-name,
	input {
		font-size: 1rem;
		color: #fff;
		border-color: var(--color-bg-secondary);
	}

	.file-cta {
		background-color: var(--color-bg-secondary);
	}

	button {
		margin-top: 12px;
	}
</style>
