import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdo_u9NbVGt9DYV0SSoPsdYxmseobgmfs",
  authDomain: "tournament-bracket-6d064.firebaseapp.com",
  projectId: "tournament-bracket-6d064",
  storageBucket: "tournament-bracket-6d064.firebasestorage.app",
  messagingSenderId: "205110667035",
  appId: "1:205110667035:web:4ee64c8a872df05ae8d5be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;