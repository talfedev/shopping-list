<script lang="ts">
	import type { PageData } from './$types';
	import type { Category, Item } from '$lib/types/myTypes';
	import { items, categories, orderedCategories, language } from '$lib/stores/allStores';
	import { addItem, deleteItem, toggleItem, updateItem, transferItem, moveItems } from '$lib/firebase/firestore';
	import { shareCategory, copyCategoryAsText } from "$lib/helper-functions/shareList";
	import { languages } from '$lib/languages';

	export let data: PageData;

	let newItemModal: HTMLDialogElement|null;
	let editItemModal: HTMLDialogElement|null;
	let transferModal: HTMLDialogElement|null;
	let moveItemsModal: HTMLDialogElement|null;
	let selectedItem: Item | null;
	let selectedTransferCategory = 'default';
	let moveMode: 'source'|'target' = 'source';
	let expandedItem: Item | null = null;


	let category: Category;
	$: category = $categories[data.category.id || ''] || {id:'error',name:'Error',items: []};

	const itemFields = {
		name: '',
		description: '',
		quantity: '',
	}

	const moveItemInfo: {
		items: string[];
		from: number;
		to: number;
	} = {
		items: [],
		from: -1,
		to: -1
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

		//remove refrences
		selectedItem = null;
		selectedTransferCategory = 'default';
		
		newItemModal?.close();
		editItemModal?.close();
		transferModal?.close();
		moveItemsModal?.close();
	}

	const openTransferModal = (item: Item) => {
		selectedTransferCategory = 'default';
		selectedItem = item;
		transferModal?.showModal();
	}

	const changeItemCategory = () => {
		if(selectedItem && selectedTransferCategory !== 'default') {
			transferItem(category.id, selectedTransferCategory, selectedItem.id);
			console.log('transfered item to new category!');
			closeModal();
		} else {
			console.log('something is wrong with "selectedItem" or "selectedTransferCategory".');
		}
	}

	const openMoveItemsModal = () => {
		moveItemInfo.items = [...category.items];
		moveItemInfo.from = -1;
		moveItemInfo.to = -1;
		
		moveItemsModal?.showModal();
	}

	const reorderItems = () => {
		moveItems(category.id, moveItemInfo.items);
		moveItemInfo.items = [];
		closeModal();
	}

	const moveItemFromTo = (index: number) => {
		if(moveMode === 'source') {
			moveMode = 'target';
			moveItemInfo.from = index;
		} else if(moveMode === 'target') {
			moveMode = 'source';
			moveItemInfo.to = index;
			const item = moveItemInfo.items.splice(moveItemInfo.from,1)[0];
			moveItemInfo.items.splice(moveItemInfo.to,0,item);


			moveItemInfo.items = moveItemInfo.items;
			moveItemInfo.from = -1;
			moveItemInfo.to = -1;
		}
	}

	const setLanguage = (lang: 'en'|'he') => {
		$language = lang;
		localStorage.setItem('language', lang);
	}

	const toggleItemExpansion = (item: Item) => {
		if(expandedItem === item) {
			expandedItem = null;
		} else {
			expandedItem = item;
		}
	}
</script>

