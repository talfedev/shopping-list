import { collection, doc, getDocs, query, where, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { NewItem, NewCategory, Category } from '$lib/types/myTypes';


// collections
export const itemsCollection = collection(db, 'items');
export const categoriesCollection = collection(db, 'categories');


// DATABASE FUNCTIONS (to make life easier)

export async function getCategories() {
	const categoriesSnapshot = await getDocs(categoriesCollection);
	const catgoriesList = categoriesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	return catgoriesList as {id: string, name: string}[];
}

export async function getItems(id: string) {
	const categoryRef = doc(db, "categories", id);
	const q = query(itemsCollection, where('category', '==', id));
	const itemsSnapshot = await getDocs(q);
	const itemsList = itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	return itemsList;
}

//create new category
export async function addCategory(docFields: NewCategory) {
	console.log("trying to create new category!");
	if(docFields.name) {
		const categoryDocRef = await addDoc(categoriesCollection, docFields);
		console.log("new category id:",categoryDocRef.id);
	} else {
		console.log("Must provide name to create a category");
	}
}

//delete category
export async function deleteCategory(docId: string) {
	console.log("trying to delete category!");
	const docRef = doc(db, 'categories', docId);
	try {
		await deleteDoc(docRef);
		console.log('Category deleted.');
	} catch (err) {
		console.error('Failed to delete category');
	}
}

//edit category
export async function updateCategory(updatedCategory: Category,) {
	if(updatedCategory.name) {
		console.log("trying to edit category!");
		const docRef = doc(db, 'categories', updatedCategory.id);
		try {
			const response = await updateDoc(docRef,{
				name: updatedCategory.name
			});
			console.log('Category updated!');
		} catch (err) {
			console.error('Failed to update category')
		}
	} else {
		console.log('Category name cannot be empty.')
	}
	
}

export async function addItem(docFields: NewItem) {
	const itemDocRef = await addDoc(itemsCollection, docFields);
	console.log(itemDocRef);
}