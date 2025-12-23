import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOpa0PqeaiRQRVtbezwp4iYaXov_oY51g",
  authDomain: "mi-restaurante-reservas-761b1.firebaseapp.com",
  projectId: "mi-restaurante-reservas-761b1",
  storageBucket: "mi-restaurante-reservas-761b1.appspot.com",
  messagingSenderId: "504225678178",
  appId: "1:504225678178:web:ec29b7a8bd05855802623b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
