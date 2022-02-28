import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD57MmY93EW4004LJTVpoez0LYsRpHgoVY",
  authDomain: "thebank-88456.firebaseapp.com",
  projectId: "thebank-88456",
  storageBucket: "thebank-88456.appspot.com",
  messagingSenderId: "280121477421",
  appId: "1:280121477421:web:bd6ce661689ee90c682ba4",
};

// init firebase
initializeApp(firebaseConfig);

// init firestore
const db = getFirestore();

// init firebase auth
const auth = getAuth();

export { db, auth };
