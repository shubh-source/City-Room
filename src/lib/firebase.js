import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6_xc6JM7RUb3kcwhA4XKtL-ZTQSi3Gpc",
  authDomain: "city-rooms-8f7ed.firebaseapp.com",
  projectId: "city-rooms-8f7ed",
  storageBucket: "city-rooms-8f7ed.firebasestorage.app",
  messagingSenderId: "173301158154",
  appId: "1:173301158154:web:b6fbea33af20c2050deaf3",
  measurementId: "G-E4FTSM7NJF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
