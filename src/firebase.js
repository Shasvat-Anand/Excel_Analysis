import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ use realtime db

const firebaseConfig = {
   apikey:---
  authDomain: "excelanalysis-2106f.firebaseapp.com",
  databaseURL: "https://excelanalysis-2106f-default-rtdb.firebaseio.com",
  projectId: "excelanalysis-2106f",
  storageBucket: "excelanalysis-2106f.appspot.com",
  messagingSenderId: "433893282565",
  appId: "1:433893282565:web:7f8afe5f5ef44602539d6c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app); // ✅

export { auth, db };

