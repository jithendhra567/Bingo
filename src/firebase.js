import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSsd_1eGnmcQYDMhkG1IYx65jQvk6lD9U",
    authDomain: "bingo-ce128.firebaseapp.com",
    projectId: "bingo-ce128",
    storageBucket: "bingo-ce128.appspot.com",
    messagingSenderId: "98649008679",
    appId: "1:98649008679:web:61ebb47a4bae74d1c1fc02",
    measurementId: "G-H6PZFD1FZZ"
};

firebase.initializeApp(firebaseConfig);

export default firebase;