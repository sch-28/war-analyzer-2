<script lang="ts">
	import { Log } from '$root/types/data';
	import { toast } from '@zerodevx/svelte-toast';

	let files: FileList;
	$: {
		if (files && files.length > 0) {
			check_file(files[0]);
		}
	}

	async function check_file(file: File) {
		try {
			const result = await load_data(file);
		} catch (e) {
			toast.push('Invalid File', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
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
	<form>
		<div class="field inline">
			<div class="field ">
				<label class="label " for="name">Name</label>
				<div class="control">
					<input class="input is-dark" type="text" placeholder="Text input" id="name" />
				</div>
			</div>
			<div class="field ">
				<label class="label " for="name">Date</label>
				<div class="control">
					<input class="input is-dark " type="date" placeholder="Text input" id="name" />
				</div>
			</div>
		</div>
		<div class="field">
			<div class="file is-dark" class:has-name={files && files.length > 0}>
				<label class="file-label">
					<input class="file-input" type="file" name="resume" bind:files />
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
				<input type="radio" name="answer" />
				Nodewar
			</label>
			<label class="radio">
				<input type="radio" name="answer" />
				GvG
			</label>
		</div>

		<div class="control">
			<button class="button is-link" type="submit">Add</button>
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
