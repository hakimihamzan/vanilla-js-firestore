// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2j1HHHIra4783buvuIhJbA1SsbvwSyuU",
  authDomain: "crud-a6b1c.firebaseapp.com",
  projectId: "crud-a6b1c",
  storageBucket: "crud-a6b1c.appspot.com",
  messagingSenderId: "60816909381",
  appId: "1:60816909381:web:32c1a4615f671a238aef2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

//exporting db to use in my script
export { db };
