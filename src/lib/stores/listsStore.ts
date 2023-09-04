import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { listsCollection } from '$lib/firebase/firestore';
// import type { Category } from '$lib/types/myTypes';

/**
 * right now this only works if there is one list,
 * if you want to make more lists possible you need to refactor
 * this code.
 * spesifically right now it only uses the last list (as ordered
 * in the database)
 */

const listsStore = () => {
	const { subscribe } = writable<string[]>([], (set) => {
		const unsubscribe = onSnapshot(listsCollection, (snapshot) => {
			console.log('listsStore updated!');
			let sortedCategories: string[] = [];
			snapshot.forEach(doc => {
				sortedCategories = doc.data().categories;
			});
            set(sortedCategories);
		},
		(error) => {
			console.log("onSnapshot (lists) error:",error);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};

export const orderedCategories = listsStore();
