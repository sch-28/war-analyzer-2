<script lang="ts">
	import AddWarButton from '$root/components/dashboard/modals/add_war_button.svelte';
	import EditWarButton from '$root/components/dashboard/modals/edit_war_button.svelte';
	import { Manager, manager } from '$root/components/store';
	import Modal from 'svelte-simple-modal';
	import ShareWarButton from '$root/components/dashboard/share_war_button.svelte';
	import DeleteWarButton from './modals/delete_war_button.svelte';
	import { browser } from '$app/environment';

	let sort_dropdown = false;
	let sort_by: 'added' | 'date' = 'added';

	$: {
		sort_by;
	}

	export let is_shared = false;

	let selected_manager = $manager;
	if (is_shared && $manager.user && browser) {
		selected_manager = new Manager();
		for (let war of $manager.user.wars) {
			selected_manager.add_war(war.guild_name, war.name, war.date, war.is_nodewar, war.logs)!;
		}
	}
</script>

<nav class="level">
	<!-- Left side -->
	<div class="level-left">
		<p class="level-item">
			{#if !is_shared}
				<strong>Wars</strong>
			{:else}
				<strong>Shared Wars</strong>
			{/if}
		</p>
	</div>

	<!-- Right side -->
	<div class="level-right">
		<div
			class="dropdown level-item"
			on:click={() => (sort_dropdown = !sort_dropdown)}
			class:is-active={sort_dropdown}
		>
			<div class="dropdown-trigger">
				<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
					<i class="fa-solid fa-arrow-down-wide-short has-text-black" />
					<span>{sort_by}</span>
					<span class="icon is-small ">
						<i
							class="fas fa-angle-down has-text-black"
							aria-hidden="true"
							class:turn={sort_dropdown}
						/>
					</span>
				</button>
			</div>
			<div class="dropdown-menu" id="dropdown-menu" role="menu">
				<div class="dropdown-content">
					<a href={''} on:click={() => (sort_by = 'added')} class="dropdown-item"> Added </a>
					<a href={''} on:click={() => (sort_by = 'date')} class="dropdown-item"> Date </a>
				</div>
			</div>
		</div>

		<p class="level-item mr-2">
			<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
				<AddWarButton />
			</Modal>
		</p>
	</div>
</nav>
<div class="wars">
	<div class="list has-hoverable-list-items">
		{#each selected_manager.get_wars(sort_by) as war}
			<div class="list-item">
				<a href="/dashboard/war/{war.id}" class="war_link">
					<div class="list-item-content">
						<div class="list-item-title">{war.name}</div>
						<div class="list-item-description">{war.formatted_date}</div>
					</div>
					<div class="kd">
						{war.kill_events.length} - {war.death_events.length}
					</div>
					<div class="guilds">
						{#each war.enemy_guilds as local_guild}
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
						<ShareWarButton {war} />
						{#if !is_shared}
							<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
								<EditWarButton {war} />
							</Modal>
						{:else}
							<Modal
								closeButton={false}
								styleWindow={{ background: 'var(--color-bg-primary)', width: '30rem' }}
							>
								<DeleteWarButton {war} />
							</Modal>
						{/if}
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
	nav {
		height: 10%;
		min-height: 10%;
		margin: 0 !important;
	}
	.guild {
		display: inline-block;
		width: 100px;
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.dropdown-menu {
		min-width: 131px;
		left: unset;
	}
	.dropdown-trigger button > span:first-of-type {
		width: 50px;
		text-transform: capitalize;
		text-align: left;
	}
	.dropdown-trigger button {
		display: flex;
		gap: 5px;
	}

	.icon i {
		transition: all 225ms;
	}
	i.turn {
		transform: rotate(-180deg);
	}
</style>
