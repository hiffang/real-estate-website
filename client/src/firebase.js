// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcOkvnSHfMVakGWEcI0WAAwYZ5OIS73vo",
  authDomain: "mern-estate-d2472.firebaseapp.com",
  projectId: "mern-estate-d2472",
  storageBucket: "mern-estate-d2472.appspot.com",
  messagingSenderId: "150264647692",
  appId: "1:150264647692:web:afbba13aa625229fa25e29"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);

 export { auth,app };