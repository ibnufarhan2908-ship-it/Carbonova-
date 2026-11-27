import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase.ts'
import type { User, UserRole } from '../types/auth.ts'
import { isTeacherAccount, resolveTeacherRole, isTeacherDemoAccount } from '../config/authConfig.ts'

/**
 * Mengonversi FirebaseUser + data profil Firestore menjadi model User aplikasi
 */
export async function getOrCreateUserProfile(
  fbUser: FirebaseUser,
  _defaultRole: UserRole = 'student'
): Promise<User> {
  const now = new Date().toISOString()
  // Hak Akses AD11-01: Verifikasi akun guru tepercaya
  const isTeacher = isTeacherAccount(fbUser.email, fbUser.uid)
<<<<<<< HEAD
  const isDemoTeacher = isTeacherDemoAccount(fbUser.email, fbUser.uid)
=======
>>>>>>> 0371e8544c92c247cbe218dbb4a16496d49b74eb
  const resolvedRole = isTeacher ? resolveTeacherRole(fbUser.email, fbUser.uid) : 'student'
  const fallbackRole: UserRole = isTeacher ? resolvedRole : 'student'

  if (!db) {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: fallbackRole,
      photoURL: fbUser.photoURL || undefined,
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
        const updatePayload: Record<string, any> = { lastLoginAt: now }
        if (fbUser.photoURL && !data.photoURL) {
          updatePayload.photoURL = fbUser.photoURL
        }
        await updateDoc(userDocRef, updatePayload)
      } catch {
        // Abaikan jika rule Firestore terbatas
      }

      let parsedRole: UserRole = 'student'
      if (data.role === 'guru' || data.role === 'teacher') {
        parsedRole = isTeacherAccount(data.email || fbUser.email, fbUser.uid) ? 'teacher' : 'student'
      }

      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'Pengguna',
        email: data.email || fbUser.email || '',
        role: parsedRole,
        photoURL: data.photoURL || fbUser.photoURL || undefined,
        kelas: data.kelas || '-',
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || now),
        lastLoginAt: now,
      }
    }

    // Jika dokumen profil belum ada di Firestore, buat profil baru
    const newProfile: User = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
      email: fbUser.email || '',
      role: fallbackRole,
      photoURL: fbUser.photoURL || undefined,
      kelas: '-',
      status: 'active',
      createdAt: now,
      lastLoginAt: now,
    }

<<<<<<< HEAD
      try {
        await setDoc(userDocRef, {
          name: newProfile.name,
          email: newProfile.email,
          role: effectiveRole,
          kelas: '-',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
=======
    try {
      await setDoc(userDocRef, {
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role,
        kelas: '-',
        createdAt: serverTimestamp(),
      })
    } catch (err) {
>>>>>>> 0371e8544c92c247cbe218dbb4a16496d49b74eb
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
      photoURL: fbUser.photoURL || undefined,
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
 * Login atau Registrasi menggunakan Google Sign-In (Firebase Authentication)
 */
export async function firebaseSignInWithGoogle(): Promise<{
  success: boolean
  user?: User
  error?: string
}> {
  if (!auth || !isFirebaseConfigured) {
    return {
      success: false,
      error:
        'Layanan Firebase belum diinisialisasi atau konfigurasi Firebase kosong di file .env.',
    }
  }

  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    const userCredential = await signInWithPopup(auth, provider)
    const fbUser = userCredential.user

    // Buat atau dapatkan dokumen profil dari Firestore (users/{uid})
    const user = await getOrCreateUserProfile(fbUser)

    return { success: true, user }
  } catch (error: any) {
    console.error('Firebase Google sign-in error:', error)
    let message = 'Terjadi kesalahan saat masuk dengan Google.'

    if (error.code === 'auth/popup-closed-by-user') {
      message =
        'Jendela login Google ditutup sebelum proses masuk selesai. Silakan coba kembali.'
    } else if (error.code === 'auth/cancelled-popup-request') {
      message =
        'Proses login Google dibatalkan karena ada jendela popup lain yang dibuka.'
    } else if (error.code === 'auth/popup-blocked') {
      message =
        'Jendela popup Google diblokir oleh browser. Harap izinkan popup pada peramban Anda lalu coba lagi.'
    } else if (error.code === 'auth/operation-not-allowed') {
      message =
        'Metode login Google belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method lalu aktifkan penyedia "Google".'
    } else if (error.code === 'auth/unauthorized-domain') {
      message =
        'Domain aplikasi ini belum diizinkan di Firebase Console. Buka Authentication > Settings > Authorized domains dan tambahkan domain yang Anda gunakan.'
    } else if (error.code === 'auth/network-request-failed') {
      message =
        'Gagal terhubung ke layanan Google/Firebase. Periksa koneksi internet Anda.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      message =
        'Akun dengan email ini sudah terdaftar dengan metode lain (misal: kata sandi). Silakan masuk menggunakan form email dan kata sandi.'
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
  _role: UserRole = 'student',
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
    // Role 'teacher'/'teacher_demo' hanya diizinkan jika email/UID cocok dengan konfigurasi whitelist guru tepercaya
    const cleanEmail = email.trim().toLowerCase()
    const isTeacher = isTeacherAccount(cleanEmail, fbUser.uid)
    const effectiveRole: UserRole = isTeacher ? resolveTeacherRole(cleanEmail, fbUser.uid) : 'student'

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
          role: effectiveRole,
          kelas: newProfile.kelas,
          createdAt: serverTimestamp(),
        })
      } catch (firestoreErr) {
        console.error('Gagal menyimpan profil ke Firestore users:', firestoreErr)
        throw firestoreErr
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
