// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4fyenrgFoZhsBG-36lrczcwPlNvdF3Bc",
    authDomain: "amovilesii.firebaseapp.com",
    projectId: "amovilesii",
    storageBucket: "amovilesii.appspot.com",
    messagingSenderId: "1083373743972",
    appId: "1:1083373743972:web:2961d305dbcaa8ab225471"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// constante para obtener servicio de autenticacion
//export const auth = getAuth(firebase);
export const auth = initializeAuth(firebase,
    {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    }
)

//Referencia dal servicio de la BDD
export const dbRealTime = getDatabase(firebase);