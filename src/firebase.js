// 🔥 IMPORTAÇÕES
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 CONFIG DO SEU PROJETO (DO SEU PRINT)
const firebaseConfig = {
  apiKey: "AIzaSyAFMTL8fxd4TGVuuLVQm1mDHFLYER0aYcc",
  authDomain: "barbearia-app-97e02.firebaseapp.com",
  projectId: "barbearia-app-97e02",
  storageBucket: "barbearia-app-97e02.appspot.com",
  messagingSenderId: "419913459794",
  appId: "1:419913459794:web:83324da182c4c9e68f578b",
  measurementId: "G-SJ527J0GEL"
};

// 🔥 INICIALIZA O FIREBASE
const app = initializeApp(firebaseConfig);

// 🔥 BANCO DE DADOS (FIRESTORE)
const db = getFirestore(app);

// 🔥 EXPORTA PRA USAR NO APP
export { db };