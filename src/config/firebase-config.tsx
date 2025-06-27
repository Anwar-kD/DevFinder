import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBO7qP3Y360DdRkM6LOpEx2_zyJJ9ROLF4",
  authDomain: "findev-3150b.firebaseapp.com",
  projectId: "findev-3150b",
  storageBucket: "findev-3150b.firebasestorage.app",
  messagingSenderId: "165855134104",
  appId: "1:165855134104:web:84f319899c81d5a32f2bed",
  measurementId: "G-DGB99DXCR4"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);