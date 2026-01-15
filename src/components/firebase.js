// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS OBJECT WITH YOUR ACTUAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAPcDxKbxgXtigeF4ivYzqUaAQ_4hKU09c",
    authDomain: "rently-343c2.firebaseapp.com",
    projectId: "rently-343c2",
    storageBucket: "rently-343c2.firebasestorage.app",
    messagingSenderId: "361130905190",
    appId: "1:361130905190:web:dfa8b7a35bb9eae79427a7",
    measurementId: "G-Y4WSZ3DSVM"
};

const app = initializeApp(firebaseConfig);

// Export the tools we need
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);