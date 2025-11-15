import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcC9iwpCiXLq3s8JSd0PPr-2Ib1kaYymA",
  authDomain: "imposter-game-9dbbf.firebaseapp.com",
  databaseURL: "https://imposter-game-9dbbf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "imposter-game-9dbbf",
  storageBucket: "imposter-game-9dbbf.firebasestorage.app",
  messagingSenderId: "300886401986",
  appId: "1:300886401986:web:a53ef8b2b3c00569d0ac5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);