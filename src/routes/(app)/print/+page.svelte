<script lang="ts">
	import type { PageData } from './$types';
	import type { Category, Item } from '$lib/types/myTypes';
	// import { isCategory } from '$lib/types/myTypes';
	import { items, categories, orderedCategories } from '$lib/stores/allStores';

	export let data: PageData;

	const date = new Date();
	let columns: (Category | Item)[][] = [[]];
	const COL_SIZE = 52;
	const CATEGORY_SIZE = 75;
	let itemsInCol = 0;
	let currentCol = 0;

	const organize = () => {
		$orderedCategories.forEach((categoryId) => {
			if (itemsInCol <= COL_SIZE - 3) {
				itemsInCol += 3;
				columns[currentCol].push($categories[categoryId]);
			} else {
				itemsInCol = 3;
				currentCol++;
				columns[currentCol] = [$categories[categoryId]];
			}

			Array(CATEGORY_SIZE)
				.fill($items[$categories[categoryId].items[0]])
				.forEach((item) => {
					if (itemsInCol <= COL_SIZE - 1) {
						itemsInCol++;
						columns[currentCol].push(item);
					} else {
						itemsInCol = 1;
						currentCol++;
						columns[currentCol] = [item];
					}
				});
		});
	};

	organize();
</script>

<main>
	<p class="date">{date.getDate()} / {date.getMonth() + 1} / {date.getFullYear()}</p>
	<div class="columns-wrapper">
		{#each columns as col}
			<div class="col">
				{#each col as element}
					{#if !element.category}
						<h2>{element.name}</h2>
						<hr />
					{:else}
						<p>{element.name}</p>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 10px 5%;
	}

	h2 {
		margin: 10px 0 0;
	}

	hr {
		width: 150px;
		border-color: black;
		margin: 4px 0 6px;
	}

	.date {
		text-align: center;
	}

	.columns-wrapper {
		display: flex;
		justify-content: flex-start;
		gap: 20px;
        flex-wrap: wrap;
	}

	.col {
		display: inline-block;
	}
</style>
