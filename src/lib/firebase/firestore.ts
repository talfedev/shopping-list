import {
	collection,
	doc,
	getDocs,
	query,
	where,
	addDoc,
	setDoc,
	deleteDoc,
	updateDoc,
	orderBy,
	writeBatch,
	arrayUnion,
	arrayRemove
} from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { Item, NewItem, NewCategory, Category, ItemChecked } from '$lib/types/myTypes';

// collections
export const itemsCollection = collection(db, 'items');
export const categoriesCollection = collection(db, 'categories');

// DATABASE FUNCTIONS (to make life easier)

//get all categories
export async function getCategories() {
	const categoriesSnapshot = await getDocs(categoriesCollection);
	const catgoriesList = categoriesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	return catgoriesList as { id: string; name: string }[];
}

//get all items
export async function getItems(id: string) {
	const categoryRef = doc(db, 'categories', id);
	const q = query(itemsCollection, where('category', '==', id));
	const itemsSnapshot = await getDocs(q);
	const itemsList = itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	return itemsList;
}

// CATEGORIES

//create new category
export async function addCategory(docFields: Omit<NewCategory, 'items'>) {
	if (docFields.name) {
		console.log('trying to create new category');
		try {
			const categoryDocRef = await addDoc(categoriesCollection, {...docFields, items: []});
			console.log('new category id:', categoryDocRef.id);
		} catch (err) {
			console.log('failed to create new category:', err);
		}
	} else {
		console.log('Must provide name to create a category');
	}
}

//delete a category
export async function deleteCategory(category: Category) {
	console.log('trying to delete category');
	const batch = writeBatch(db);

	const categoryRef = doc(db, 'categories', category.id);

	category.items.forEach(item => {
		const itemRef = doc(db, 'items', item);
		batch.delete(itemRef);
	})

	batch.delete(categoryRef);
	
	try {
		const response = await batch.commit();
		console.log('Category deleted. fireStore response:', response);
	} catch (err) {
		console.error('Failed to delete category:', err);
	}
}

//edit a category
export async function updateCategory(updatedCategory: Omit<Category, 'items'>) {
	if (updatedCategory.name) {
		console.log('trying to edit category');
		const docRef = doc(db, 'categories', updatedCategory.id);
		try {
			const response = await updateDoc(docRef, {
				name: updatedCategory.name
			});
			console.log('Category edited!');
		} catch (err) {
			console.error('Failed to edit category:', err);
		}
	} else {
		console.log('Category name cannot be empty.');
	}
}

//modify category's items array
export async function modifyCategoryItems(categoryId: string, newItems: string[]) {
	console.log("trying to edit category's items");
	const docRef = doc(db, 'categories', categoryId);
	try {
		const response = await updateDoc(docRef, {
			items: newItems
		});
		console.log("Category's items edited!");
	} catch (err) {
		console.error("Failed to edit category's items:", err);
	}
} // !!** probably delete this function **!!

// ITEMS

//create a new item
export async function addItem(docFields: NewItem) {
	if (docFields.name) {
		console.log('trying to create new item');
		const batch = writeBatch(db);

		//add (create item) request to batch
		const itemRef = doc(itemsCollection);
		batch.set(itemRef, docFields);

		//add (add item to category's items) request to batch
		const categoryRef = doc(db, 'categories', docFields.category);
		batch.update(categoryRef, {items: arrayUnion(itemRef.id)});

		//commit batch
		try {
			const response = await batch.commit();
			console.log('New item added!, batch response:',response);
		} catch (err) {
			console.error('Failed to create a new item:', err);
		}
	} else {
		console.log("Item's name cannot be empty");
	}
}

//delete an item
export async function deleteItem(docId: string, categoryId: string) {
	console.log('trying to delete item');
	const batch = writeBatch(db);

	//add (delete item) request to batch
	const itemDocRef = doc(db, 'items', docId);
	batch.delete(itemDocRef);

	//add (remove item from category's items) request to batch
	const categoryRef = doc(db, 'categories', categoryId);
	batch.update(categoryRef, {items: arrayRemove(docId)});

	
	try {
		const response = await batch.commit();
		console.log('Item deleted. batch response:', response);
	} catch (err) {
		console.error('Failed to delete item:', err);
	}
}

//edit an item
export async function updateItem(updatedItem: Omit<Item, 'checked'|'category'>) {
	if (updatedItem.name) {
		console.log('trying to edit item');
		const docRef = doc(db, 'items', updatedItem.id);
		try {
			const response = await updateDoc(docRef, {
				name: updatedItem.name,
				description: updatedItem.description,
				quantity: updatedItem.quantity,
			});
			console.log('Item edited!');
		} catch (err) {
			console.error('Failed to edit item:', err);
		}
	} else {
		console.log('Item name cannot be empty.');
	}
}

//check|uncheck an item
export async function toggleItem(updatedItem: ItemChecked) {
	console.log('trying to check/uncheck item');
	const docRef = doc(db, 'items', updatedItem.id);
	try {
		const response = await updateDoc(docRef, {
			checked: updatedItem.checked
		});
		console.log('Item checked/unchecked!');
	} catch (err) {
		console.error('Failed to check/uncheck item:', err);
	}
}

//move an item inside a category
export async function moveItems(categoryId: string, newItems: string[]) {
	//get category
	const categoryRef = doc(db, 'categories', categoryId);

	//set category's items to desired order
	try{
		const response = await updateDoc(categoryRef, {
			items: newItems
		})
		console.log('Item moved! :D. firestore response:', response);
	} catch (err) {
		console.log('Failed to move item. error:', err);
	}
}

//transfer an item to a different category
export async function transferItem(sourceCategoryId: string, targetCategoryId: string, itemId: string) {
	//
	const batch = writeBatch(db);

	const sourceRef = doc(db, 'categories', sourceCategoryId);
	const targetRef = doc(db, 'categories', targetCategoryId);

	batch.update(sourceRef, {items: arrayRemove(itemId)});
	batch.update(targetRef, {items: arrayUnion(itemId)});

	try {
		const response = await batch.commit();
		console.log('Item transferred!. firestore response:', response);
	} catch (err) {
		console.log('Failed to transfer item. error:', err);
	}
}