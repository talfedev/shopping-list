<script lang="ts">
	import type { PageData } from './$types';
	import type { Category, Item } from '$lib/types/myTypes';
	import { items, categories } from '$lib/stores/allStores';
	import { addItem, deleteItem, toggleItem, updateItem, transferItem } from '$lib/firebase/firestore';
	import { user } from '$lib/stores/userStore';

	export let data: PageData;

	let newItemModal: HTMLDialogElement|null;
	let editItemModal: HTMLDialogElement|null;
	let transferModal: HTMLDialogElement|null;
	let selectedItem: Item | null;
	let selectedTransferCategory = 'default';

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

		closeModal();
	}

	const openEditModal = (item: Item) => {
		//populate the fields with item's data
		itemFields.name = item.name;
		itemFields.description = item.description || '';
		itemFields.quantity = item.quantity || '';

		//get an accessible reference to item
		selectedItem = item;

		//open edit modal
		editItemModal?.showModal();
	}

	const editItem = () => {
		//create new item object
		const editedItem = {
			name: itemFields.name,
			description: itemFields.description,
			quantity: itemFields.quantity,
			id: selectedItem!.id
		}

		//add item to DB & app
		updateItem(editedItem);

		//close the modal
		closeModal();
	}

	const closeModal = () => {
		//clear input fields
		itemFields.name = '';
		itemFields.description = '';
		itemFields.quantity = '';

		//remove refrence to item
		selectedItem = null;
		
		newItemModal?.close();
		editItemModal?.close();
		transferModal?.close();
	}

	const openTransferModal = (item: Item) => {
		selectedTransferCategory = 'default';
		selectedItem = item;
		transferModal?.showModal();
	}

	const changeItemCategory = () => {
		if(selectedItem && selectedTransferCategory !== 'default') {
			transferItem(category.id, selectedTransferCategory, selectedItem?.id);
			console.log('transfer item to new category!');
			closeModal();
		} else {
			console.log('something is wrong with "selectedItem" or "selectedTransferCategory".');
		}
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
						<button on:click={() => openTransferModal($items[itemId])}>Transfer</button>
						<button on:click={() => openEditModal($items[itemId])}>Edit</button>
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
						<button on:click={() => openTransferModal($items[itemId])}>Transfer</button>
						<button on:click={() => openEditModal($items[itemId])}>Edit</button>
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
		<button on:click={closeModal}>close</button>
		<button on:click={createNewItem}>Add</button>
	</dialog>
	<dialog bind:this={editItemModal}>
		<h3>Edit Item</h3>
		<input type="text" bind:value={itemFields.name} placeholder="name">
		<br>
		<input type="text" bind:value={itemFields.description} placeholder="description">
		<br>
		<input type="text" bind:value={itemFields.quantity} placeholder="quantity">
		<br>
		<button on:click={closeModal}>close</button>
		<button on:click={editItem}>Edit</button>
	</dialog>
	<dialog bind:this={transferModal}>
		<h3>Transfer Item</h3>
		<select name="" id="" bind:value={selectedTransferCategory}>
			<option value="default" selected>Choose category</option>
			{#each $categories as categoryOption (categoryOption.id)}
				{#if category.id !== categoryOption.id}
					<option value={categoryOption.id}>{categoryOption.name}</option>
				{/if}
			{/each}
		</select>
		<br>
		<button on:click={closeModal}>close</button>
		<button on:click={changeItemCategory}>Transfer</button>
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

		select {
			margin-bottom: 10px;
		}
	}
</style>
