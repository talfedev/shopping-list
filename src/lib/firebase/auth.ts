import { goto } from "$app/navigation";
import { auth } from "$lib/firebase/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, getRedirectResult } from 'firebase/auth';

const provider = new GoogleAuthProvider();


// AUTH FUNCTIONS (to make life easier)

export async function signin() {
	let signinResponse;
	try {
		signinResponse = await signInWithPopup(auth, provider);
	} catch (err) {
		console.log("log error:", err);
	}
}

export async function signout() {
    const signoutResponse = await signOut(auth);
	goto('/login');
}
