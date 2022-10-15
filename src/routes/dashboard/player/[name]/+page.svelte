<script lang="ts">
	import { page } from '$app/stores';
	import FormattedNumber from '$root/components/dashboard/formatted_number.svelte';
	import { manager } from '$root/components/store';
	import type { Player } from '$root/types/data';
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import { format, tag_compare } from '$root/components/utils';
	import type { VNode } from 'preact';
	let player: Player | undefined;

	$: {
		const player_name = $page.params.name;
		if (player_name) {
			player = $manager.get_player(player_name);
			if (player) update_grid(player);
		}
	}

	let grid_data: {
		id: number;
		date: string;
		kills: number;
		deaths: number;
		performance: VNode<{}>;
	}[] = [];
	let grid: Grid;
	let show_grid_header = false;

	$: grid?.$on('ready', () =>
		grid.$$.root
			.querySelector('.gridjs-wrapper')!
			.addEventListener('scroll', function (this: Element) {
				show_grid_header = this.scrollTop > 50;
			})
	);

	function update_grid(player: Player) {
		const new_data = [];
		for (let local_player of player.locals) {
			new_data.push({
				id: local_player.local_guild.war.id,
				date: local_player.local_guild.war.formatted_date,
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
				duration: html(
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
			name: 'id',
			hidden: true
		},
		{
			name: 'Date',
			width: '15%',
			attributes: {
				title: 'Date of War'
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
			name: 'duration',
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
		const id = event.detail[1]._cells[0].data;
		goto(`/dashboard/war/${id}`);
	}
</script>

{#if player}
	<nav class="level ">
		<!-- Left side -->
		<div class="level-left">
			<div class="top_lvl level-item is-flex is-flex-direction-column is-align-items-flex-start ">
				<div class="level-item">
					<a class=" level-item icon is-small has-text-white" href="/dashboard/player">
						<i class="fas fa-arrow-left " />
					</a>
					<div class="level-item war_title">
						<strong>{player.name}</strong>
					</div>
				</div>
				<div class="subtitle list-item-description ">
					<!--  {war.formatted_date} -->
				</div>
			</div>
		</div>

		<!-- Right side -->
		<div class="level-right">
			<div class="level-item" />
		</div>
	</nav>

	<!-- 	<div class="tile leaderboard">
		<div class="list has-hoverable-list-items has-visible-pointer-controls ">
			{#each player.locals as local, index}
				<div class="list-item ">
					<a href="/dashboard/war/{local.local_guild.war.id}" class="war_link">
						<div class="list-item-content">
							<div class="list-item-title">{local.local_guild.war.name}</div>
							<div class="list-item-description">{local.local_guild.war.formatted_date}</div>
						</div>
						<div class="stat">
							{local.kills} - {local.deaths}
						</div>
						<div class="stat">
							<FormattedNumber number={local.performance} neutral={1} />
						</div>
						<div class="stat">
							<FormattedNumber
								number={local.join_duration_percentage * 100}
								neutral={0.75}
								places={0}
								after="%"
							/>
						</div>
					</a>
					<div class="list-item-controls">
						
					</div>
				</div>
			{/each}
		</div>
	</div> -->
	<div class="tile is-ancestor p-3">
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
		<div class="tile stats">
			<div class="stat">
				<span>Participated</span>
				<span>
					<FormattedNumber
						number={player.participation_percentage * 100}
						neutral={50}
						after="%"
						places={0}
					/> ({player.locals.length}/{player.guild.locals.length})
				</span>
			</div>
			<div class="stat">
				<span>Average Performance</span>
				<FormattedNumber number={player.average_performance} neutral={1} />
			</div>
			<div class="stat">
				<span>Average Join Duration</span>
				<FormattedNumber
					number={player.average_duration_percentage * 100}
					neutral={75}
					after="%"
					places={0}
				/>
			</div>
			<div class="stat">
				<span>Average Kills</span>
				{format(player.average_kills)}
			</div>
			<div class="stat">
				<span>Average Deaths</span>
				{format(player.average_deaths)}
			</div>
		</div>
	</div>
{/if}

<style>

	strong {
		color: white;
		font-size: var(--font-18);
	}
	.is-ancestor {
		gap: 25px;
		height: 90%;
	}
	.stat {
		display: flex;
		flex-direction: column;
	}
	.stats {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 26px 24px;
	}
</style>
