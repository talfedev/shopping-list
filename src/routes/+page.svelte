<script>
	let categories = ['Dairy', 'Vegetables', 'Chocolate', 'Frozen', 'Meats'];
</script>

<main>
	<h1>Shopping List</h1>
	<div>
		<h2>Categories</h2>
		{#each categories as category}
			<h3>{category}</h3>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		font-family: sans-serif;
	}
</style>
