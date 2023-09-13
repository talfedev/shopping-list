import { onAuthStateChanged, type Auth } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from '$lib/firebase/firebase';
import { userLoading } from '$lib/stores/allStores';

const userStore = () => {
	let unsubscribe: () => void;

	const { subscribe } = writable(auth.currentUser, (set) => {
		console.log('initilized user store')
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
			console.log(user);
			userLoading.set(false);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};

export const user = userStore();
