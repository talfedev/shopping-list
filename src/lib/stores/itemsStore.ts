import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { itemsCollection } from '$lib/firebase/firestore';

interface itemsStore {
    id: string;
    name: string;
    category: string;
    checked: boolean;
    description?: string;
    quantity?: string;
}

const itemsStore = () => {
	const { subscribe } = writable<itemsStore[]>([], (set) => {
		const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
			const items: itemsStore[] = [];
            snapshot.forEach(doc => items.push({...doc.data(), id: doc.id} as itemsStore));
            set(items);
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

export const items = itemsStore();
