<!-- <svelte:options immutable /> -->

<script lang="ts">
	import type { PageData } from './$types';
	import { signout } from '$lib/firebase/auth';
	import { user } from '$lib/stores/userStore';
	import { categories, items, orderedCategories, language, dataLoading } from '$lib/stores/allStores';
	import { addCategory, deleteCategory, updateCategory, moveCategories } from '$lib/firebase/firestore';
	import type { Category, NewCategory } from '$lib/types/myTypes';
	import { copyListAsText, shareFullList } from '$lib/helper-functions/shareList';
	import { languages } from '$lib/languages';

	export let data: PageData;

	let addModal: HTMLDialogElement | null;
	let editModal: HTMLDialogElement | null;
	let moveCategoriesModal: HTMLDialogElement | null;
	let categoryInput = '';
	let selectedCategoryId = '';
	let moveMode: 'source'|'target' = 'source';
	$: isDataLoading = $dataLoading.items || $dataLoading.categories || $dataLoading.lists;

	const currentUser = user;

	const moveCategoryInfo: {
		categories: string[];
		from: number;
		to: number;
	} = {
		categories: [],
		from: -1,
		to: -1
	}

	const closeModal = () => {
		addModal?.close();
		editModal?.close();
		moveCategoriesModal?.close();
		categoryInput = '';
		selectedCategoryId = '';
	};

	const openEditModal = (category: Category) => {
		categoryInput = category.name;
		selectedCategoryId = category.id;
		editModal?.showModal();
	};

	const createNewCategory = (category: Omit<NewCategory, 'items'>) => {
		addCategory(category);
		closeModal();
	};

	const editCategory = (category: Omit<Category, 'items'>) => {
		updateCategory(category);
		closeModal();
	};

	const openMoveCategoriesModal = () => {
		moveCategoryInfo.categories = [...$orderedCategories];
		moveCategoryInfo.from = -1;
		moveCategoryInfo.to = -1;
		
		moveCategoriesModal?.showModal();
	}

	const reorderCategories = () => {
		moveCategories(moveCategoryInfo.categories);
		moveCategoryInfo.categories = [];
		closeModal();
	}

	const moveCategoryFromTo = (index: number) => {
		if(moveMode === 'source') {
			moveMode = 'target';
			moveCategoryInfo.from = index;
		} else if(moveMode === 'target') {
			moveMode = 'source';
			moveCategoryInfo.to = index;
			const category = moveCategoryInfo.categories.splice(moveCategoryInfo.from,1)[0];
			moveCategoryInfo.categories.splice(moveCategoryInfo.to,0,category);


			moveCategoryInfo.categories = moveCategoryInfo.categories;
			moveCategoryInfo.from = -1;
			moveCategoryInfo.to = -1;
		}
	}

	const setLanguage = (lang: 'en'|'he') => {
		$language = lang;
		localStorage.setItem('language', lang);
	}
</script>

<main>
	{#if !isDataLoading}
		<div class="languages">
			<button on:click={() => setLanguage('en')}>English</button>
			<button on:click={() => setLanguage('he')}>{languages.buttons.hebrew[$language]}</button>
			<button on:click={openMoveCategoriesModal}>{languages.buttons.moveCategories[$language]}</button>
			<a href="/print"><button>P</button></a>
		</div>
		<div class={$language === 'en' ? 'categoriesL' : 'categoriesR'}>
			{#each $orderedCategories as categoryId (categoryId)}
				{#if $categories[categoryId]}
					<div class="category-wrap">
						<a href="categories/{$categories[categoryId].name}?id={categoryId}">
							<h3 class="{$language === 'en' ? 'categoryL' : 'categoryR'} category">
								{$categories[categoryId].name}
							</h3>
						</a>
						<div>
							<span>{$categories[categoryId].items.filter((itemId) => !$items[itemId]?.checked).length || ''}</span>
							<button on:click={() => openEditModal($categories[categoryId])}>{languages.buttons.edit[$language]}</button>
							<button on:click={() => deleteCategory($categories[categoryId])}>{languages.buttons.delete[$language]}</button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<br />
		<div>
			<button on:click={() => addModal?.showModal()}>{languages.buttons.categoryPlus[$language]}</button>
		</div>
		<div>
			<br>
			<button on:click={() => shareFullList($orderedCategories, $categories, $items)}>{languages.buttons.share[$language]}</button>
			<button on:click={() => copyListAsText($orderedCategories, $categories, $items)}>{languages.buttons.copyListToClipboard[$language]}</button>
		</div>
		<br />
		<p>hi {$currentUser?.email}</p>
		<button on:click={signout}>{languages.buttons.signout[$language]}</button>
	{:else}
		<h2>Loading list data...</h2>
	{/if}
	<div class="dialog">
		<dialog bind:this={addModal}>
			<h3>{languages.content.newCategoryName[$language]}</h3>
			<input type="text" bind:value={categoryInput} />
			<br />
			<button on:click={() => createNewCategory({ name: categoryInput })}>{languages.buttons.add[$language]}</button>
			<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		</dialog>
	</div>
	<div class="dialog">
		<dialog bind:this={editModal}>
			<h3>{languages.content.editCategoryName[$language]}</h3>
			<input type="text" bind:value={categoryInput} />
			<br />
			<button on:click={() => editCategory({ id: selectedCategoryId, name: categoryInput })}
				>{languages.buttons.edit[$language]}</button
			>
			<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		</dialog>
	</div>
	<dialog bind:this={moveCategoriesModal}>
		<h3>{languages.content.moveCategories[$language]}</h3>
		<p>Mode: {moveMode}</p>
		<div class="move-categories-wrapper">
			{#each moveCategoryInfo.categories as categoryId, index (categoryId)}
				<p 
				  on:click={() => moveCategoryFromTo(index)}
				  class:moveOption={(moveMode === 'target') && (index !== moveCategoryInfo.from)}
				  class:moveSource={(moveMode === 'target') && (index === moveCategoryInfo.from)}
				>
				{$categories[categoryId]?.name}
				</p>
			{/each}
		</div>
		<br>
		<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		<button on:click={reorderCategories}>{languages.buttons.done[$language]}</button>
	</dialog>
</main>

<style lang="scss">
	main {
		text-align: center;
		font-family: sans-serif;
		max-width: 600px;
		margin: 0 auto;
	}

	.languages {
		background-color: lightgray;
		padding: 5px 0;
		display: flex;
		justify-content: center;
		gap: 10px;

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

	a {
		text-decoration: none;
		color: black;
	}

	.category-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;

		button {
			text-decoration: none;
		}

		a {
			flex: 1;
			margin-right: 10px;
		}
	}

	.category {
		&:nth-child(even) {
			background-color: rgb(220, 220, 220);
		}
	}

	.categoryL {
		padding: 5px 0;
	}

	.categoryR {
		padding: 5px 0;
	}

	dialog {
		margin: 0 auto;
		margin-top: 50%;
		padding: 15px;
		border: 1px solid rgb(213, 208, 208);
		background-color: lightgray;

		h3 {
			margin-bottom: 10px;
		}

		input {
			margin-bottom: 10px;
		}

		&::backdrop {
			background-color: rgba($color: #000000, $alpha: 0.5);
		}

		button {
			padding: 5px;
		}

		.move-categories-wrapper {
			border: 1px solid black;
			border-radius: 5px;
			text-align: left;
			padding: 10px;
			max-height: 200px;
			overflow: scroll;

			.moveOption {
				background-color: rgb(188, 239, 188);
			}

			.moveSource {
				background-color: rgb(239, 219, 188);
			}
		}
	}
</style>
