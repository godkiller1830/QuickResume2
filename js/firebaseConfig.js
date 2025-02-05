// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdh82EMOfJDGth02uZ1jmzlZ7nqd79d1c",
    authDomain: "quickresume-dbf57.firebaseapp.com",
    projectId: "quickresume-dbf57",
    storageBucket: "quickresume-dbf57.firebasestorage.app",
    messagingSenderId: "288009008178",
    appId: "1:288009008178:web:4f2bb42ea3b0c98cdef82b",
    measurementId: "G-3K0H6R1TV0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, db, provider };