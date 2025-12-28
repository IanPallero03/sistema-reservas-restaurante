import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyDOpa0PqeaiRQRVtbezwp4iYaXov_oY51g",
  authDomain: "mi-restaurante-reservas-761b1.firebaseapp.com",
  projectId: "mi-restaurante-reservas-761b1",
  storageBucket: "mi-restaurante-reservas-761b1.appspot.com",
  messagingSenderId: "504225678178",
  appId: "1:504225678178:web:ec29b7a8bd05855802623b"
};

const app = initializeApp(firebaseConfig);

// 🔥 EXPORTS CORRECTOS
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 ESTO SOLUCIONA TODO
