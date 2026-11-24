import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase.ts'
import type { User, UserRole } from '../types/auth.ts'
import { isTeacherAccount } from '../config/authConfig.ts'

/**
 * Mengonversi FirebaseUser + data profil Firestore menjadi model User aplikasi
 */
export async function getOrCreateUserProfile(
  fbUser: FirebaseUser,
  defaultRole: UserRole = 'student'
): Promise<User> {
  const now = new Date().toISOString()
  // Hak Akses AD11-01: Verifikasi akun guru tepercaya, bukan sekadar substring string email
  const isTeacher = isTeacherAccount(fbUser.email, fbUser.uid)
  const fallbackRole: UserRole = isTeacher ? 'teacher' : (defaultRole === 'teacher' && isTeacher ? 'teacher' : 'student')

  if (!db) {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: fallbackRole,
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }
  }

  try {
    const userDocRef = doc(db, 'users', fbUser.uid)
    const userSnapshot = await getDoc(userDocRef)

    if (userSnapshot.exists()) {
      const data = userSnapshot.data()
      try {
        await updateDoc(userDocRef, { lastLoginAt: now })
      } catch {
        // Abaikan jika rule Firestore terbatas
      }

      let parsedRole: UserRole = 'student'
      if (data.role === 'guru' || data.role === 'teacher') {
        // Hak Akses AD11-01: Role guru hanya diakui jika email/UID cocok dengan whitelist tepercaya
        if (isTeacherAccount(data.email || fbUser.email, fbUser.uid)) {
          parsedRole = 'teacher'
        } else {
          parsedRole = 'student'
        }
      }

      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'Pengguna',
        email: data.email || fbUser.email || '',
        role: parsedRole,
        kelas: data.kelas || '-',
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || now),
        lastLoginAt: now,
      }
    }

    // Jika dokumen profil belum ada di Firestore, buat profil baru
    const roleYangDipilih = fallbackRole === 'teacher' ? 'guru' : 'siswa'
    const newProfile: User = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: fallbackRole,
      kelas: '-',
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }

    try {
      await setDoc(userDocRef, {
        name: newProfile.name,
        email: newProfile.email,
        role: roleYangDipilih,
        kelas: '-',
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.warn('Gagal menyimpan profil baru ke Firestore (periksa Firestore Security Rules):', err)
    }

    return newProfile
  } catch (err) {
    console.warn('Gagal membaca profil dari Firestore:', err)
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: fallbackRole,
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }
  }
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
    if (error.code === 'auth/operation-not-allowed') {
      message = 'Metode login Email/Password belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method lalu aktifkan "Email/Password".'
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      message = 'Email atau kata sandi tidak sesuai. Jika ini akun baru, silakan daftar pada tab "Daftar Akun Baru".'
    } else if (error.code === 'auth/user-not-found') {
      message = 'Akun dengan email ini belum terdaftar di Firebase. Silakan daftar pada tab "Daftar Akun Baru".'
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format alamat email tidak valid.'
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Terlalu banyak percobaan masuk yang gagal. Silakan tunggu beberapa saat.'
    } else if (error.code === 'auth/unauthorized-domain') {
      message = 'Domain aplikasi ini belum diizinkan. Buka Firebase Console > Authentication > Settings > Authorized domains dan tambahkan domain yang digunakan.'
    } else if (error.code === 'auth/network-request-failed') {
      message = 'Gagal terhubung ke Firebase. Periksa koneksi internet Anda.'
    } else if (error.message) {
      message = error.message
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
  role: UserRole = 'student',
  kelas: string = '-'
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

    // Hak Akses AD11-01: Pendaftaran publik selalu dipaksa role 'student' ('siswa')
    // Role 'teacher' hanya diizinkan jika email/UID cocok dengan konfigurasi whitelist guru tepercaya
    const cleanEmail = email.trim().toLowerCase()
    const isTeacher = (role === 'teacher' || role === 'guru') && isTeacherAccount(cleanEmail, fbUser.uid)
    const effectiveRole: UserRole = isTeacher ? 'teacher' : 'student'
    const roleYangDipilih = effectiveRole === 'teacher' ? 'guru' : 'siswa'

    // Buat dokumen profil di Firestore menggunakan UID sebagai Document ID
    const now = new Date().toISOString()
    const newProfile: User = {
      id: fbUser.uid,
      name: name.trim() || fbUser.email?.split('@')[0] || 'Pengguna',
      email: cleanEmail,
      role: effectiveRole,
      kelas: kelas.trim() || '-',
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }

    if (db) {
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          name: newProfile.name,
          email: newProfile.email,
          role: roleYangDipilih,
          kelas: newProfile.kelas,
          createdAt: serverTimestamp(),
        })
      } catch (firestoreErr) {
        console.warn('Gagal menyimpan profil ke Firestore (periksa Firestore Security Rules):', firestoreErr)
      }
    }

    return { success: true, user: newProfile }
  } catch (error: any) {
    console.error('Firebase sign-up error:', error)
    let message = 'Pendaftaran gagal.'
    if (error.code === 'auth/operation-not-allowed') {
      message = 'Metode pendaftaran Email/Password belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method lalu aktifkan "Email/Password".'
    } else if (error.code === 'auth/email-already-in-use') {
      message = 'Alamat email ini sudah terdaftar di Firebase. Silakan gunakan tab "Masuk ke Akun".'
    } else if (error.code === 'auth/weak-password') {
      message = 'Kata sandi terlalu lemah. Minimal 6 karakter.'
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format alamat email tidak valid.'
    } else if (error.code === 'auth/unauthorized-domain') {
      message = 'Domain aplikasi ini belum diizinkan di Firebase Console. Buka Authentication > Settings > Authorized domains.'
    } else if (error.code === 'auth/network-request-failed') {
      message = 'Gagal terhubung ke Firebase. Periksa koneksi internet Anda.'
    } else if (error.message) {
      message = error.message
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
