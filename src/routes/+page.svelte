<script>
	let language = 'en'; // en, he
	let categories = ['Dairy', 'Vegetables', 'Chocolate', 'Frozen', 'Meats'];
</script>

<main>
	<h1>Shopping List</h1>
	<div class="languages">
		<button on:click={() => language = "en"}>English</button>
		<button on:click={() => language = "he"}>Hebrew</button>
	</div>
	<div class={language === 'en' ? 'categoriesL' : 'categoriesR'}>
		{#each categories as category}
			<h3 class="{language === 'en' ? 'categoryL' : 'categoryR'} category">{category}</h3>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		text-align: center;
		font-family: sans-serif;
	}

	h1 {
		background-color: rgb(81, 81, 255);
		color: white;
		padding: 5px 0;
	}

	.languages {
		background-color: lightgray;
		padding: 5px 0;
		display: flex;
		justify-content: center;
		gap: 20px;

		button {
			padding: 5px 10px;
			border: 1px solid;
			border-radius: 6px;
		}
	}

	.categoriesL {
		text-align: left;
	}

	.categoriesR {
		text-align: right;
		direction: rtl;
	}

	.category {
		background-color: lime;

		&:hover {
			background-color: darkgreen;
		}
	}

	.categoryL {
		padding: 5px 0 5px 10px;
	}

	.categoryR {
		padding: 5px 10px 5px 0;
	}
</style>
