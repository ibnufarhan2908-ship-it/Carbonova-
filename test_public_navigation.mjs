import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN ALUR NAVIGASI & HAK AKSES PENGGUNA UMUM (TAMU)')
console.log('========================================================\n')

// 1. Verifikasi Routing pada src/App.tsx
console.log('--- 1. Verifikasi Akses Publik Beranda, Materi, & Kuis di src/App.tsx ---')
const appPath = path.resolve('src/App.tsx')
const appCode = fs.readFileSync(appPath, 'utf8')

assert.ok(
  appCode.includes('<Route index element={<HomePage />} />'),
  'URL root (/) harus langsung menampilkan halaman Beranda (HomePage) tanpa dipaksa ke login'
)
assert.ok(
  appCode.includes('<Route path="beranda" element={<HomePage />} />'),
  'Rute /beranda harus langsung menampilkan HomePage'
)
assert.ok(
  appCode.includes('<Route path="materi" element={<MaterialsPage />} />'),
  'Rute /materi harus dapat diakses bebas tanpa ProtectedRoute'
)
assert.ok(
  appCode.includes('path="latihan"') && appCode.includes('element={<QuizPage />}'),
  'Rute /latihan harus dapat diakses langsung oleh tamu tanpa ProtectedRoute'
)
assert.ok(
  appCode.includes('path="riwayat"') && appCode.includes('element={<QuizPage />}'),
  'Rute /riwayat harus dapat diakses langsung oleh tamu tanpa ProtectedRoute'
)
console.log('✅ PASS: Halaman Beranda, Materi, dan Kuis dapat diakses publik tanpa login')

// 2. Verifikasi Tombol Login/Daftar di Navbar.tsx
console.log('\n--- 2. Verifikasi Tombol Login/Daftar di Navbar.tsx ---')
const navbarPath = path.resolve('src/components/navigation/Navbar.tsx')
const navbarCode = fs.readFileSync(navbarPath, 'utf8')

assert.ok(
  navbarCode.includes('Login / Daftar') || navbarCode.includes('Login/Daftar'),
  'Navbar harus menyediakan tombol "Login / Daftar" atau "Login/Daftar" bagi pengguna umum'
)
assert.ok(
  navbarCode.includes("to={isAuthenticated ? dashboardPath : '/'}"),
  'Logo brand di navbar harus mengarahkan pengguna umum ke Beranda (/), bukan langsung ke Login'
)
assert.ok(
  !navbarCode.includes("setIsLoginModalOpen(true)"),
  'Navbar tidak boleh mencegat navigasi kuis/riwayat dengan modal login paksa'
)
console.log('✅ PASS: Navbar menyediakan tombol Login/Daftar dan bebas intersepsi login untuk tamu')

// 3. Verifikasi Tombol Mulai Kuis di Beranda (HomePage.tsx)
console.log('\n--- 3. Verifikasi Tombol Bank Soal di HomePage.tsx ---')
const homePagePath = path.resolve('src/pages/HomePage.tsx')
const homePageCode = fs.readFileSync(homePagePath, 'utf8')

assert.ok(
  homePageCode.includes('to="/latihan"') && homePageCode.includes('Bank Soal Lengkap'),
  'Tombol Bank Soal Lengkap di Beranda harus langsung mengarahkan ke /latihan tanpa login modal'
)
console.log('✅ PASS: Tombol Bank Soal Lengkap di Beranda langsung membuka halaman latihan soal')

// 4. Verifikasi Pengerjaan Kuis & Penyimpanan Progres Tamu ke localStorage (QuizPage.tsx)
console.log('\n--- 4. Verifikasi Pengerjaan Kuis Tamu & LocalStorage di QuizPage.tsx ---')
const quizPagePath = path.resolve('src/pages/QuizPage.tsx')
const quizPageCode = fs.readFileSync(quizPagePath, 'utf8')

assert.ok(
  quizPageCode.includes("userUid || 'guest'"),
  'QuizPage harus menggunakan identifier guest untuk tamu agar progres kuis disimpan di localStorage'
)
assert.ok(
  !quizPageCode.includes("navigate('/login',"),
  'QuizPage tidak boleh memaksa redirect ke /login saat tamu mengirimkan jawaban kuis'
)
console.log('✅ PASS: Tamu dapat mengerjakan kuis dan progres/riwayat tersimpan di localStorage')

// 5. Verifikasi Penyimpanan Progres Materi Tamu ke localStorage (MaterialsPage.tsx & db.ts)
console.log('\n--- 5. Verifikasi Progres Materi Tamu di MaterialsPage.tsx & db.ts ---')
const materialsPath = path.resolve('src/pages/MaterialsPage.tsx')
const materialsCode = fs.readFileSync(materialsPath, 'utf8')

assert.ok(
  materialsCode.includes("user ? user.id : 'guest'") || materialsCode.includes("user?.id || 'guest'"),
  'MaterialsPage harus menandai progres belajar untuk tamu menggunakan identifier guest'
)

const dbPath = path.resolve('src/services/db.ts')
const dbCode = fs.readFileSync(dbPath, 'utf8')
assert.ok(
  dbCode.includes("userId !== 'guest'"),
  'db.ts harus mengisolasi sinkronisasi Cloud Firestore hanya untuk pengguna terdaftar dan menyimpan progres tamu di localStorage'
)
console.log('✅ PASS: Progres materi untuk tamu tersimpan dengan aman di localStorage')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN NAVIGASI & HAK AKSES PENGGUNA UMUM LULUS!')
console.log('========================================================')
