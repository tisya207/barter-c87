import * as firebase from "firebase";
require("@firebase/firestore");
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBHT6iBTtWGa8R1-rtbTo3u2yihPYdf4GQ",
  authDomain: "barter-77.firebaseapp.com",
  projectId: "barter-77",
  storageBucket: "barter-77.appspot.com",
  messagingSenderId: "550806384379",
  appId: "1:550806384379:web:e98c327b2d53f12e72ca5e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
