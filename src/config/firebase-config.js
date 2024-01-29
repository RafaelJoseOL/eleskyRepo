import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdgPWyZX2FxWWJgNcoIbBqnLRjlpu_OdM",
  authDomain: "eleskyrepo.firebaseapp.com",
  projectId: "eleskyrepo",
  storageBucket: "eleskyrepo.appspot.com",
  messagingSenderId: "390599492204",
  appId: "1:390599492204:web:94f0ae4e246bc998f7ce49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configuración de Firebase Authentication
export const auth = getAuth(app);

// Configuración de Firestore
export const db = getFirestore(app);

export const storage = getStorage(app);