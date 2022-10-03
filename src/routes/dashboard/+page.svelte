<script lang="ts">
	import Modal from 'svelte-simple-modal';
	import AddWarButton from '$root/components/dashboard/add_war_button.svelte';
</script>

<div class="main">
	<nav class="level">
		<!-- Left side -->
		<div class="level-left">
			<p class="level-item">
				<strong>Dashboard</strong>
			</p>
		</div>

		<!-- Right side -->
		<div class="level-right">
			<p class="level-item">
				<Modal closeButton={false} styleWindow={{ background: 'var(--color-bg-primary)' }}>
					<AddWarButton />
				</Modal>
			</p>
		</div>
	</nav>
</div>

<style>
	strong {
		color: #fff;
		font-size: var(--font-18);
	}
</style>
