<script lang="ts">
	import { page } from '$app/stores';
	$: is_url = (url: string) => {
		return $page.url.pathname === url;
	};

	$: is_suburl = (url: string) => {
		return $page.url.pathname.includes(url);
	};
</script>
<svelte:head>
	<title>Dashboard</title>
</svelte:head>
<div class="wrapper">
	<aside class="menu">
		<p class="menu-label">General</p>
		<ul class="menu-list">
			<!-- <li><a class:is-active={is_url('/dashboard')} href="/dashboard">Dashboard</a></li> -->
			<li>
				<a
					class:is-active={is_url('/dashboard/war') || is_suburl('/dashboard/war/')}
					href="/dashboard/war">Wars</a
				>
			</li>
			<li>
				<a
					class:is-active={is_url('/dashboard/player') || is_suburl('/dashboard/player/')}
					href="/dashboard/player">Players</a
				>
			</li>
			<li>
				<a
					class:is-active={is_url('/dashboard/guild') || is_suburl('/dashboard/guild/')}
					href="/dashboard/guild">Guilds</a
				>
			</li>
		</ul>
		<!-- <p class="menu-label">Nodewar</p>
		<ul class="menu-list">
			<li><a class:is-active={is_url('/dashboard/nodewar')} href="/dashboard/war">Nodewars</a></li>
			<li><a class:is-active={is_url('/dashboard/player')} href="/dashboard/player">Players</a></li>
			<a class:is-active={is_url('/dashboard/guild')} href="/dashboard/guild">Guilds</a>
		</ul> -->
		<p class="menu-label">Account</p>
		<ul class="menu-list">
			<li><a href="/dashboard/shared">Shared Wars</a></li>
			<li><a href="/discord/signout">Logout</a></li>
		</ul>
	</aside>
	<div class="slot">
		<slot />
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		height: calc(100vh - 72px);
		padding: 20px 0;
		gap: 25px;
	}
	.menu {
		display: block;
		width: 15%;
		box-shadow: 0px 2px 16px rgb(10 10 10 / 30%);
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-base);
		padding: 15px;
	}

	.slot {
		/* background-color: rgba(255, 255, 255, 0.05); */
		border-radius: var(--radius-base);
		/* padding: 15px; */
		width: 85%;
		/* box-shadow: 0px 2px 16px rgb(10 10 10 / 30%); */
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	.menu a {
		color: white;
	}

	.menu a {
		color: white;
	}

	.menu a:hover {
		color: black;
	}

	.menu p {
		color: rgba(255, 255, 255, 0.6);
	}
</style>
