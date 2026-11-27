import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('========================================================')
console.log('🧪 PENGUJIAN FITUR WELCOME MODAL / POPUP PERKENALAN')
console.log('========================================================\n')

// 1. Verifikasi Komponen WelcomeModal.tsx
console.log('--- 1. Verifikasi Isi & Desain Komponen WelcomeModal.tsx ---')
const modalPath = path.resolve('src/components/home/WelcomeModal.tsx')
assert.ok(fs.existsSync(modalPath), 'File src/components/home/WelcomeModal.tsx harus ada')
const modalCode = fs.readFileSync(modalPath, 'utf8')

assert.ok(
  modalCode.includes('Selamat Datang di Carbonova'),
  'WelcomeModal harus memiliki judul "Selamat Datang di Carbonova"'
)

assert.ok(
  modalCode.includes('Platform Pembelajaran Kimia Karbon') || modalCode.includes('kimia senyawa karbon'),
  'WelcomeModal harus memuat penjelasan singkat mengenai pembelajaran kimia karbon'
)

// 3 Fitur Utama
assert.ok(
  modalCode.includes('tag: \'Materi\'') || modalCode.includes('>Materi<') || modalCode.includes('Materi'),
  'WelcomeModal harus menyertakan fitur utama: Materi'
)
assert.ok(
  modalCode.includes('tag: \'Kuis\'') || modalCode.includes('>Kuis<') || modalCode.includes('Kuis'),
  'WelcomeModal harus menyertakan fitur utama: Kuis'
)
assert.ok(
  modalCode.includes('tag: \'Progres Belajar\'') || modalCode.includes('Progres Belajar'),
  'WelcomeModal harus menyertakan fitur utama: Progres Belajar'
)

// Tombol Mulai Jelajahi dan Login / Daftar
assert.ok(
  modalCode.includes('Mulai Jelajahi'),
  'WelcomeModal harus menyediakan tombol "Mulai Jelajahi"'
)
assert.ok(
  modalCode.includes('Login / Daftar'),
  'WelcomeModal harus menyediakan tombol "Login / Daftar"'
)

// Tombol X untuk menutup
assert.ok(
  modalCode.includes('<X') && (modalCode.includes('Tutup popup') || modalCode.includes('Tutup')),
  'WelcomeModal harus memiliki tombol X untuk menutup'
)

// Aksesibilitas
assert.ok(
  modalCode.includes('createPortal') && modalCode.includes('document.body'),
  'WelcomeModal harus dirender ke document.body via createPortal'
)
assert.ok(
  modalCode.includes('Escape'),
  'WelcomeModal harus mendukung penutupan dengan tombol Escape'
)
console.log('✅ PASS: WelcomeModal memiliki judul, penjelasan, 3 fitur utama, tombol aksi, dan aksesibilitas lengkap')

// 2. Verifikasi Integrasi di Navbar.tsx
console.log('\n--- 2. Verifikasi Integrasi di Navbar.tsx & localStorage ---')
const navbarPath = path.resolve('src/components/navigation/Navbar.tsx')
const navbarCode = fs.readFileSync(navbarPath, 'utf8')

assert.ok(
  navbarCode.includes('WelcomeModal'),
  'Navbar harus mengimpor dan merender WelcomeModal'
)
assert.ok(
  navbarCode.includes('carbonova_welcome_seen'),
  'Navbar harus menggunakan key "carbonova_welcome_seen" pada localStorage'
)
assert.ok(
  navbarCode.includes("location.pathname === '/' || location.pathname === '/beranda'"),
  'Navbar harus mendeteksi halaman Beranda untuk menampilkan WelcomeModal otomatis saat pertama kali buka'
)
assert.ok(
  navbarCode.includes("link.path === '/tentang'") || navbarCode.includes("path === '/tentang'"),
  'Navbar harus menghubungkan klik tombol "Tentang" untuk membuka kembali WelcomeModal'
)
console.log('✅ PASS: Integrasi Navbar berhasil dengan key "carbonova_welcome_seen" dan pemicu tombol Tentang')

console.log('\n========================================================')
console.log('🎉 SELURUH PENGUJIAN WELCOME MODAL LULUS!')
console.log('========================================================')
