import { goto } from '$app/navigation';
import { auth } from '$lib/firebase/firebase';
import {
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

// AUTH FUNCTIONS (to make life easier)

export async function createUser(email: string, password: string) {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		console.log('account created!:', user);

	} catch (error: any) {
		const errorCode = error.code;
		console.log('email & password account creation failed:', error.message)
	};
}

export async function passwordSignin(email: string, password: string) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		const user = userCredential.user;
		console.log('logged-in!:', user);
	} catch (error: any) {
		const errorCode = error.code;
		console.log('email & password sign in failed:',error.message)
	}
}

export async function signin() {
	let signinResponse;
	try {
		signinResponse = await signInWithPopup(auth, provider);
	} catch (err) {
		console.log('log error:', err);
	}
}

export async function signout() {
	const signoutResponse = await signOut(auth);
	goto('/login');
}
