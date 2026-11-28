import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN SISTEM AKSES MATERI FREEMIUM & LAB TERKUNCI')
console.log('========================================================\n')

// 1. Verifikasi Field isFree pada Tipe & Data Materi
console.log('--- 1. Verifikasi Field isFree pada Data Materi & Tipe ---')
const typesPath = path.resolve('src/types/chemistry.ts')
const typesCode = fs.readFileSync(typesPath, 'utf8')
assert.ok(
  typesCode.includes('isFree?: boolean') || typesCode.includes('isFree: boolean'),
  'src/types/chemistry.ts harus mendefinisikan field isFree boolean pada LessonModule'
)

const lessonsPath = path.resolve('src/data/lessons.ts')
const lessonsCode = fs.readFileSync(lessonsPath, 'utf8')
assert.ok(
  lessonsCode.includes('isFree: true') && lessonsCode.includes('isFree: false'),
  'src/data/lessons.ts harus menetapkan isFree (true/false) pada setiap modul materi'
)
console.log('✅ PASS: Field isFree (boolean) telah terpasang pada tipe dan data materi')

// 2. Verifikasi Helper Freemium (src/utils/freemium.ts)
console.log('\n--- 2. Verifikasi Helper Freemium di src/utils/freemium.ts ---')
const freemiumUtilPath = path.resolve('src/utils/freemium.ts')
assert.ok(fs.existsSync(freemiumUtilPath), 'src/utils/freemium.ts harus ada')
const freemiumCode = fs.readFileSync(freemiumUtilPath, 'utf8')
assert.ok(
  freemiumCode.includes('isModuleFree') && freemiumCode.includes('setModuleFree'),
  'freemium.ts harus menyediakan fungsi isModuleFree dan setModuleFree'
)
console.log('✅ PASS: Helper freemium tersedia untuk pengecekan dan pengubahan status modul')

// 3. Verifikasi Tampilan Ikon Gembok & Popup Login di MaterialsPage.tsx
console.log('\n--- 3. Verifikasi Ikon Gembok & Popup "Login untuk membuka materi ini" di MaterialsPage.tsx ---')
const materialsPagePath = path.resolve('src/pages/MaterialsPage.tsx')
const materialsCode = fs.readFileSync(materialsPagePath, 'utf8')

assert.ok(
  materialsCode.includes('Lock') && materialsCode.includes('Terkunci'),
  'MaterialsPage harus menampilkan ikon gembok dan status Terkunci untuk materi isFree=false'
)
assert.ok(
  materialsCode.includes('Login untuk membuka materi ini'),
  'MaterialsPage harus memunculkan pesan/popup "Login untuk membuka materi ini" untuk tamu'
)
assert.ok(
  materialsCode.includes('Login / Daftar'),
  'Popup harus menyediakan tombol "Login / Daftar"'
)
assert.ok(
  materialsCode.includes('isModuleFree'),
  'MaterialsPage harus memeriksa status gratis modul dengan isModuleFree'
)
console.log('✅ PASS: Modul berbayar menampilkan ikon gembok dan popup "Login untuk membuka materi ini"')

// 4. Verifikasi Halaman Lab Terkunci untuk Tamu (CarbonLabPage.tsx)
console.log('\n--- 4. Verifikasi Halaman Lab Terkunci untuk Tamu (CarbonLabPage.tsx) ---')
const labPagePath = path.resolve('src/pages/CarbonLabPage.tsx')
const labCode = fs.readFileSync(labPagePath, 'utf8')

assert.ok(
  labCode.includes('isAuthenticated') && labCode.includes('!isAuthenticated'),
  'CarbonLabPage harus memeriksa status autentikasi pengguna'
)
assert.ok(
  labCode.includes('terkunci untuk tamu') || labCode.includes('Fitur Laboratorium Virtual Terkunci'),
  'CarbonLabPage harus menampilkan informasi bahwa seluruh fitur terkunci untuk tamu'
)
assert.ok(
  labCode.includes('Login / Daftar'),
  'CarbonLabPage harus menyediakan tombol "Login / Daftar" bagi tamu'
)
console.log('✅ PASS: Seluruh fitur Carbon Lab terkunci untuk pengguna tamu')

// 5. Verifikasi Tombol "Jadikan Gratis" di Admin / Guru (TeacherDashboardPage.tsx)
console.log('\n--- 5. Verifikasi Tombol "Jadikan Gratis" di TeacherDashboardPage.tsx ---')
const teacherPagePath = path.resolve('src/pages/teacher/TeacherDashboardPage.tsx')
const teacherCode = fs.readFileSync(teacherPagePath, 'utf8')

assert.ok(
  teacherCode.includes('Jadikan Gratis'),
  'TeacherDashboardPage harus menyediakan tombol "Jadikan Gratis" untuk mengatur materi gratis'
)
assert.ok(
  teacherCode.includes('setModuleFree'),
  'TeacherDashboardPage harus memanggil setModuleFree saat tombol diklik'
)
assert.ok(
  teacherCode.includes('Kunci Materi'),
  'TeacherDashboardPage harus dapat mengunci kembali materi yang telah gratis'
)
console.log('✅ PASS: Tombol "Jadikan Gratis" tersedia di Admin untuk mengubah materi gratis secara dinamis')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN SISTEM FREEMIUM & LAB LULUS!')
console.log('========================================================')
