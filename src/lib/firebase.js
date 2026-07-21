import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAnalytics, isSupported } from 'firebase/analytics'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "intheleage.firebaseapp.com",
  databaseURL: "https://intheleage-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "intheleage",
  storageBucket: "intheleage.firebasestorage.app",
  messagingSenderId: "571346868241",
  appId: "1:571346868241:web:af7adfc9655672f4bab9b0",
  measurementId: "G-C86SLBT6YH"
}
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
// Analytics — only initialise in browsers that support it
export let analytics = null
isSupported().then((yes) => { if (yes) analytics = getAnalytics(app) })
