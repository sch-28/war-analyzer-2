<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$root/types/user';
	import { onMount } from 'svelte';

	$: is_url = (url: string) => {
		return $page.url.pathname === url;
	};

	export let user: User | undefined;

	let expand_menu = false;

	onMount(() => {
		window.onresize = () => (expand_menu = false);
	});
</script>

<nav class="navbar is-dark" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
			<img src="/images/logo.svg" width="32" height="32" alt="logo" />
		</a>

		<a
			data-sveltekit-prefetch
			href={''}
			class:is-active={expand_menu}
			on:click={() => (expand_menu = !expand_menu)}
			role="button"
			class="navbar-burger "
			aria-label="menu"
			aria-expanded="false"
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div class="navbar-menu" class:is-active={expand_menu}>
		<div class="navbar-start" />

		<div class="navbar-end">
			<a
				class="navbar-item"
				data-sveltekit-prefetch
				href="/dashboard"
				on:click={() => (expand_menu = false)}
			>
				Dashboard
			</a>
			<a
				class="navbar-item"
				href="https://nwa.documentation.oracle-tools.site/"
				on:click={() => (expand_menu = false)}
			>
				Documentation
			</a>
			<div class="navbar-item">
				<div class="buttons">
					{#if !user || Object.keys(user).length == 0}
						<a class="button" href="/discord/auth">
							<strong>Log in</strong>
						</a>
					{:else}
						<a class="button" href="/discord/auth">
							<strong>{user.username}</strong>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	img {
		color: white;
	}

	.navbar {
		background-color: rgba(0, 0, 0, 0);
		height: 56px;
	}

	.navbar-menu.is-active {
		background-color: var(--color-bg-secondary);
		box-shadow: 0px 2px 16px rgb(10 10 10 / 30%);
	}
	.navbar-menu {
		background-color: rgba(0, 0, 0, 0);
	}

	.navbar-menu a {
		color: var(--color-text-primary);
	}

	.navbar-menu .button {
		color: black;
	}

	.buttons .button:hover {
		color: black;
	}

	a.navbar-item:hover {
		background-color: var(--hover);
	}
</style>
