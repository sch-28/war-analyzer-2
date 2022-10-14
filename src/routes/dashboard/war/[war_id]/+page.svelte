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

	let chart: HTMLCanvasElement;

	Chart.register(...registerables);

	let war: War | undefined;
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
		const war_id = $page.params.war_id;
		if (war_id) {
			war = $manager.get_war(+war_id);
			if (war) update_grid(war);
		}
	}

	$: {
		selected_guild;
		if (war) update_grid(war);
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

	/* const data: ChartData<'line'> = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'My First dataset Test',

				data: [65, 59, 80, 81, 56, 55, 40]
			},
			{
				label: 'My Second dataset',

				data: [28, 48, 40, 19, 86, 27, 90]
			}
		]
	}; */

	/* onMount(() => {
		if (browser) create_chart();
	}); */

	/* function create_chart() {
		new Chart(chart, {
			type: 'bar',
			data: data,
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						grid: {
							color: 'hsl(43 100% 52% / 10%)'
						},
						ticks: { color: 'hsl(43 100% 52% )' }
					},
					y: {
						beginAtZero: false,
						ticks: { color: 'hsl(43 100% 52% )', font: { size: 18 } },
						grid: {
							color: 'hsl(43 100% 52% / 40%)'
						},
						title: {
							display: true,
							text: 'Satisfaction (%)',
							color: 'hsl(43 100% 52% )',
							font: { size: 24 }
						}
					}
				}
			}
		});
	} */

	

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
					</div>
				</div>
				<div class="subtitle list-item-description ">
					{war.formatted_date}
				</div>
			</div>
		</div>

		<!-- Right side -->
		<div class="level-right">
			<div class="level-item">
				<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
					<EditWarButton {war} />
				</Modal>
			</div>
		</div>
	</nav>
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
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	

	.scrollable {
		overflow-y: scroll;
		max-height: 276px;
	}

	.leaderboard {
		height: fit-content;
	}

	.level {
		height: 10%;
	}

	
	.is-ancestor {
		gap: 25px;
		height: 90%;
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
		flex-direction: column;
		align-items: flex-start;
	}

	
</style>
