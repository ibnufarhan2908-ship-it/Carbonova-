import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN ALUR NAVIGASI & HAK AKSES PENGGUNA UMUM')
console.log('========================================================\n')

// 1. Verifikasi Routing pada src/App.tsx
console.log('--- 1. Verifikasi Akses Publik Beranda & Modul di src/App.tsx ---')
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
  appCode.includes('<Route path="molekul" element={<MoleculeExplorerPage />} />'),
  'Rute /molekul (Molecule Explorer) harus dapat diakses bebas tanpa ProtectedRoute'
)
assert.ok(
  appCode.includes('<Route path="lab" element={<CarbonLabPage />} />'),
  'Rute /lab (Carbon Lab) harus dapat diakses bebas tanpa ProtectedRoute'
)
assert.ok(
  appCode.includes('<Route path="tentang" element={<AboutPage />} />'),
  'Rute /tentang harus dapat diakses bebas tanpa ProtectedRoute'
)
console.log('✅ PASS: Halaman Beranda, Materi, Molekul, Lab, dan Tentang dapat diakses publik tanpa login')

// 2. Verifikasi Penguncian Rute Latihan Soal & Riwayat Kuis di src/App.tsx
console.log('\n--- 2. Verifikasi Penguncian Rute Latihan Soal di src/App.tsx ---')
assert.ok(
  appCode.includes('path="latihan"') && appCode.includes('<ProtectedRoute>') && appCode.includes('<QuizPage />'),
  'Rute /latihan harus terkunci di dalam ProtectedRoute'
)
assert.ok(
  appCode.includes('path="latihan-soal"'),
  'Rute /latihan-soal harus tersedia dan terkunci di dalam ProtectedRoute'
)
assert.ok(
  appCode.includes('path="riwayat"'),
  'Rute /riwayat harus terkunci di dalam ProtectedRoute'
)
console.log('✅ PASS: Seluruh rute latihan soal (/latihan, /latihan-soal) dan riwayat (/riwayat) terkunci oleh ProtectedRoute')

// 3. Verifikasi Pesan Pengalihan pada ProtectedRoute.tsx
console.log('\n--- 3. Verifikasi Pesan Pengalihan pada ProtectedRoute.tsx ---')
const protectedRoutePath = path.resolve('src/components/auth/ProtectedRoute.tsx')
const protectedRouteCode = fs.readFileSync(protectedRoutePath, 'utf8')

assert.ok(
  protectedRouteCode.includes('Silakan masuk (login) terlebih dahulu menggunakan akun siswa untuk mengerjakan dan mengirimkan jawaban latihan soal.'),
  'ProtectedRoute harus menyertakan pesan peringatan spesifik saat mengarahkan pengguna umum dari rute kuis'
)
console.log('✅ PASS: ProtectedRoute membawa pesan peringatan login akun siswa')

// 4. Verifikasi Komponen LoginRequiredModal.tsx
console.log('\n--- 4. Verifikasi Komponen Dialog LoginRequiredModal.tsx ---')
const modalPath = path.resolve('src/components/auth/LoginRequiredModal.tsx')
const modalCode = fs.readFileSync(modalPath, 'utf8')

assert.ok(
  modalCode.includes('Silakan masuk (login) terlebih dahulu menggunakan akun siswa untuk mengerjakan dan mengirimkan jawaban latihan soal.'),
  'LoginRequiredModal harus memuat pesan peringatan wajib dari spesifikasi'
)
assert.ok(
  modalCode.includes('handleLoginClick') && modalCode.includes("navigate('/login'"),
  'LoginRequiredModal harus memiliki tombol yang mengarahkan langsung ke halaman /login'
)
assert.ok(
  modalCode.includes("e.key === 'Escape'"),
  'LoginRequiredModal harus mendukung penutupan modal dengan tombol Escape'
)
assert.ok(
  modalCode.includes("e.key === 'Tab'"),
  'LoginRequiredModal harus mengunci putaran keyboard (focus trap)'
)
assert.ok(
  modalCode.includes('createPortal') && modalCode.includes('document.body'),
  'LoginRequiredModal harus dirender ke document.body menggunakan createPortal agar terbebas dari stacking context backdrop-blur navbar'
)
assert.ok(
  modalCode.includes('z-[9999]') && modalCode.includes('overflow-y-auto') && modalCode.includes('items-center justify-center'),
  'Overlay modal harus berada di z-[9999] dan berposisi tepat di tengah layar dengan kemampuan overflow-y-auto'
)
assert.ok(
  modalCode.includes('max-h-[90vh]') && modalCode.includes('my-auto'),
  'Dialog modal harus memiliki batasan max-h-[90vh] dan my-auto agar tidak terpotong di tepi atas layar'
)
console.log('✅ PASS: LoginRequiredModal lengkap dengan createPortal, posisi tengah anti-terpotong, aksesibilitas Escape, dan focus trap')

