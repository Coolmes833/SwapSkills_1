import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyCbwBI1WRZU7x-3h8RInCLkwHU8W78AlUE",
    authDomain: "swapskills-network.firebaseapp.com",
    projectId: "swapskills-network",
    storageBucket: "swapskills-network.firebasestorage.app",
    messagingSenderId: "458732562755",
    appId: "1:458732562755:web:f44e6e9d2dc60995da27f6",
    measurementId: "G-VWPDV52GE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };