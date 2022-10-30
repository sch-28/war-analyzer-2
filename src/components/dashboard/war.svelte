<script lang="ts">
	import type { VNode } from 'preact';
	import { page } from '$app/stores';
	import FormNumber from '$root/components/dashboard/formatted_number.svelte';
	import { manager } from '$root/components/store';
	import { format, tag_compare } from '$root/components/utils';
	import type { Local_Guild, War } from '$root/types/data';
	import { Chart, registerables, type ChartData } from 'chart.js';
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import Modal from 'svelte-simple-modal';
	import EditWarButton from '$root/components/dashboard/edit_war_button.svelte';
	import { goto } from '$app/navigation';
	import type { User } from '$root/types/user';
	import ShareWarButton from './share_war_button.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	export let war: War;

	let is_public = false;

	let grid_data: { name: string; kills: number; deaths: number; performance: VNode<{}> }[] = [];
	let grid: Grid;
	let show_grid_header = false;

	let selected_guild: Local_Guild;
	$: grid?.$on('ready', () =>
		grid.$$.root
			.querySelector('.gridjs-wrapper')!
			.addEventListener('scroll', function (this: Element) {
				show_grid_header = this.scrollTop > 50;
			})
	);

	$: {
		selected_guild;
		if (war) update_grid(war);
	}

	$: {
		is_public = !$page.url.href.includes('/dashboard/war/');
	}

	let is_added = false;
	$: {
		is_added = !$manager.is_valid_war(war.date, war.name);
	}

	function add_to_dash() {
		if (!war) return;
		if (!is_added) {
			const w = war.to_json();
			const result = $manager.add_war(w.guild_name, w.name, w.date, w.is_nodewar, w.logs);
			if (!result) {
				toast.push('Duplicate War', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			} else {
				$manager = $manager;
			}
		}

		goto(`/dashboard/war/${war.id}`);
	}

	function update_grid(war: War) {
		if (!selected_guild) selected_guild = war.local_guilds[0];
		const new_data = [];
		for (let local_player of selected_guild.sorted_local_players) {
			new_data.push({
				name: local_player.player.name,
				kills: local_player.kill_events.length,
				deaths: local_player.death_events.length,
				performance: html(
					`<i class="${
						local_player.performance >= 1
							? local_player.performance > 1
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(local_player.performance)}</i>`
				),
				joined: html(
					`<i class="${
						local_player.duration_percentage >= 0.75
							? local_player.duration_percentage > 0.75
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(local_player.duration_percentage * 100, 0)}%</i>`
				)
			});
		}
		grid_data = new_data;
	}

	const columns = [
		{
			name: 'Name',
			width: '30%',
			attributes: {
				title: 'Names'
			}
		},
		{
			name: 'Kills',
			width: '10%',
			attributes: {
				title: 'Kills'
			}
		},
		{
			name: 'Deaths',
			width: '10%',
			attributes: {
				title: 'Deaths'
			}
		},
		{
			name: 'Performance',
			width: '10%',
			attributes: {
				title: 'Performance compared to Average'
			},
			sort: {
				compare: tag_compare
			}
		},
		{
			name: 'joined',
			width: '10%',
			attributes: {
				title: 'Join Duration Percentage'
			},
			sort: {
				compare: tag_compare
			}
		}
	];

	function open_player(event: CustomEvent) {
		if (is_public) return;
		const name = event.detail[1]._cells[0].data;
		goto(`/dashboard/player/${name}`);
	}
</script>

<!-- <canvas bind:this={chart} /> -->
{#if war}
	<nav class="level ">
		<!-- Left side -->
		<div class="level-left">
			<div class="top_lvl level-item is-flex is-flex-direction-column is-align-items-flex-start ">
				<div class="level-item">
					<a class=" level-item icon is-small has-text-white" href="/dashboard/war">
						<i class="fas fa-arrow-left " />
					</a>
					<div class="level-item war_title">
						<strong>{war.name}</strong>
						<i class="list-item-description">{war.formatted_date}</i>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side -->
		<div class="level-right">
			<div class="level-item">
				<!-- <Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
					<EditWarButton {war} />
				</Modal> -->
			</div>
		</div>
	</nav>
	<div class="tile is-ancestor">
		<div class="tile pt-3 pb-3 is-7">
			<div class="grid_content" class:show_header={show_grid_header}>
				<Grid
					on:rowClick={open_player}
					bind:data={grid_data}
					sort
					fixedHeader
					bind:this={grid}
					style={{ th: { 'background-color': 'transparent' } }}
					{columns}
				/>
			</div>
		</div>
		<div class="tile is-vertical">
			<div class="tile leaderboard" class:padding={war.local_guilds.length > 3}>
				<div
					class="list has-hoverable-list-items has-visible-pointer-controls "
					class:scrollable={war.local_guilds.length > 3}
				>
					{#each war.sorted_guilds as local_guild, index}
						<div
							class="list-item "
							on:click={() => (selected_guild = local_guild)}
							class:is-active={selected_guild == local_guild}
						>
							<div class="list-item-image">
								<span class=" level-item icon has-text-white">
									{#if index < 9}
										<i class="fas fa-{index + 1} " />
									{:else}
										<i class="fas fa-{(index + 1).toString()[0]} " />
										<i class="fas fa-{(index + 1).toString()[1]} " />
									{/if}
								</span>
							</div>

							<div class="list-item-content">
								<div class="list-item-title has-text-white">{local_guild.guild.name}</div>
								<div class="list-item-description">
									<span>
										{local_guild.local_players.length} Players
									</span>
								</div>
							</div>

							<div class="list-item-controls">
								<FormNumber
									number={local_guild.kill_difference}
									neutral={0}
									description="Absolute Kill Difference"
								/>
								- <FormNumber number={local_guild.kd} neutral={1} description="Kill/Death Ratio" />
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="tile stats">
				<div class="stat">
					<span>Duration</span>
					<span>{war.duration} minutes</span>
				</div>
				<div class="stat">
					<span>Players</span>
					<span>{war.local_players.length} Players over {war.local_guilds.length} Guilds</span>
				</div>
				<div class="control war_controls">
					<button class="button is-primary" disabled>
						<span class="icon is-small">
							<i class="fas fa-solid fa-download" />
						</span>
						<span>Download</span>
					</button>
					{#if is_public}
						<button class="button is-primary" on:click={add_to_dash}>
							{#if is_added}
								<span class="icon is-small">
									<i class="fas fa-solid fa-list" />
								</span>
								<span>Inspect in dashboard</span>
							{:else}
								<span class="icon is-small">
									<i class="fas fa-solid fa-save" />
								</span>
								<span>Add to dashboard</span>
							{/if}
						</button>
					{:else}
						<ShareWarButton {war} />
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	nav {
		height: 10%;
		min-height: 10%;
		margin: 0 !important;
	}
	.tile.is-vertical {
		background-color: transparent;
		box-shadow: none;
		gap: 25px;
	}
	.scrollable {
		overflow-y: scroll;
		max-height: 100%;
	}

	.leaderboard {
		height: fit-content;
		height: 50%;
	}

	.is-ancestor {
		gap: 25px;
		height: 90%;
		max-height: 90%;
		width: 100%;
		margin: 0;
	}

	.padding {
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}

	strong {
		color: white;
		font-size: var(--font-18);
	}

	.war_title {
		display: flex;
		gap: 5px;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}
	.stat span:first-child {
		font-weight: 600;
	}
	.stat span:last-child {
		font-size: var(--font-10);
	}
	.stats {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 26px 24px;
	}
	:global(.war_controls button) {
		width: 50%;
	}
	.control {
		margin-top: auto;
		display: flex;
		justify-content: center;
		gap: 5px;
	}
</style>
