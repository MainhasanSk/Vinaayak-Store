import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCDJG2jqm4eiDtBY1965YzfqJICZPQ0x7g",
    authDomain: "vinayak-store-91318.firebaseapp.com",
    projectId: "vinayak-store-91318",
    storageBucket: "vinayak-store-91318.firebasestorage.app",
    messagingSenderId: "520247395089",
    appId: "1:520247395089:web:3e0dc09016e3ff14d982b0",
    measurementId: "G-GKY8EPEFSD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
