// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-5VSZVmsTvrHv-rvifLRWSOIzBGhkaYI",
  authDomain: "ev-charge-hub-4dbbb.firebaseapp.com",
  projectId: "ev-charge-hub-4dbbb",
  storageBucket: "ev-charge-hub-4dbbb.appspot.com", // fixed extension
  messagingSenderId: "992947424173",
  appId: "1:992947424173:web:8b24e6c5526ad09ab22f24",
  measurementId: "G-0Y4RVQ2RR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
