<script>
	import '../app.css';
	import { items, categories, orderedCategories } from '$lib/stores/allStores'

	let refrences = [$items, $categories, $orderedCategories];
</script>

<h1>Shopping List</h1>
<slot />

<style lang="scss">
	h1 {
		// background-color: rgb(81, 81, 255);
		text-align: center;
		background-color: rgb(51, 51, 51);
		color: white;
		padding: 5px 0;
	}
</style>
