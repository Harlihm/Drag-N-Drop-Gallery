// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth}  from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwOnOWWlz1nsLxl82VJq1ozYC-s0mjzxY",
  authDomain: "drag-n-drop-auth.firebaseapp.com",
  projectId: "drag-n-drop-auth",
  storageBucket: "drag-n-drop-auth.appspot.com",
  messagingSenderId: "21282417396",
  appId: "1:21282417396:web:6281078db33aa4176e4ca1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getAuth(app)