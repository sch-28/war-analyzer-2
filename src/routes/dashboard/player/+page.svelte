<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import type { VNode } from 'preact';
	import { format, tag_compare } from '$root/components/utils';
	import type { Player } from '$root/types/data';
	import { manager } from '$root/components/store';

	let grid_data: {
		name: string;
		kills: number;
		deaths: number;
		performance: VNode<{}>;
		duration: VNode<{}>;
		joined: number;
		guild: string;
	}[] = [];
	let grid: Grid;
	let show_grid_header = false;

	$: {
		if ($manager && $manager.players.length > 0) {
			update_grid($manager.sorted_players);
		}
	}

	$: grid?.$on('ready', () =>
		grid.$$.root
			.querySelector('.gridjs-wrapper')!
			.addEventListener('scroll', function (this: Element) {
				show_grid_header = this.scrollTop > 50;
			})
	);

	function update_grid(players: Player[]) {
		const new_data = [];
		for (let player of players) {
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
				joined: player.locals.length,
				guild: player.guild.name
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
		},
		{
			name: 'Guild',
			width: '10%',
			attributes: {
				title: 'Player Guild'
			},
			sort: {
				compare: tag_compare
			}
		}
	];

	function open_player(event: CustomEvent) {
		const name = event.detail[1]._cells[0].data;
		goto(`/dashboard/player/${name}`);
	}
</script>

<nav class="level ">
	<!-- Left side -->
	<div class="level-left">
		<div class="top_lvl level-item is-flex is-flex-direction-column is-align-items-flex-start ">
			<div class="level-item">
				<strong>Players</strong>
			</div>
		</div>
		<div class="subtitle list-item-description " />
	</div>

	<!-- Right side -->
	<div class="level-right">
		<div class="level-item" />
	</div>
</nav>
<div class="wrapper tile">
	<div class="grid_content " class:show_header={show_grid_header}>
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

<style>
	nav {
		height: 10%;
		min-height: 10%;
		margin: 0 !important;
	}
	.wrapper {
		height: 90%;
		max-height: 90%;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
	.grid_content {
		height: 100%;
	}
	strong {
		color: white;
		font-size: var(--font-18);
	}
</style>