<section>
	<div class="buttons">
		<button on:click={() => setLanguage('en')}>English</button>
		<button on:click={() => setLanguage('he')}>{languages.buttons.hebrew[$language]}</button>
		<button class="mode-button" on:click={openMoveItemsModal}>{languages.buttons.moveItems[$language]}</button>
	</div>
	<div class="back-arrow">
		<a href="/">←</a>
	</div>
	<h2 class="title">{data.category.name}</h2>
	
	<!-- unchecked items -->
	<div class={`${$language === 'en'? 'itemsL': 'itemsR'}`}>
		{#each category.items as itemId (itemId)}
			{#if $items[itemId] && !$items[itemId].checked}
				<div class="item-wrapper" class:rtl={$language === 'he'}>
					<div class="item">
						<p on:click={() => toggleItemExpansion($items[itemId])}>{$items[itemId].name}</p>
						{#if expandedItem && expandedItem.id === itemId}
							<div>
								<p>description: {expandedItem.description}</p>
								<p>quantity: {expandedItem.quantity}</p>
							</div>
						{/if}
					</div>
					<div>
						<input type="checkbox" checked={$items[itemId].checked} on:change={() => toggleItem({id: itemId, checked: !$items[itemId].checked})}>
						<button on:click={() => openTransferModal($items[itemId])}>{languages.buttons.transfer[$language]}</button>
						<button on:click={() => openEditModal($items[itemId])}>{languages.buttons.edit[$language]}</button>
						<button on:click={() => deleteItem(itemId, category.id)}>{languages.buttons.delete[$language]}</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<p>--------------------</p>

	<!-- checked items -->
	<div class={`${$language === 'en'? 'itemsL': 'itemsR'}`}>
		{#each category.items as itemId (itemId)}
			{#if $items[itemId] && $items[itemId].checked}
				<div class="item-wrapper" class:rtl={$language === 'he'}>
					<div class="item crossed">
						<p on:click={() => toggleItemExpansion($items[itemId])}>{$items[itemId].name}</p>
						{#if expandedItem && expandedItem.id === itemId}
							<div>
								<p>description: {expandedItem.description}</p>
								<p>quantity: {expandedItem.quantity}</p>
							</div>
						{/if}
					</div>
					<div>
						<input type="checkbox" checked={$items[itemId].checked} on:change={() => toggleItem({id: itemId, checked: !$items[itemId].checked})}>
						<button on:click={() => openTransferModal($items[itemId])}>{languages.buttons.transfer[$language]}</button>
						<button on:click={() => openEditModal($items[itemId])}>{languages.buttons.edit[$language]}</button>
						<button on:click={() => deleteItem(itemId, category.id)}>{languages.buttons.delete[$language]}</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<p>*********************</p>
	<div>
		<button on:click={() => newItemModal?.showModal()}>{languages.buttons.itemPlus[$language]}</button>
	</div>
	<br>
	<div>
		<button on:click={() => shareCategory(category, $items)}>{languages.buttons.share[$language]}</button>
		<button on:click={() => copyCategoryAsText(category, $items)}>{languages.buttons.copyAsText[$language]}</button>
	</div>

	<!-- DIALOGS -->
	<!-- New Item -->
	<dialog bind:this={newItemModal}>
		<h3>{languages.content.newItem[$language]}</h3>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.name} placeholder={languages.content.name[$language]}>
		<br>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.description} placeholder={languages.content.description[$language]}>
		<br>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.quantity} placeholder={languages.content.quantity[$language]}>
		<br>
		<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		<button on:click={createNewItem}>{languages.buttons.add[$language]}</button>
	</dialog>
	
	<!-- Edit Item -->
	<dialog bind:this={editItemModal}>
		<h3>{languages.content.editItem[$language]}</h3>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.name} placeholder={languages.content.name[$language]}>
		<br>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.description} placeholder={languages.content.description[$language]}>
		<br>
		<input class:rtl={$language === 'he'} type="text" bind:value={itemFields.quantity} placeholder={languages.content.quantity[$language]}>
		<br>
		<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		<button on:click={editItem}>{languages.buttons.edit[$language]}</button>
	</dialog>

	<!-- Transfer Item -->
	<dialog bind:this={transferModal}>
		<h3>{languages.content.transferItem[$language]}</h3>
		<select name="" id="" bind:value={selectedTransferCategory}>
			<option value="default" selected>{languages.content.chooseCategory[$language]}</option>
			{#each $orderedCategories as categoryId (categoryId)}
				{#if category.id !== $categories[categoryId].id}
					<option value={categoryId}>{$categories[categoryId].name}</option>
				{/if}
			{/each}
		</select>
		<br>
		<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		<button on:click={changeItemCategory}>{languages.buttons.transfer[$language]}</button>
	</dialog>

	<!-- Move Items -->
	<dialog bind:this={moveItemsModal}>
		<h3>{languages.content.moveItems[$language]}</h3>
		<p>Mode: {moveMode}</p>
		<div class="move-items-wrapper">
			{#each moveItemInfo.items as itemId, index (itemId)}
				<p 
				  on:click={() => moveItemFromTo(index)}
				  class:moveOption={(moveMode === 'target') && (index !== moveItemInfo.from)}
				  class:moveSource={(moveMode === 'target') && (index === moveItemInfo.from)}
				>
				{$items[itemId].name}
				</p>
			{/each}
		</div>
		<br>
		<button on:click={closeModal}>{languages.buttons.close[$language]}</button>
		<button on:click={reorderItems}>{languages.buttons.done[$language]}</button>
	</dialog>
</section>

<style lang="scss">
	section {
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.buttons {
		background-color: gray;
		padding: 5px 0;
		
		button {
			padding: 5px;
			border-radius: 4px;
			border: 1px solid black;
		}
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

	.itemsL {
		text-align: left;
	}

	.itemsR {
		text-align: right;
	}

	.item-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.rtl {
		direction: rtl;	
	}
	
	.item {
		flex: 1;
		padding: 5px 10px;
		margin-right: 5px;
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

		.move-items-wrapper {
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
