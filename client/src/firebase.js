// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogging-c7284.firebaseapp.com",
  projectId: "blogging-c7284",
  storageBucket: "blogging-c7284.firebasestorage.app",
  messagingSenderId: "829694672187",
  appId: "1:829694672187:web:fdbcb30f7059d79b408b1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);