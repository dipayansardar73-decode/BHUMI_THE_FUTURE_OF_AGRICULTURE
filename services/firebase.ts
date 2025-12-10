import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuvRKdS9-J6nfAs7S2_LZ0Cw2JLy5hspw",
  authDomain: "bhumi-farming.firebaseapp.com",
  projectId: "bhumi-farming",
  storageBucket: "bhumi-farming.firebasestorage.app",
  messagingSenderId: "2596799742",
  appId: "1:2596799742:web:582714ecd968e8cec591af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);