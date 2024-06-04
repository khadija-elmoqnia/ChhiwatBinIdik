// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Importez la méthode getDatabase
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANlGhbfyW3aNKlep2kSKeZ7tEEPBdxEqY",
  authDomain: "chehiwatbinidik-75756.firebaseapp.com",
  databaseURL: "https://chehiwatbinidik-75756-default-rtdb.firebaseio.com",
  projectId: "chehiwatbinidik-75756",
  storageBucket: "chehiwatbinidik-75756.appspot.com",
  messagingSenderId: "869924086974",
  appId: "1:869924086974:web:27acc27453bd45ad532aef",
  measurementId: "G-YXMS4GNDWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const realtimeDatabase = getDatabase(app); // Initialisez la base de données Realtime Database

export { app, analytics, firestore, storage,realtimeDatabase,firebaseConfig };
