<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import { goto } from '$app/navigation';
	import type { VNode } from 'preact';
	import { format, tag_compare } from '$root/components/utils';
	import type { Guild, Player } from '$root/types/data';
	import { manager } from '$root/components/store';
	import { onMount } from 'svelte';
	let grid_data: { name: string; kills: number; deaths: number; kill_diff: VNode<{}> }[] = [];
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
				),
				members: +format(guild.average_members, 2),
				total_members: guild.players.length,
				nodewars: guild.locals.length
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
			name: 'Avg. Kill Difference',
			id: 'kill_diff',
			width: '10%',
			attributes: {
				title: 'Performance compared to Average'
			},
			sort: {
				compare: tag_compare
			}
		},
		{
			name: 'Avg. Members',
			id: 'members',
			width: '10%',
			attributes: {
				title: 'Average Members'
			}
		},
		{
			name: 'Members',
			id: 'total_members',
			width: '10%',
			attributes: {
				title: 'Total Member Count'
			}
		},
		{
			name: 'Nodewars',
			width: '10%',
			attributes: {
				title: 'Nodewars joined'
			}
		}
	];

	function open_player(event: CustomEvent) {
		const name = event.detail[1]._cells[0].data;
		goto(`/dashboard/guild/${name}`);
	}
</script>

<nav class="level ">
	<!-- Left side -->
	<div class="level-left">
		<div class="top_lvl level-item is-flex is-flex-direction-column is-align-items-flex-start ">
			<div class="level-item war_title">
				<strong>Guilds</strong>
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
		height: 90%;
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
