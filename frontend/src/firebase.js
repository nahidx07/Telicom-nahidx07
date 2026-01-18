import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEP-QxOWEBjgbMhhefhwCVwRRYRGhMn6w",
  authDomain: "telicombangla-nahidx07.firebaseapp.com",
  projectId: "telicombangla-nahidx07",
  storageBucket: "telicombangla-nahidx07.firebasestorage.app",
  messagingSenderId: "444981874439",
  appId: "1:444981874439:web:f66d2d5da2b0a0a497ffa2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

