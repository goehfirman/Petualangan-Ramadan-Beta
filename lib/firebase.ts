import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// PENTING: Ganti konfigurasi ini dengan milik Anda dari Console Firebase
// Cara dapat: Buka console.firebase.google.com -> Buat Project -> Add Web App -> Copy Config
const firebaseConfig = {
  apiKey: "API_KEY_ANDA_DISINI",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);