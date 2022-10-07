<script lang="ts">
	import { manager } from '$root/components/store';
	import { onMount } from 'svelte';
</script>

<div class="wars">
	<div class="list has-hoverable-list-items">
		{#each $manager.wars as war}
			<div class="list-item">
				<div class="list-item-content">
					<div class="list-item-title">{war.name} - {war.date}</div>
					<div class="list-item-description">List item description</div>
				</div>
				<div class="list-item-controls">
					<div class="buttons is-right">
						<button class="button">
							<span class="icon is-small">
								<i class="fas fa-edit" />
							</span>
							<span>Edit</span>
						</button>

						<button class="button">
							<span class="icon is-small">
								<i class="fas fa-ellipsis-h" />
							</span>
						</button>
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
	}

	.list.has-hoverable-list-items .list-item:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
