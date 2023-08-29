<script lang="ts">
	import type { PageData } from './$types';
	import type { Category } from '$lib/types/myTypes';
	import { items, categories } from '$lib/stores/allStores';
	import { addItem, deleteItem, toggleItem } from '$lib/firebase/firestore';
	import { user } from '$lib/stores/userStore';

	export let data: PageData;

	let newItemModal: HTMLDialogElement|null;

	// this theoretically could be undefined
	$: category = $categories.find(ctgry => ctgry.id === data.category.id) as Category;

	const itemFields = {
		name: '',
		description: '',
		quantity: '',
	}

	const createNewItem = () => {
		//create new item object
		const newItem = {
			name: itemFields.name,
			description: itemFields.description,
			quantity: itemFields.quantity,
			checked: false,
			category: category.id
		}

		//add item to DB & app
		addItem(newItem);

		//close the modal
		newItemModal?.close();

		//clear input fields
		itemFields.name = '';
		itemFields.description = '';
		itemFields.quantity = '';
	}
</script>

<section>
	<div class="back-arrow">
		<a href="/">←</a>
	</div>
	<h2 class="title">{data.category.name}</h2>
	<div class="items">
		{#each category.items as itemId (itemId)}
			{#if $items[itemId] && !$items[itemId].checked}
				<div class="item-wrapper">
					<p class="item">{$items[itemId].name}</p>
					<div>
						<input type="checkbox" checked={$items[itemId].checked} on:change={() => toggleItem({id: itemId, checked: !$items[itemId].checked})}>
						<button on:click={() => deleteItem(itemId, category.id)}>Delete</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<p>--------------------</p>
	<div class="items">
		{#each category.items as itemId (itemId)}
			{#if $items[itemId] && $items[itemId].checked}
				<div class="item-wrapper">
					<p class="item crossed">{$items[itemId].name}</p>
					<div>
						<input type="checkbox" checked={$items[itemId].checked} on:change={() => toggleItem({id: itemId, checked: !$items[itemId].checked})}>
						<button on:click={() => deleteItem(itemId, category.id)}>Delete</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<p>*********************</p>
	<div>
		<button on:click={() => newItemModal?.showModal()}>Item +</button>
	</div>
	<dialog bind:this={newItemModal}>
		<h3>New Item</h3>
		<input type="text" bind:value={itemFields.name} placeholder="name">
		<br>
		<input type="text" bind:value={itemFields.description} placeholder="description">
		<br>
		<input type="text" bind:value={itemFields.quantity} placeholder="quantity">
		<br>
		<button on:click={() => newItemModal?.close()}>close</button>
		<button on:click={createNewItem}>Add</button>
	</dialog>
</section>

<style lang="scss">
	section {
		text-align: center;
	}

	.back-arrow {
		text-align: left;
		font-size: 1.5rem;

		a {
			display: inline-block;
			background-color: lightgray;
			padding: 10px 8px;
			text-decoration: none;
			color: black;
		}
	}

	.title {
		margin: 10px 0;
	}

	.items {
		text-align: left;
	}

	.item-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item {
		padding: 5px 10px;
	}

	.crossed {
		text-decoration: line-through;
		color: gray;
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
