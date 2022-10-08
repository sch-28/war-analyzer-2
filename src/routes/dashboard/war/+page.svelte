<script lang="ts">
	import EditWarButton from '$root/components/dashboard/edit_war_button.svelte';
	import { manager } from '$root/components/store';
	import Modal from 'svelte-simple-modal';
</script>

<div class="wars">
	<div class="list has-hoverable-list-items">
		{#each $manager.wars as war}
			<div class="list-item">
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
				<div class="list-item-controls">
					<div class="buttons is-right">
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

	.list-item-title {
		color: #fff;
	}

	.list-item {
		cursor: pointer;
		height: 125px;
	}

	.list-item-content {
		flex-grow: 0;
	}

	.list.has-hoverable-list-items .list-item:hover {
		background-color: rgba(0, 0, 0, 0.1);
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

	.kd {
		margin: 0 auto;
	}
	.guild {
		display: inline-block;
		width: 150px;
	}
</style>
