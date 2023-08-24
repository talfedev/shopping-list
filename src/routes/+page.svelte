<svelte:options immutable />

<script lang="ts">
	import type { PageData } from './$types';
	import { signin, signout } from '$lib/firebase/auth';
	import { user } from '$lib/stores/userStore';
	import { categories } from '$lib/stores/categoriesStore';
	import { addCategory, deleteCategory, updateCategory } from '$lib/firebase/firestore';
	import type { Category, NewCategory } from '$lib/types/myTypes';

	export let data: PageData;

	let language: 'en' | 'he' = 'en';
	let addModal: HTMLDialogElement | null;
	let editModal: HTMLDialogElement | null;
	let categoryInput = '';
	let selectedCategoryId = '';

	const currentUser = user;

	const closeModal = () => {
		addModal?.close();
		editModal?.close();
		categoryInput = '';
		selectedCategoryId = '';
	};

	const openEditModal = (category: Category) => {
		categoryInput = category.name;
		selectedCategoryId = category.id;
		editModal?.showModal();
	};

	const createNewCategory = (category: NewCategory) => {
		addCategory(category);
		closeModal();
	};

	const editCategory = (category: Category) => {
		updateCategory(category);
		closeModal();
	};
</script>

<main>
	{#if $currentUser}
		<div class="languages">
			<button on:click={() => (language = 'en')}>English</button>
			<button on:click={() => (language = 'he')}>Hebrew</button>
		</div>
		<div class={language === 'en' ? 'categoriesL' : 'categoriesR'}>
			{#each $categories as category}
				<div class="category-wrap">
					<a href="categories/{category.name}?id={category.id}">
						<h3 class="{language === 'en' ? 'categoryL' : 'categoryR'} category">
							{category.name}
						</h3>
					</a>
					<div>
						<button on:click={() => openEditModal(category)}>Edit</button>
						<button on:click={() => deleteCategory(category.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
		<br />
		<div>
			<button on:click={() => addModal?.showModal()}>Category +</button>
		</div>
		<br />
		<p>hi {$currentUser?.displayName}</p>
		<button on:click={signout}>sign out</button>
	{:else}
		<p>you're not logged in</p>
		<button on:click={signin}>signin/up</button>
	{/if}
	<div>
		<br />
		<a href="/login">To login page</a>
	</div>
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
</main>

<style lang="scss">
	main {
		text-align: center;
		font-family: sans-serif;
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
	}
</style>
