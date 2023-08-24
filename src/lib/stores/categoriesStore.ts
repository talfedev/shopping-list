import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { categoriesCollection } from '$lib/firebase/firestore';

interface categoriesStore {
    id: string;
    name: string;
}

const categoriesStore = () => {
	const { subscribe } = writable<categoriesStore[]>([], (set) => {
		const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
			const categories: categoriesStore[] = [];
            snapshot.forEach(doc => categories.push({name: doc.data().name, id: doc.id}));
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
