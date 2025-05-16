// lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKIF78CDkJgYcVjrnUnvxlvfutbdXoj2A",
  authDomain: "vetconnect-e3cda.firebaseapp.com",
  projectId: "vetconnect-e3cda",
  storageBucket: "vetconnect-e3cda.appspot.com",
  messagingSenderId: "475571670346",
  appId: "1:475571670346:android:05f5e576c519b639b945b3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
