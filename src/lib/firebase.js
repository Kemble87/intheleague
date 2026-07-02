import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDVl4kGIaPJCJoPkW5tIlpfX8Do1Ra0-ZA",
  authDomain: "intheleage.firebaseapp.com",
  databaseURL: "https://intheleage-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "intheleage",
  storageBucket: "intheleage.firebasestorage.app",
  messagingSenderId: "571346868241",
  appId: "1:571346868241:web:af7adfc9655672f4bab9b0"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