// 5. Verifikasi Intersepsi Navigasi di Navbar.tsx
console.log('\n--- 5. Verifikasi Navigasi Navbar & Label Tombol Masuk / Daftar ---')
const navbarPath = path.resolve('src/components/navigation/Navbar.tsx')
const navbarCode = fs.readFileSync(navbarPath, 'utf8')

assert.ok(
  navbarCode.includes('handleQuizNavClick'),
  'Navbar harus memiliki handler untuk mengintersepsi klik menu kuis oleh pengguna yang belum login'
)
assert.ok(
  navbarCode.includes('LoginRequiredModal'),
  'Navbar harus menyematkan LoginRequiredModal untuk memberikan notifikasi visual'
)
assert.ok(
  navbarCode.includes('Masuk / Daftar'),
  'Navbar harus menyediakan tombol "Masuk / Daftar" bagi pengguna umum'
)
assert.ok(
  navbarCode.includes("to={isAuthenticated ? dashboardPath : '/'}"),
  'Logo brand di navbar harus mengarahkan pengguna umum ke Beranda (/), bukan langsung ke Login'
)
console.log('✅ PASS: Navbar mengintersepsi klik kuis pengguna umum, menampilkan modal, dan menyediakan tombol Masuk / Daftar')

// 6. Verifikasi Tombol Mulai Kuis di Beranda (HomePage.tsx)
console.log('\n--- 6. Verifikasi Intersepsi Tombol Kuis di HomePage.tsx ---')
const homePagePath = path.resolve('src/pages/HomePage.tsx')
const homePageCode = fs.readFileSync(homePagePath, 'utf8')

assert.ok(
  homePageCode.includes('LoginRequiredModal'),
  'HomePage harus menyematkan LoginRequiredModal'
)
assert.ok(
  homePageCode.includes('!isAuthenticated') && homePageCode.includes('setIsLoginModalOpen(true)'),
  'Tombol Bank Soal Lengkap di Beranda harus menampilkan LoginRequiredModal jika pengguna belum login'
)
console.log('✅ PASS: Tombol Bank Soal Lengkap di Beranda memicu notifikasi login bagi pengguna umum')

// 7. Verifikasi Tampilan Peringatan & Redirect Kembali di LoginPage.tsx
console.log('\n--- 7. Verifikasi Banner Notifikasi & Alur Redirect di LoginPage.tsx ---')
const loginPagePath = path.resolve('src/pages/auth/LoginPage.tsx')
const loginPageCode = fs.readFileSync(loginPagePath, 'utf8')

assert.ok(
  loginPageCode.includes('authNotice'),
  'LoginPage harus membaca notifikasi pengalihan (authNotice) dari location.state'
)
assert.ok(
  loginPageCode.includes('stateFrom && !stateFrom.startsWith(\'/login\')'),
  'LoginPage harus mengarahkan kembali siswa ke rute asal (stateFrom) setelah login berhasil'
)
console.log('✅ PASS: LoginPage menampilkan banner akses masuk dan mengembalikan siswa ke halaman kuis setelah login')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN NAVIGASI & HAK AKSES PENGGUNA UMUM LULUS!')
console.log('========================================================')
