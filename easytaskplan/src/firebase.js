// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVN9aZPJ_4ovfAiTrpz7h6HJvlg7wR8iM",
  authDomain: "easytaskplan.firebaseapp.com",
  projectId: "easytaskplan",
  storageBucket: "easytaskplan.appspot.com",
  messagingSenderId: "627650669623",
  appId: "1:627650669623:web:760883420a09cceaeae3b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
