import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhuqIERFa6L8mvQVtpFaWlWF_Gl9HwTew",
  authDomain: "devvv-a578a.firebaseapp.com",
  projectId: "devvv-a578a",
  storageBucket: "devvv-a578a.firebasestorage.app",
  messagingSenderId: "817872540914",
  appId: "1:817872540914:web:0dadfe1471c64303d4ec6b",
  measurementId: "G-YVQHR81S30"
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