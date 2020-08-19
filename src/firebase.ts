import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeHyCDbpOJezKvZhpNG9G524owwVCwZLQ",
    authDomain: "language-flashcards-8e50d.firebaseapp.com",
    databaseURL: "https://language-flashcards-8e50d.firebaseio.com",
    projectId: "language-flashcards-8e50d",
    storageBucket: "language-flashcards-8e50d.appspot.com",
    messagingSenderId: "606602736414",
    appId: "1:606602736414:web:87342c30f8d82fa8f64f0f",
    measurementId: "G-9JYJMZNNQL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const db = firebase.firestore();
  export const auth = firebase.auth();