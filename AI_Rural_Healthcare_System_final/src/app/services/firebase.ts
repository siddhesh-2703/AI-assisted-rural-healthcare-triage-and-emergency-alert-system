import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMUz8va-_-R3v9NsB_81xhPslMOqrT9FU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "health-care-system-64cf0.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "health-care-system-64cf0",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "health-care-system-64cf0.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "479996328557",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:479996328557:web:8c38cb32110b29e5b61d64",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X5TE5ZVM2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "us-central1");
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
