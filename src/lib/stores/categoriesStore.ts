import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { categoriesCollection } from '$lib/firebase/firestore';
import type { Category } from '$lib/types/myTypes';

const categoriesStore = () => {
	const { subscribe } = writable<Category[]>([], (set) => {
		const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
			console.log('categoriesStore updated!');
			const categories: Category[] = [];
			snapshot.forEach(doc => {
				categories.push({
					id: doc.id,
					name: doc.data().name,
					items: doc.data().items? doc.data().items: [] 
				});
			});
            set(categories);
		},
		(error) => {
			console.log("onSnapshot (categories) error:",error);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};

export const categories = categoriesStore();
