<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import type { VNode } from 'preact';
	import { format, tag_compare } from '$root/components/utils';
	import type { Guild, Player } from '$root/types/data';
	import { manager } from '$root/components/store';
	import { page } from '$app/stores';

	let grid_data: {
		name: string;
		kills: number;
		deaths: number;
		performance: VNode<{}>;
		duration: VNode<{}>;
		joined: number;
	}[] = [];
	let grid: Grid;
	let show_grid_header = false;

	let guild: Guild | undefined;

	$: {
		const guild_name = $page.params.name;
		if (guild_name) {
			guild = $manager.get_guild(guild_name);
			if (guild) update_grid(guild);
		}
	}

	$: grid?.$on('ready', () =>
		grid.$$.root
			.querySelector('.gridjs-wrapper')!
			.addEventListener('scroll', function (this: Element) {
				show_grid_header = this.scrollTop > 50;
			})
	);

	function update_grid(guild: Guild) {
		const new_data = [];
		for (let player of guild.sorted_player) {
			new_data.push({
				name: player.name,
				kills: +format(player.average_kills),
				deaths: +format(player.average_deaths),
				performance: html(
					`<i class="${
						player.average_performance >= 1
							? player.average_performance > 1
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(player.average_performance)}</i>`
				),
				duration: html(
					`<i class="${
						player.average_duration_percentage >= 0.75
							? player.average_duration_percentage > 0.75
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(player.average_duration_percentage * 100, 0)}%</i>`
				),
				joined: player.locals.length
			});
		}
		grid_data = new_data;
	}
	const columns = [
		{
			name: 'Name',
			id: 'name',
			width: '15%',
			attributes: {
				title: 'Name'
			}
		},
		{
			name: 'Avg. Kills',
			id: 'kills',
			width: '10%',
			attributes: {
				title: 'Average Kills'
			}
		},
		{
			name: 'Avg. Deaths',
			id: 'deaths',
			width: '10%',
			attributes: {
				title: 'Average Deaths'
			}
		},
		{
			name: 'Avg. Performance',
			id: 'performance',
			width: '10%',
			attributes: {
				title: 'Average Performance'
			},
			sort: {
				compare: tag_compare
			}
		},
		{
			name: 'duration',
			width: '10%',
			attributes: {
				title: 'Average Join Duration Percentage'
			},
			sort: {
				compare: tag_compare
			}
		},
		{
			name: 'joined',
			attributes: {
				title: 'Number of Nodewars joined'
			},
			width: '10%'
		}
	];

	function open_player(event: CustomEvent) {
		const name = event.detail[1]._cells[0].data;
		goto(`/dashboard/player/${name}`);
	}
</script>

{#if guild}
	<nav class="level ">
		<!-- Left side -->
		<div class="level-left">
			<div class="top_lvl level-item is-flex is-flex-direction-column is-align-items-flex-start ">
				<div class="level-item">
					<a class=" level-item icon is-small has-text-white" href="/dashboard/guild">
						<i class="fas fa-arrow-left " />
					</a>
					<div class="level-item war_title">
						<strong>{guild.name}</strong>
					</div>
				</div>
			</div>
			<div class="subtitle list-item-description " />
		</div>

		<!-- Right side -->
		<div class="level-right">
			<div class="level-item" />
		</div>
	</nav>

	<div class="tile is-ancestor">
		<div class="tile pt-3 pb-3 is-7 ">
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
				<span>Average Kills</span>
				<span>{format(guild.average_kills)}</span>
			</div>
			<div class="stat">
				<span>Average Deaths</span>
				<span>{format(guild.average_deaths)}</span>
			</div>
			<div class="stat">
				<span>Nodewars</span>
				<span>{guild.locals.length}</span>
			</div>
			<div class="stat">
				<span>Average Kill Difference</span>
				<span>{format(guild.average_kill_difference)}</span>
			</div>
			<div class="stat">
				<span>Average Members</span>
				<span>{format(guild.average_members)}</span>
			</div>
			<div class="stat">
				<span>Total Members</span>
				<span>{guild.players.length}</span>
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
	strong {
		color: white;
		font-size: var(--font-18);
	}
	.is-ancestor {
		width: 100%;
		gap: 25px;
		height: 90%;
		max-height: 90%;
		margin: 0;
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
