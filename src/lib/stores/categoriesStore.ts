import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { categoriesCollection } from '$lib/firebase/firestore';
import { dataLoading } from './allStores';
import type { Category } from '$lib/types/myTypes';

const categoriesStore = () => {
	const { subscribe } = writable<{[key: string]: Category}>({}, (set) => {
		const categories: {[key: string]: Category} = {};
		const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
			console.log('categoriesStore updated!');
			dataLoading.update(prev => ({...prev, categories: false}));
			snapshot.docChanges().forEach(change => {
				if (change.type === 'removed') {
					delete categories[change.doc.id];
				} else if (change.type === 'added') {
					categories[change.doc.id] = { ...change.doc.data(), id: change.doc.id } as Category;
				} else if ('modified') {
					categories[change.doc.id] = { ...change.doc.data(), id: change.doc.id } as Category;
				}
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
