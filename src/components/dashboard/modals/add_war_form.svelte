<script lang="ts">
	import { Log } from '$root/types/data';
	import { toast } from '@zerodevx/svelte-toast';
	import dayjs, { Dayjs } from 'dayjs';
	import { afterUpdate, getContext } from 'svelte';
	import { manager } from '../../store';

	const { close } = getContext('simple-modal') as any;

	let files: FileList;
	let name: string = '';
	let guild_name: string = 'Guild';
	let date: string = dayjs().format('YYYY-MM-DD');
	let is_nodewar = 1;
	let form: HTMLFormElement;

	let form_validity = false;

	let error = '';

	let loaded_logs: Log[] = [];
	$: {
		if (files && files.length > 0) {
			check_file(files[0]);
		}
	}

	afterUpdate(() => {
		const valid_war = $manager.is_valid_war(date, name);
		form_validity = valid_war && form && form.checkValidity();

		if (!valid_war) {
			error = 'War already exists';
		} else if (valid_war && !form_validity) {
			error = 'Fill out all inputs';
		} else {
			error = '';
		}
	});

	async function check_file(file: File) {
		try {
			const result = await load_data(file);
			loaded_logs = result;
			if (name.length == 0) {
				name = file.name.split('.')[0];
				/* form_validity = form && !form.checkValidity(); */
			}
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
			const result = $manager.add_war(guild_name, name, date, !!is_nodewar, loaded_logs);
			if (!result) {
				toast.push('Duplicate War', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			} else {
				$manager = $manager;
				close();
			}
		}
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
		<div class="field">
			<label class="label " for="file">Logs</label>
			<div class="file is-dark" class:has-name={files && files.length > 0}>
				<label class="file-label">
					<input class="file-input" type="file" id="file" name="resume" bind:files required />
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
				<label class="label " for="date">Date</label>
				<div class="control">
					<input class="input is-dark " type="date" id="date" required bind:value={date} />
				</div>
			</div>
		</div>

		<div class="field guild_name">
			<label class="label " for="guild_name">Guild Name </label>
			<div class="control">
				<input
					class="input is-dark"
					type="text"
					placeholder="Text input"
					id="guild_name"
					required
					bind:value={guild_name}
				/>
			</div>
		</div>

		<!-- <div class="control">
			<label class="radio">
				<input type="radio" name="answer" value={1} bind:group={is_nodewar} />
				Nodewar
			</label>
			<label class="radio">
				<input type="radio" name="answer" value={0} bind:group={is_nodewar} />
				GvG
			</label>
		</div> -->

		<div class="control submit_control">
			<button class="button is-link" on:click={add_war} disabled={!form_validity}>Add</button>
			{#if error.length > 0}
				<span>{error}</span>
			{/if}
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
		align-items: center;
	}
	.inline .field {
		width: 100%;
		margin-bottom: 0;
	}

	.file-cta,
	.file-name,
	input {
		font-size: 1rem;
		color: #fff;
		border-color: var(--color-bg-secondary);
	}

	.guild_name {
		width: calc(50% - 7.5px);
	}

	.file-cta {
		background-color: var(--color-bg-secondary);
	}

	.submit_control {
		margin-top: 22px;
		display: flex;
		align-items: center;
		gap: 10px;
		text-align: center;
	}

	.submit_control span {
		color: var(--color-danger);
	}
</style>
