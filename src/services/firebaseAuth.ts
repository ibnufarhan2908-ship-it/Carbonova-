import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase.ts'
import type { User, UserRole } from '../types/auth.ts'

/**
 * Mengonversi FirebaseUser + data profil Firestore menjadi model User aplikasi
 */
export async function getOrCreateUserProfile(
  fbUser: FirebaseUser,
  defaultRole: UserRole = 'student'
): Promise<User> {
  if (!db) {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: defaultRole,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }
  }

  const userDocRef = doc(db, 'users', fbUser.uid)
  const userSnapshot = await getDoc(userDocRef)

  const now = new Date().toISOString()

  if (userSnapshot.exists()) {
    const data = userSnapshot.data()
    // Perbarui lastLoginAt di Firestore
    try {
      await updateDoc(userDocRef, { lastLoginAt: now })
    } catch {
      // Abaikan jika rule Firestore terbatas
    }

    return {
      id: fbUser.uid,
      name: data.name || fbUser.displayName || 'Pengguna',
      email: data.email || fbUser.email || '',
      role: (data.role as UserRole) || defaultRole,
      status: data.status || 'active',
      createdAt: data.createdAt || now,
      lastLoginAt: now,
    }
  }

  // Jika dokumen profil belum ada di Firestore, buat profil baru
  const newProfile: User = {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna Baru',
    email: fbUser.email || '',
    role: defaultRole,
    status: 'active',
    createdAt: now,
    lastLoginAt: now,
  }

  try {
    await setDoc(userDocRef, newProfile)
  } catch (err) {
    console.warn('Gagal menyimpan profil baru ke Firestore:', err)
  }

  return newProfile
}

/**
 * Login pengguna menggunakan Firebase Authentication
 */
export async function firebaseSignIn(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!auth || !isFirebaseConfigured) {
    return { success: false, error: 'Layanan Firebase belum diinisialisasi atau konfigurasi kosong.' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass)
    const user = await getOrCreateUserProfile(userCredential.user)
    return { success: true, user }
  } catch (error: any) {
    console.error('Firebase sign-in error:', error)
    let message = 'Terjadi kesalahan saat masuk dengan Firebase.'
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      message = 'Email atau kata sandi tidak sesuai.'
    } else if (error.code === 'auth/user-not-found') {
      message = 'Akun dengan email ini belum terdaftar.'
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format alamat email tidak valid.'
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Terlalu banyak percobaan masuk yang gagal. Silakan tunggu beberapa saat.'
    }
    return { success: false, error: message }
  }
}

/**
 * Pendaftaran akun baru (Siswa / Guru) ke Firebase Authentication & Firestore
 */
export async function firebaseSignUp(
  name: string,
  email: string,
  pass: string,
  role: UserRole = 'student'
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!auth || !isFirebaseConfigured) {
    return { success: false, error: 'Layanan Firebase belum diinisialisasi atau konfigurasi kosong.' }
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass)
    const fbUser = userCredential.user

    // Perbarui displayName di Firebase Auth
    if (name.trim()) {
      try {
        await updateProfile(fbUser, { displayName: name.trim() })
      } catch (err) {
        console.warn('Gagal memperbarui displayName Firebase:', err)
      }
    }

    // Buat dokumen profil di Firestore
    const now = new Date().toISOString()
    const newProfile: User = {
      id: fbUser.uid,
      name: name.trim() || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role,
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }

    if (db) {
      await setDoc(doc(db, 'users', fbUser.uid), newProfile)
    }

    return { success: true, user: newProfile }
  } catch (error: any) {
    console.error('Firebase sign-up error:', error)
    let message = 'Pendaftaran gagal.'
    if (error.code === 'auth/email-already-in-use') {
      message = 'Alamat email ini sudah terdaftar. Silakan langsung masuk.'
    } else if (error.code === 'auth/weak-password') {
      message = 'Kata sandi terlalu lemah. Minimal 6 karakter.'
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format alamat email tidak valid.'
    }
    return { success: false, error: message }
  }
}

/**
 * Logout dari Firebase
 */
export async function firebaseSignOut(): Promise<void> {
  if (auth) {
    await signOut(auth)
  }
}

/**
 * Observer perubahan status autentikasi Firebase
 */
export function subscribeToFirebaseAuthState(
  callback: (user: User | null) => void
): () => void {
  if (!auth || !isFirebaseConfigured) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const user = await getOrCreateUserProfile(fbUser)
        callback(user)
      } catch (err) {
        console.error('Error fetching user profile from Firestore:', err)
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}
