<script>
	import { page } from '$app/stores';
	export let status = 200;
	export let message = "ok"


	$:{
		if($page.status != 200 && $page.error){
			status = $page.status;
			message = $page.error?.message
		}
	}
</script>

<div class="error">
	<h1>{status}: {message}</h1>
</div>

<style>
	.error {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
