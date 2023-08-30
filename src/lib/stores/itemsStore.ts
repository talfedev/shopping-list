import { onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { itemsCollection } from '$lib/firebase/firestore';
import type { Item } from '$lib/types/myTypes';

const itemsStore = () => {
	const { subscribe } = writable<{[key:string]: Item}>({}, (set) => {
		console.log('items store initialized');
		const items: {[key:string]: Item} = {};
		const unsubscribe = onSnapshot(itemsCollection,(snapshot) => {
			console.log('itemsStore updated!');
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'removed') {
					delete items[change.doc.id];
				} else if (change.type === 'added') {
					// console.log(`${change.doc.data().name}:`, change.newIndex);
					items[change.doc.id] = { ...change.doc.data(), id: change.doc.id } as Item
				} else if ('modified') {
					// console.log(`${change.doc.data().name} - old: ${change.oldIndex}, new: ${change.newIndex}`);
					items[change.doc.id] = { ...change.doc.data(), id: change.doc.id } as Item;
				}
			});
			set(items);
		},
		(error) => {
			console.log('onSnapshot (items) error:', error);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};

export const items = itemsStore();
