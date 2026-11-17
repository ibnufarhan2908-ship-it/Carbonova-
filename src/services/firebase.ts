import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key]
  }
  const globalObj = typeof globalThis !== 'undefined' ? (globalThis as any) : {}
  if (globalObj.process && globalObj.process.env && globalObj.process.env[key]) {
    return globalObj.process.env[key] || ''
  }
  return ''
}

/**
 * Konfigurasi Firebase dari Environment Variables Vite (.env) atau process.env
 */
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
}

/**
 * Memeriksa apakah kredensial Firebase telah diisi secara valid
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.apiKey !== 'your_api_key' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id_here'
)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.warn('Gagal menginisialisasi Firebase SDK:', error)
  }
}

export { app, auth, db }
export default firebaseConfig
