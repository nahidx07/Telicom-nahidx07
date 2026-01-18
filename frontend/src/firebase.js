import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Vercel বা .env ফাইল থেকে তথ্যগুলো এখানে আসবে
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ফায়ারবেস ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// সার্ভিসগুলো এক্সপোর্ট করা যাতে অন্য ফাইল থেকে ব্যবহার করা যায়
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
