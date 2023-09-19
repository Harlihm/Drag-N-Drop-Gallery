// Import the functions you need from the SDKs you need
import { initializeApp, getApp,getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"
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
const app =!getApps().length ? initializeApp(firebaseConfig):getApp();
 const db = getFirestore();
 const storage = getStorage();
export { app ,db ,storage}