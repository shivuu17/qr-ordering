import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCSIRLl9sqAeMnbbBjStad6RYaVOhBeOHE",
  authDomain: "shivank-katiyar-portfolio.firebaseapp.com",
  projectId: "shivank-katiyar-portfolio",
  storageBucket: "shivank-katiyar-portfolio.firebasestorage.app",
  messagingSenderId: "79018887912",
  appId: "1:79018887912:web:cc0cce74a56370363b575d",
  measurementId: "G-T1SFRP1KB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// isDummyConfig is now false because we have real keys
export const isDummyConfig = false;

export default app;
