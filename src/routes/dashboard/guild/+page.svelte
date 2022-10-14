<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import type { VNode } from 'preact';
	import { format, tag_compare } from '$root/components/utils';
	import type { Guild, Player } from '$root/types/data';
	import { manager } from '$root/components/store';
	let grid_data = [];
	let grid: Grid;
	let show_grid_header = false;

	$: {
		if ($manager && $manager.guilds.length > 0) {
			update_grid($manager.sorted_guilds);
		}
	}

	$: grid?.$on('ready', () =>
		grid.$$.root
			.querySelector('.gridjs-wrapper')!
			.addEventListener('scroll', function (this: Element) {
				show_grid_header = this.scrollTop > 50;
			})
	);

	function update_grid(guilds: Guild[]) {
		const new_data = [];
		for (let guild of guilds) {
			new_data.push({
				name: guild.name,
				kills: +format(guild.average_kills, 2),
				deaths: +format(guild.average_deaths, 2),
				kill_diff: html(
					`<i class="${
						guild.average_kill_difference >= 0
							? guild.average_kill_difference > 0
								? 'positive'
								: 'neutral'
							: 'negative'
					}">${+format(guild.average_kill_difference)}</i>`
				)
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
			name: 'Avg. Kills',
			id: 'kills',
			width: '10%',
			attributes: {
				title: 'Kills'
			}
		},
		{
			name: 'Avg. Deaths',
			id: 'deaths',
			width: '10%',
			attributes: {
				title: 'Deaths'
			}
		},
		{
			name: 'Kill Difference',
			id: 'kill_diff',
			width: '10%',
			attributes: {
				title: 'Performance compared to Average'
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

<div class="wrapper">
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

<style>
	.wrapper {
		height: 100%;
	}
	.grid_content {
		max-height: 100%;
		overflow-y: scroll;
	}
</style>
