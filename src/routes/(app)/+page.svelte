<!-- <svelte:options immutable /> -->

<script lang="ts">
	import type { PageData } from './$types';
	import { signin, signout } from '$lib/firebase/auth';
	import { user } from '$lib/stores/userStore';
	import { categories, items, orderedCategories } from '$lib/stores/allStores';
	import { addCategory, deleteCategory, updateCategory, moveCategories } from '$lib/firebase/firestore';
	import type { Category, NewCategory } from '$lib/types/myTypes';
	import { copyListAsText, shareFullList } from '$lib/helper-functions/shareList';

	export let data: PageData;

	let language: 'en' | 'he' = 'en';
	let addModal: HTMLDialogElement | null;
	let editModal: HTMLDialogElement | null;
	let moveCategoriesModal: HTMLDialogElement | null;
	let categoryInput = '';
	let selectedCategoryId = '';
	let moveMode: 'source'|'target' = 'source';

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
</script>

<main>
	{#if $currentUser}
		<div class="languages">
			<button on:click={() => (language = 'en')}>English</button>
			<button on:click={() => (language = 'he')}>Hebrew</button>
			<button on:click={openMoveCategoriesModal}>Move categories</button>
			<a href="/print"><button>P</button></a>
		</div>
		<div class={language === 'en' ? 'categoriesL' : 'categoriesR'}>
			{#each $orderedCategories as categoryId (categoryId)}
				{#if $categories[categoryId]}
					<div class="category-wrap">
						<a href="categories/{$categories[categoryId].name}?id={categoryId}">
							<h3 class="{language === 'en' ? 'categoryL' : 'categoryR'} category">
								{$categories[categoryId].name}
							</h3>
						</a>
						<div>
							<span>{$categories[categoryId].items.filter((itemId) => !$items[itemId]?.checked).length || ''}</span>
							<button on:click={() => openEditModal($categories[categoryId])}>Edit</button>
							<button on:click={() => deleteCategory($categories[categoryId])}>Delete</button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<br />
		<div>
			<button on:click={() => addModal?.showModal()}>Category +</button>
		</div>
		<div>
			<br>
			<button on:click={() => shareFullList($orderedCategories, $categories, $items)}>Share</button>
			<button on:click={() => copyListAsText($orderedCategories, $categories, $items)}>Copy list to clipboard</button>
		</div>
		<br />
		<p>hi {$currentUser?.email}</p>
		<button on:click={signout}>sign out</button>
	{:else}
		<p>you're not logged in</p>
		<button on:click={signin}>signin/up</button>
	{/if}
	<div class="dialog">
		<dialog bind:this={addModal}>
			<h3>Category Name (new)</h3>
			<input type="text" bind:value={categoryInput} />
			<br />
			<button on:click={() => createNewCategory({ name: categoryInput })}>Add</button>
			<button on:click={closeModal}>Close</button>
		</dialog>
	</div>
	<div class="dialog">
		<dialog bind:this={editModal}>
			<h3>Category Name (edit)</h3>
			<input type="text" bind:value={categoryInput} />
			<br />
			<button on:click={() => editCategory({ id: selectedCategoryId, name: categoryInput })}
				>Edit</button
			>
			<button on:click={closeModal}>Close</button>
		</dialog>
	</div>
	<dialog bind:this={moveCategoriesModal}>
		<h3>Move Categories</h3>
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
		<button on:click={closeModal}>close</button>
		<button on:click={reorderCategories}>Done</button>
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
