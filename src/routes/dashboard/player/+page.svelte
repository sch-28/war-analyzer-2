<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import type { VNode } from 'preact';
	import { format, tag_compare } from '$root/components/utils';
	import type { Player } from '$root/types/data';
	import { manager } from '$root/components/store';
	let grid_data: { name: string; kills: number; deaths: number; performance: VNode<{}>; joined: VNode<{}>; guild: string; }[] = [];
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
				kills: player.average_kills,
				deaths: player.average_kills,
				performance: html(
					`<i class="${
						player.average_performance >= 1
							? player.average_performance > 1
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(player.average_performance)}</i>`
				),
				joined: html(
					`<i class="${
						player.average_join_duration >= 0.75
							? player.average_join_duration > 0.75
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(player.average_join_duration * 100, 0)}%</i>`
				),
				guild: player.guild.name
			});
		}
		grid_data = new_data;
	}
	const columns = [
		{
			name: 'Name',
			width: '15%',
			attributes: {
				title: 'Name'
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

<div class="pt-3 pb-3">
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
