<script lang="ts">
	import { format } from '../utils';

	export let number: number;
	export let neutral: number = 1;
	export let places: number = 2;
	export let after: string = "";
</script>

<i class:negative={number < neutral} class:positive={number > neutral}>
	{format(number,places)}{after}
</i>


