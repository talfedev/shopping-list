<script lang="ts">
	import type { PageData } from './$types';
	import type { Category, Item } from '$lib/types/myTypes';
	import { isCategory } from '$lib/types/myTypesFunctions';
	import { items, categories, orderedCategories, language } from '$lib/stores/allStores';

	export let data: PageData;

	const date = new Date();
	let columns: (Category | Item)[][] = [[]];
	const COL_SIZE = 57;
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

			$categories[categoryId].items.forEach((itemId) => {
				if (!$items[itemId].checked) {
					if (itemsInCol <= COL_SIZE - 1) {
						itemsInCol++;
						columns[currentCol].push($items[itemId]);
					} else {
						itemsInCol = 1;
						currentCol++;
						columns[currentCol] = [$items[itemId]];
					}
				}
			});
		});
	};

	organize();
</script>

<main>
	<a href="/" class="back-btn">
		<button>←</button>
	</a>
	<div class="columns-wrapper" class:rtl={$language === 'he'}>
		{#each columns as col}
			<div class="col" class:rtl={$language === 'he'}>
				{#each col as element}
					{#if isCategory(element)}
						<h2>{element.name}</h2>
						<hr />
					{:else}
						<p>{element.name} - {element.quantity}</p>
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

	.top {
		display: flex;
		gap: 40px;
		justify-content: center;
		align-items: center;
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

	.rtl {
		direction: rtl;
	}

	button {
		padding: 5px;
	}

	@media print {
		.back-btn {
			display: none;
		}
	}
</style>
