<script>
	import { items, categories, orderedCategories } from '$lib/stores/allStores'

	let refrences = [$items, $categories, $orderedCategories];
</script>

<slot />

<style lang="scss">
	//
</style>
