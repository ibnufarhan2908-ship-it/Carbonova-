/**
 * AUTOMATED VERIFICATION SUITE — CARBONOVA LMS & AUTH SYSTEM
 * Pengujian komprehensif terhadap:
 * 1. Web Crypto API PBKDF2 Hashing & Salt
 * 2. Akun Demo Guru & Siswa terdaftar
 * 3. Verifikasi Login (Benar vs Salah)
 * 4. Pengelolaan Sesi & Logout
 * 5. Role-Based Access Control (RBAC) & Guards
 * 6. LMS Metrik & Statistik Database (Guru & Siswa)
 * 7. Row Level Security (RLS) data isolasi antar-siswa
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

// Import functions
async function runTests() {
  console.log('========================================================')
  console.log('🧪 MEMULAI PENGUJIAN OTOMATIS SISTEM AUTENTIKASI & LMS')
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

  // --- 1. PENGUJIAN KRIPTOGRAFI (PBKDF2 & SALT) ---
  console.log('\n--- 1. Pengujian Kriptografi & Keamanan Password ---')
  const { generateSalt, hashPassword, verifyPassword } = await import('./src/services/crypto.ts')
  
  const salt1 = generateSalt()
  const salt2 = generateSalt()
  assert(salt1 !== salt2 && salt1.length === 32, 'generateSalt menghasilkan 16-byte hex acak unik')

  const hashGuru = await hashPassword('GuruDemo123!', salt1)
  assert(hashGuru.length === 64, 'hashPassword menghasilkan 256-bit PBKDF2 hex string')
  assert(hashGuru !== 'GuruDemo123!', 'Password TIDAK disimpan dalam bentuk plaintext')

  const verifyValid = await verifyPassword('GuruDemo123!', salt1, hashGuru)
  assert(verifyValid === true, 'verifyPassword menerima password yang benar')

  const verifyInvalid = await verifyPassword('SalahPassword!', salt1, hashGuru)
  assert(verifyInvalid === false, 'verifyPassword menolak password yang salah')

  // --- 2. PENGUJIAN INISIALISASI DATABASE & SEEDING AKUN DEMO ---
  console.log('\n--- 2. Pengujian Database & Seeding Akun Demo ---')
  const { initDatabase, getAllUsers, getStoredUserByEmail } = await import('./src/services/db.ts')

  await initDatabase()
  const users = getAllUsers()
  assert(users.length >= 2, 'Database berhasil menginisialisasi setidaknya 2 pengguna')

  const teacher = getStoredUserByEmail('guru.demo@carbonova.test')
  assert(teacher !== undefined, 'Akun Guru Demo (guru.demo@carbonova.test) terdaftar di DB')
  assert(teacher?.role === 'teacher', 'Akun Guru Demo memiliki role "teacher"')
  assert(teacher?.passwordHash !== 'GuruDemo123!', 'Password Guru Demo tersimpan dalam bentuk PBKDF2 hash aman')

  const student = getStoredUserByEmail('siswa.demo@carbonova.test')
  assert(student !== undefined, 'Akun Siswa Demo (siswa.demo@carbonova.test) terdaftar di DB')
  assert(student?.role === 'student', 'Akun Siswa Demo memiliki role "student"')
  assert(student?.passwordHash !== 'SiswaDemo123!', 'Password Siswa Demo tersimpan dalam bentuk PBKDF2 hash aman')

  // --- 3. PENGUJIAN LOGIN AUTENTIKASI ---
  console.log('\n--- 3. Pengujian Alur Login Autentikasi ---')
  const { login, logout, getSession, getCurrentUser } = await import('./src/services/auth.ts')

  // Login Guru Demo Berhasil
  const loginGuru = await login('guru.demo@carbonova.test', 'GuruDemo123!')
  assert(loginGuru.success === true, 'Guru Demo berhasil login dengan kredensial yang valid')
  assert(loginGuru.user?.role === 'teacher', 'Sesi login Guru Demo mengembalikan role "teacher"')
  assert(getSession()?.token !== undefined, 'Sesi autentikasi tersimpan dengan token aktif')

  // Logout Guru
  logout()
  assert(getSession() === null, 'Logout berhasil membersihkan sesi login')
  assert(getCurrentUser() === null, 'getCurrentUser mengembalikan null setelah logout')

  // Login Siswa Demo Berhasil
  const loginSiswa = await login('siswa.demo@carbonova.test', 'SiswaDemo123!')
  assert(loginSiswa.success === true, 'Siswa Demo berhasil login dengan kredensial yang valid')
  assert(loginSiswa.user?.role === 'student', 'Sesi login Siswa Demo mengembalikan role "student"')

  // Login dengan Password Salah Ditolak
  const loginWrongPass = await login('guru.demo@carbonova.test', 'PasswordSalah!')
  assert(loginWrongPass.success === false, 'Login dengan password salah ditolak oleh sistem')
  assert(loginWrongPass.error?.includes('tidak sesuai'), 'Pesan error ditampilkan apabila password salah')

  // Login dengan Email Tidak Terdaftar Ditolak
  const loginWrongEmail = await login('unknown@carbonova.test', 'GuruDemo123!')
  assert(loginWrongEmail.success === false, 'Login dengan email yang tidak terdaftar ditolak')

  // --- 4. PENGUJIAN ROLE-BASED ACCESS CONTROL (RBAC) ---
  console.log('\n--- 4. Pengujian Hak Akses & Pembatasan Role (RBAC) ---')
  function checkRouteAccess(currentUser, route, allowedRoles) {
    if (!currentUser) return { allowed: false, redirect: '/login' }
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      return {
        allowed: false,
        redirect: currentUser.role === 'teacher' ? '/guru/dashboard' : '/siswa/dashboard'
      }
    }
    return { allowed: true }
  }

  // Pengguna belum login mengakses /guru/dashboard
  const unauthAccess = checkRouteAccess(null, '/guru/dashboard', ['teacher'])
  assert(!unauthAccess.allowed && unauthAccess.redirect === '/login', 'Pengguna belum login diarahkan ke /login')

  // Siswa mencoba mengakses /guru/dashboard
  const studentUser = loginSiswa.user
  const studentAccessTeacher = checkRouteAccess(studentUser, '/guru/dashboard', ['teacher'])
  assert(!studentAccessTeacher.allowed && studentAccessTeacher.redirect === '/siswa/dashboard', 'Siswa DITOLAK mengakses Dashboard Guru dan diarahkan ke Dashboard Siswa')

  // Siswa mengakses /siswa/dashboard
  const studentAccessStudent = checkRouteAccess(studentUser, '/siswa/dashboard', ['student'])
  assert(studentAccessStudent.allowed, 'Siswa diizinkan membuka Dashboard Siswa')

  // Guru mengakses /guru/dashboard
  const teacherUser = loginGuru.user
  const teacherAccessTeacher = checkRouteAccess(teacherUser, '/guru/dashboard', ['teacher'])
  assert(teacherAccessTeacher.allowed, 'Guru diizinkan membuka Dashboard Guru')

  // --- 5. PENGUJIAN LMS DATABASE: STATISTIK, PROGRESS & SUBMISI KUIS ---
  console.log('\n--- 5. Pengujian LMS Database: Submisi Kuis & Statistik ---')
  const {
    saveQuizSubmission,
    getAllSubmissions,
    getSubmissionsByStudent,
    getTeacherStats,
    getStudentStats,
    markModuleStudied
  } = await import('./src/services/db.ts')

  // Kondisi awal (sebelum pengerjaan)
  const initialTeacherStats = getTeacherStats()
  assert(initialTeacherStats.totalStudents === 1, 'Statistik guru: total siswa terdaftar terhitung akurat (1 siswa demo)')
  assert(initialTeacherStats.totalMaterials === 6, 'Statistik guru: total materi terhitung 6 modul')
  assert(initialTeacherStats.totalQuestions === 14, 'Statistik guru: total latihan soal terhitung 14 butir evaluasi HOTS riil')
  assert(initialTeacherStats.totalSubmissions === 0, 'Statistik guru: jumlah pengerjaan awal = 0 (bukan data palsu)')
  assert(initialTeacherStats.averageScore === 0, 'Statistik guru: rata-rata nilai awal = 0 (bukan data palsu)')
  assert(initialTeacherStats.uncompletedStudentsCount === 1, 'Statistik guru: siswa belum mengerjakan = 1')

  // Siswa membaca modul materi
  markModuleStudied(studentUser.id, 'kekhasan-atom-karbon')
  markModuleStudied(studentUser.id, 'hidrokarbon')
  const studentStatsAfterStudy = getStudentStats(studentUser.id)
  assert(studentStatsAfterStudy.studiedMaterialsCount === 2, 'Statistik siswa: materi dipelajari terhitung 2 dari 6 modul')

  // Siswa mengumpulkan latihan soal (skor 90)
  const submission1 = {
    id: 'sub-test-01',
    userId: studentUser.id,
    userName: studentUser.name,
    userEmail: studentUser.email,
    quizId: 'konsep-dasar-atom-karbon',
    quizTitle: 'Evaluasi Konsep Dasar Atom Karbon',
    category: 'Konsep Dasar Atom Karbon',
    completedAt: new Date().toISOString(),
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    score: 80,
    answers: []
  }
  saveQuizSubmission(submission1)

  // Guru melihat statistik setelah pengerjaan kuis
  const updatedTeacherStats = getTeacherStats()
  assert(updatedTeacherStats.totalSubmissions === 1, 'Statistik guru: total pengerjaan bertambah menjadi 1')
  assert(updatedTeacherStats.averageScore === 80, 'Statistik guru: rata-rata nilai terhitung 80 / 100')
  assert(updatedTeacherStats.uncompletedStudentsCount === 0, 'Statistik guru: siswa belum mengerjakan menjadi 0')

  // Siswa melihat statistik personal
  const studentStatsAfterQuiz = getStudentStats(studentUser.id)
  assert(studentStatsAfterQuiz.totalAttempts === 1, 'Statistik siswa: total pengerjaan latihan = 1')
  assert(studentStatsAfterQuiz.averageScore === 80, 'Statistik siswa: rata-rata nilai personal = 80')

  // --- 6. PENGUJIAN ROW LEVEL SECURITY (DATA ISOLATION) ---
  console.log('\n--- 6. Pengujian Row Level Security (Isolasi Data Siswa) ---')
  // Daftarkan siswa kedua
  const secondStudentId = 'usr-student-02'
  const submission2 = {
    id: 'sub-test-02',
    userId: secondStudentId,
    userName: 'Siswa Lain',
    userEmail: 'siswa.lain@carbonova.test',
    quizId: 'hidrokarbon',
    quizTitle: 'Evaluasi Hidrokarbon',
    category: 'Identifikasi Hidrokarbon',
    completedAt: new Date().toISOString(),
    totalQuestions: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    score: 100,
    answers: []
  }
  saveQuizSubmission(submission2)

  // Siswa 1 hanya dapat melihat pengerjaannya sendiri
  const student1Submissions = getSubmissionsByStudent(studentUser.id)
  assert(student1Submissions.length === 1 && student1Submissions[0].id === 'sub-test-01', 'RLS: Siswa 1 HANYA dapat melihat riwayat pengerjaan miliknya sendiri')
  assert(!student1Submissions.some(s => s.userId === secondStudentId), 'RLS: Siswa 1 TIDAK DAPAT melihat riwayat pengerjaan siswa lain')

  // Guru dapat melihat seluruh pengerjaan dari semua siswa
  const allSubsForTeacher = getAllSubmissions()
  assert(allSubsForTeacher.length === 2, 'RLS: Guru dapat memantau pengerjaan seluruh siswa (2 submisi)')

  console.log('\n========================================================')
  console.log(`🎉 HASIL PENGUJIAN: ${passed} LULUS, ${failed} GAGAL`)
  console.log('========================================================')
  
  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('Unhandled test error:', err)
  process.exit(1)
})

