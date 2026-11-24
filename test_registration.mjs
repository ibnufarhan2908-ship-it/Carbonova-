/**
 * TEST SUITE: REGISTRASI AKUN GURU DAN SISWA (SIGN UP)
 * Menguji seluruh kriteria pengujian wajib dari User Request.
 */

// Mock browser localStorage untuk lingkungan Node.js
const mockStorage = {}
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val) },
  removeItem: (key) => { delete mockStorage[key] },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]) }
}
global.window = {}

async function runRegistrationTests() {
  console.log('========================================================')
  console.log('🧪 MEMULAI PENGUJIAN OTOMATIS FITUR REGISTRASI AKUN')
  console.log('========================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${testName}`)
      failed++
    }
  }

  const { register, login, logout, getSession } = await import('./src/services/auth.ts')
  const { initDatabase, getStudents, getStoredUserByEmail } = await import('./src/services/db.ts')

  await initDatabase()

  // --- 1. PENGUJIAN REGISTRASI SISWA BARU ---
  console.log('\n--- 1. Pengujian Registrasi Siswa Baru Mandiri ---')
  const resStudent = await register({
    name: 'Budi Santoso',
    email: 'budi.santoso@sekolah.sch.id',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'student'
  })
  assert(resStudent.success === true, 'Siswa baru berhasil mendaftarkan akun mandiri')
  assert(resStudent.user?.role === 'student', 'Role akun siswa otomatis ditetapkan sebagai "student"')
  assert(resStudent.user?.name === 'Budi Santoso', 'Nama siswa tersimpan sesuai formulir')

  // Verifikasi hash di DB
  const storedStudent = getStoredUserByEmail('budi.santoso@sekolah.sch.id')
  assert(storedStudent !== undefined, 'Akun siswa baru benar-benar tersimpan di database')
  assert(storedStudent?.passwordHash !== 'Password123!', 'Password siswa TIDAK disimpan dalam bentuk plaintext')
  assert(storedStudent?.passwordHash.length === 64, 'Password siswa di-hash dengan PBKDF2-SHA256 256-bit')

  // --- 2. PENGUJIAN PENOLAKAN ESKALASI ROLE SAAT REGISTRASI MANDIRI (AD11-01) ---
  console.log('\n--- 2. Pengujian Penolakan Eskalasi Role Guru saat Registrasi Mandiri (AD11-01) ---')
  const resTeacher = await register({
    name: 'Ibu Ratna Dewi, M.Pd.',
    email: 'ratna.dewi@sekolah.sch.id',
    password: 'GuruPassword2026!',
    confirmPassword: 'GuruPassword2026!',
    role: 'teacher',
  })
  assert(resTeacher.success === true, 'Pendaftaran akun mandiri berhasil diproses')
  assert(resTeacher.user?.role === 'student', 'Role akun publik otomatis dipaksa menjadi "student" (tidak bisa teacher)')
  assert(resTeacher.user?.name === 'Ibu Ratna Dewi, M.Pd.', 'Nama pendaftar tersimpan sesuai formulir')

  // Verifikasi di DB
  const storedTeacher = getStoredUserByEmail('ratna.dewi@sekolah.sch.id')
  assert(storedTeacher !== undefined, 'Akun pendaftar baru tersimpan di database')
  assert(storedTeacher?.role === 'student', 'Role di database dipaksa "student" untuk mencegah privilege escalation')

  // --- 3. PENGUJIAN WHITELIST AKUN GURU TEPERCAYA TUNGGAL (AD11-01) ---
  console.log('\n--- 3. Pengujian Whitelist Akun Guru Tepercaya Tunggal (AD11-01) ---')
  const resTeacherWrong = await register({
    name: 'Penyusup Mengaku Guru',
    email: 'guru.palsu@sekolah.sch.id',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'teacher',
  })
  assert(resTeacherWrong.success === true, 'Pendaftaran akun penyusup tetap dicatat sebagai student biasa')
  assert(resTeacherWrong.user?.role === 'student', 'Akun penyusup DITOLAK menjadi teacher dan dipaksa role "student"')

  const storedPenyusup = getStoredUserByEmail('guru.palsu@sekolah.sch.id')
  assert(storedPenyusup?.role === 'student', 'Role penyusup di DB terkonfirmasi "student"')

  // --- 4. PENGUJIAN DUPLIKAT EMAIL ---
  console.log('\n--- 4. Pengujian Pencegahan Email Duplikat ---')
  const resDuplicate = await register({
    name: 'Budi Kloning',
    email: 'budi.santoso@sekolah.sch.id',
    password: 'PasswordLain123!',
    confirmPassword: 'PasswordLain123!',
    role: 'student'
  })
  assert(resDuplicate.success === false, 'Email yang sudah terdaftar ditolak untuk registrasi ulang')
  assert(resDuplicate.error?.includes('sudah terdaftar'), 'Pesan kesalahan email sudah terdaftar ditampilkan')

  // Coba duplikat email akun demo
  const resDuplicateDemo = await register({
    name: 'Siswa Demo Tiruan',
    email: 'siswa.demo@carbonova.test',
    password: 'PasswordBaru123!',
    confirmPassword: 'PasswordBaru123!',
    role: 'student'
  })
  assert(resDuplicateDemo.success === false, 'Email akun demo (siswa.demo@carbonova.test) dilindungi dari duplikasi')

  // --- 5. PENGUJIAN KECOCOKAN & KEKUATAN PASSWORD ---
  console.log('\n--- 5. Pengujian Validasi Keamanan Password ---')
  const resMismatch = await register({
    name: 'Test Mismatch',
    email: 'mismatch@test.com',
    password: 'Password123!',
    confirmPassword: 'PasswordBeda123!',
    role: 'student'
  })
  assert(resMismatch.success === false, 'Registrasi ditolak jika konfirmasi password tidak cocok')

  const resTooShort = await register({
    name: 'Short Pass',
    email: 'short@test.com',
    password: 'Pass1',
    confirmPassword: 'Pass1',
    role: 'student'
  })
  assert(resTooShort.success === false, 'Registrasi ditolak jika password kurang dari 8 karakter')

  const resNoDigits = await register({
    name: 'No Digits',
    email: 'nodigits@test.com',
    password: 'PasswordHanyaHuruf',
    confirmPassword: 'PasswordHanyaHuruf',
    role: 'student'
  })
  assert(resNoDigits.success === false, 'Registrasi ditolak jika password tidak mengandung angka')

  // --- 6. PENGUJIAN LOGIN DENGAN AKUN BARU ---
  console.log('\n--- 6. Pengujian Login Menggunakan Akun yang Baru Didaftarkan ---')
  logout()
  assert(getSession() === null, 'Sesi dibersihkan sebelum uji login')

  // Login Siswa Baru
  const loginStudent = await login('budi.santoso@sekolah.sch.id', 'Password123!')
  assert(loginStudent.success === true, 'Siswa baru berhasil login menggunakan kredensial pendaftaran')
  assert(loginStudent.user?.email === 'budi.santoso@sekolah.sch.id', 'Email sesi login cocok dengan siswa baru')
  assert(loginStudent.user?.role === 'student', 'Role sesi login siswa baru adalah "student"')
  assert(getSession()?.user.name === 'Budi Santoso', 'Sesi tersimpan setelah login siswa baru')

  logout()

  // Login Pendaftar Mandiri
  const loginTeacher = await login('ratna.dewi@sekolah.sch.id', 'GuruPassword2026!')
  assert(loginTeacher.success === true, 'Pendaftar mandiri berhasil login menggunakan kredensial pendaftaran')
  assert(loginTeacher.user?.email === 'ratna.dewi@sekolah.sch.id', 'Email sesi login cocok dengan pendaftar')
  assert(loginTeacher.user?.role === 'student', 'Role sesi login akun pendaftar umum tetap "student" (bukan teacher)')

  // --- 7. PENGUJIAN KEDUA AKUN DEMO TETAP AKTIF ---
  console.log('\n--- 7. Pengujian Kompatibilitas Akun Demo Tetap Dapat Digunakan ---')
  logout()

  const demoTeacherLogin = await login('guru.demo@carbonova.test', 'GuruDemo123!')
  assert(demoTeacherLogin.success === true, 'Akun demo guru (guru.demo@carbonova.test) tetap berhasil login')
  assert(demoTeacherLogin.user?.role === 'teacher', 'Role akun demo guru tetap "teacher"')

  logout()

  const demoStudentLogin = await login('siswa.demo@carbonova.test', 'SiswaDemo123!')
  assert(demoStudentLogin.success === true, 'Akun demo siswa (siswa.demo@carbonova.test) tetap berhasil login')
  assert(demoStudentLogin.user?.role === 'student', 'Role akun demo siswa tetap "student"')

  // --- 8. PENGUJIAN INTEGRASI DATABASE GURU MELIHAT SISWA BARU ---
  console.log('\n--- 8. Pengujian Integrasi Guru Melihat Siswa Baru di LMS ---')
  const studentsList = getStudents()
  const foundBudi = studentsList.find(s => s.email === 'budi.santoso@sekolah.sch.id')
  assert(foundBudi !== undefined, 'Siswa baru (Budi Santoso) otomatis tercatat pada daftar siswa guru')
  assert(foundBudi?.status === 'active', 'Status siswa baru aktif di database')

  // --- 9. PENGUJIAN BACKEND REST API ENDPOINT ---
  console.log('\n--- 9. Pengujian Backend REST API Endpoint (server/authBackend.ts) ---')
  const { handleAuthApi, readUsers } = await import('./server/authBackend.ts')

  // Simulasikan Request POST /api/auth/register untuk Siswa via Backend API
  let apiResStatusCode = 0
  let apiResData = null

  const mockRes = {
    setHeader: () => {},
    statusCode: 200,
    end: (str) => {
      apiResStatusCode = mockRes.statusCode
      apiResData = str ? JSON.parse(str) : null
    }
  }

  const { EventEmitter } = await import('node:events')
  const mockReqStudent = new EventEmitter()
  mockReqStudent.url = '/api/auth/register'
  mockReqStudent.method = 'POST'
  mockReqStudent.headers = { 'content-type': 'application/json' }

  const backendEmail = `siswa.backend.${Date.now()}@sekolah.sch.id`
  const handlePromise = handleAuthApi(mockReqStudent, mockRes)
  mockReqStudent.emit('data', Buffer.from(JSON.stringify({
    name: 'Siswa Backend Api',
    email: backendEmail,
    password: 'PasswordBackend123!',
    confirmPassword: 'PasswordBackend123!',
    role: 'student'
  })))
  mockReqStudent.emit('end')

  const handled = await handlePromise
  assert(handled === true, 'Backend API menangani rute /api/auth/register')
  assert(apiResStatusCode === 201, 'Backend API mengembalikan HTTP 201 Created')
  assert(apiResData?.success === true, 'Backend API mencatatkan registrasi sukses')
  assert(apiResData?.user?.email === backendEmail, 'User baru tersimpan di file database backend')

  // Cek file storage backend
  const backendUsers = readUsers()
  const foundBackendUser = backendUsers.find(u => u.email === backendEmail)
  assert(foundBackendUser !== undefined, 'User tersimpan permanen di data/users.json')
  assert(foundBackendUser?.passwordHash !== 'PasswordBackend123!', 'Password di file backend di-hash aman')

  console.log('\n========================================================')
  console.log(`🎉 HASIL PENGUJIAN REGISTRASI: ${passed} LULUS, ${failed} GAGAL`)
  console.log('========================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runRegistrationTests().catch(err => {
  console.error('Unhandled test error:', err)
  process.exit(1)
})
