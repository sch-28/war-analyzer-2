<script lang="ts">
	import AddWarButton from '$root/components/dashboard/add_war_button.svelte';
	import EditWarButton from '$root/components/dashboard/edit_war_button.svelte';
	import { manager } from '$root/components/store';
	import type { War } from '$root/types/data';
	import Modal from 'svelte-simple-modal';
	import type { User } from '$root/types/user';
	import { goto } from '$app/navigation';

	async function share_war(war: War) {
		const result = await fetch('/api/share', {
			method: 'POST',
			body: JSON.stringify(war.to_json())
		});

		goto(`/public/war/${data?.id}/${war.name}/${war.date}`);
	}

	export let data: User | undefined;
</script>

<nav class="level">
	<!-- Left side -->
	<div class="level-left">
		<p class="level-item">
			<strong>Wars</strong>
		</p>
	</div>

	<!-- Right side -->
	<div class="level-right">
		<p class="level-item">
			<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
				<AddWarButton />
			</Modal>
		</p>
	</div>
</nav>
<div class="wars">
	<div class="list has-hoverable-list-items">
		{#each $manager.wars as war}
			<div class="list-item">
				<a href="/dashboard/war/{war.id}" class="war_link">
					<div class="list-item-content">
						<div class="list-item-title">{war.name}</div>
						<div class="list-item-description">{war.formatted_date}</div>
					</div>
					<div class="kd">
						{war.kills.length} - {war.deaths.length}
					</div>
					<div class="guilds">
						{#each war.enemy_local_guilds as local_guild}
							<div class="guild">
								<a href={`/dashboard/guild/${local_guild.guild.name}`}>
									{local_guild.guild.name}
								</a>
							</div>
						{/each}
					</div>
				</a>

				<div class="list-item-controls">
					<div class="buttons is-right">
						<button
							class="button"
							on:click={() => share_war(war)}
							disabled={!data || Object.keys(data).length == 0}
						>
							<span class="icon is-small">
								<i class="fas fa-solid fa-share" />
							</span>
							<span>Share</span></button
						>
						<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
							<EditWarButton {war} />
						</Modal>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.list {
		color: #fff;
		border-radius: var(--radius-base);
	}

	.war_link {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100px;
	}

	.list-item {
		cursor: pointer;
		height: 125px;
	}

	.list-item-content {
		flex-grow: 0;
	}

	.list.has-hoverable-list-items .list-item:hover {
		background-color: var(--hover);
	}

	.guilds {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		height: 100%;
		justify-content: center;
		margin-right: 40%;
		gap: 2px;
	}

	.guilds a:hover {
		color: #3d7de5a6;
	}

	.kd {
		margin: 0 auto;
		color: #fff;
	}
	.guild {
		display: inline-block;
		width: 100px;
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	i.fas {
		color: black;
	}
</style>
