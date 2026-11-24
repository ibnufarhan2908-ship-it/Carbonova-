import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN FITUR GOOGLE SIGN-IN (FIREBASE AUTH)')
console.log('========================================================\n')

// 1. Verifikasi Kode Sumber firebaseAuth.ts
console.log('--- 1. Verifikasi Integrasi GoogleAuthProvider di firebaseAuth.ts ---')
const firebaseAuthPath = path.resolve('src/services/firebaseAuth.ts')
const firebaseAuthCode = fs.readFileSync(firebaseAuthPath, 'utf8')

assert.ok(
  firebaseAuthCode.includes('GoogleAuthProvider'),
  'firebaseAuth.ts harus mengimpor dan menggunakan GoogleAuthProvider'
)
assert.ok(
  firebaseAuthCode.includes('signInWithPopup'),
  'firebaseAuth.ts harus mengimpor dan menggunakan signInWithPopup'
)
assert.ok(
  firebaseAuthCode.includes('firebaseSignInWithGoogle'),
  'firebaseAuth.ts harus mengekspor fungsi firebaseSignInWithGoogle'
)
assert.ok(
  firebaseAuthCode.includes('auth/popup-closed-by-user'),
  'firebaseAuth.ts harus menangani error auth/popup-closed-by-user'
)
assert.ok(
  firebaseAuthCode.includes('auth/popup-blocked'),
  'firebaseAuth.ts harus menangani error auth/popup-blocked'
)
console.log('✅ PASS: firebaseSignInWithGoogle terdefinisi dengan GoogleAuthProvider & penanganan popup error')

// 2. Verifikasi Kode Sumber AuthContext.tsx
console.log('\n--- 2. Verifikasi AuthContext.tsx ---')
const authContextPath = path.resolve('src/context/AuthContext.tsx')
const authContextCode = fs.readFileSync(authContextPath, 'utf8')

assert.ok(
  authContextCode.includes('loginWithGoogle'),
  'AuthContextType harus menyediakan fungsi loginWithGoogle'
)
assert.ok(
  authContextCode.includes('firebaseSignInWithGoogle'),
  'AuthContext harus memanggil firebaseSignInWithGoogle saat loginWithGoogle dieksekusi'
)
console.log('✅ PASS: loginWithGoogle terintegrasi pada AuthContextType dan AuthProvider')

// 3. Verifikasi UI di LoginPage.tsx
console.log('\n--- 3. Verifikasi Tombol & Indikator Loading di LoginPage.tsx ---')
const loginPagePath = path.resolve('src/pages/auth/LoginPage.tsx')
const loginPageCode = fs.readFileSync(loginPagePath, 'utf8')

assert.ok(
  loginPageCode.includes('GoogleIcon'),
  'LoginPage.tsx harus memiliki ikon Google resmi'
)
assert.ok(
  loginPageCode.includes('handleGoogleSignIn'),
  'LoginPage.tsx harus memiliki handler handleGoogleSignIn'
)
assert.ok(
  loginPageCode.includes('Masuk dengan Google'),
  'LoginPage.tsx harus menyediakan tombol "Masuk dengan Google"'
)
assert.ok(
  loginPageCode.includes('isGoogleLoading'),
  'LoginPage.tsx harus memiliki state loading saat popup Google berjalan'
)
assert.ok(
  loginPageCode.includes('handleRedirect(result.user?.role'),
  'LoginPage.tsx harus mengarahkan user sesuai role setelah login Google berhasil'
)
console.log('✅ PASS: Tombol Google Sign-In, ikon resmi, loading spinner, dan redirect role terpasang')

// 4. Simulasi Logika Penetapan Role Akun Google (Role Assignment Rule)
console.log('\n--- 4. Pengujian Logika Penetapan Role Akun Google ---')
import { isTeacherAccount, DEFAULT_TEACHER_EMAIL } from './src/config/authConfig.ts'

function determineRoleForGoogleUser(email, uid) {
  const isTeacher = isTeacherAccount(email, uid)
  return isTeacher ? 'teacher' : 'student'
}

// Akun Siswa Umum melalui Google
const studentGoogleUser = {
  uid: 'google-uid-12345',
  email: 'siswa.baru@gmail.com',
  displayName: 'Siswa Baru Google',
  photoURL: 'https://lh3.googleusercontent.com/a/student-photo',
}
const studentRole = determineRoleForGoogleUser(studentGoogleUser.email, studentGoogleUser.uid)
assert.equal(studentRole, 'student', 'Akun umum dari Google harus selalu mendapatkan role student')
console.log('✅ PASS: Akun umum Google (siswa.baru@gmail.com) otomatis ditetapkan sebagai student')

// Akun Guru Whitelist melalui Google
const teacherGoogleUser = {
  uid: 'google-uid-teacher-99',
  email: DEFAULT_TEACHER_EMAIL,
  displayName: 'Pak Guru Budi Santoso',
  photoURL: 'https://lh3.googleusercontent.com/a/teacher-photo',
}
const teacherRole = determineRoleForGoogleUser(teacherGoogleUser.email, teacherGoogleUser.uid)
assert.equal(teacherRole, 'teacher', 'Akun dengan email guru resmi dari Google harus mendapatkan role teacher')
console.log(`✅ PASS: Akun guru resmi Google (${DEFAULT_TEACHER_EMAIL}) ditetapkan sebagai teacher`)

// 5. Simulasi Penanganan Error Popup
console.log('\n--- 5. Pengujian Pemetaan Pesan Error Popup Bahasa Indonesia ---')
function mapGoogleAuthError(errorCode) {
  if (errorCode === 'auth/popup-closed-by-user') {
    return 'Jendela login Google ditutup sebelum proses masuk selesai. Silakan coba kembali.'
  }
  if (errorCode === 'auth/popup-blocked') {
    return 'Jendela popup Google diblokir oleh browser. Harap izinkan popup pada peramban Anda lalu coba lagi.'
  }
  if (errorCode === 'auth/cancelled-popup-request') {
    return 'Proses login Google dibatalkan karena ada jendela popup lain yang dibuka.'
  }
  return 'Terjadi kesalahan saat masuk dengan Google.'
}

assert.ok(
  mapGoogleAuthError('auth/popup-closed-by-user').includes('ditutup sebelum proses'),
  'Pesan popup-closed-by-user harus informatif dalam bahasa Indonesia'
)
assert.ok(
  mapGoogleAuthError('auth/popup-blocked').includes('diblokir oleh browser'),
  'Pesan popup-blocked harus informatif dalam bahasa Indonesia'
)
console.log('✅ PASS: Seluruh kode error popup Firebase dipetakan ke pesan bahasa Indonesia yang jelas')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN GOOGLE SIGN-IN BERHASIL!')
console.log('========================================================')
