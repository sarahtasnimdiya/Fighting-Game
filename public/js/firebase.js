// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKy-EoxAKHSRDutgsJL-juho-kRtpFOFY",
  authDomain: "fighting-game-4d09a.firebaseapp.com",
  databaseURL: "https://fighting-game-4d09a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fighting-game-4d09a",
  storageBucket: "fighting-game-4d09a.firebasestorage.app",
  messagingSenderId: "268390110419",
  appId: "1:268390110419:web:7e07112279a0821a133026",
  measurementId: "G-BC2N7G351Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);