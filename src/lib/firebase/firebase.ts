// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCjUuIA2ttv_7yTcYcZ_NUGkjirQF83Edw',
	authDomain: 'shoppiong-list.firebaseapp.com',
	projectId: 'shoppiong-list',
	storageBucket: 'shoppiong-list.appspot.com',
	messagingSenderId: '919115801332',
	appId: '1:919115801332:web:4bad084c58e169740a34a1'
};

// Initialize Firebase, auth and firestore
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
