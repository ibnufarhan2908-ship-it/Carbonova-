/**
 * TEST SUITE: PENANGANAN ERROR STORAGE KUIS (TEMUAN AD11-03)
 * Menguji mitigasi kegagalan penyimpanan riwayat kuis, QuotaExceededError,
 * isolasi draf saat gagal simpan, dan mekanisme retry idempotency.
 */

// Mock storage & window environment untuk Node.js
let storageData = {}
let shouldThrowQuotaError = false

global.window = {}
global.localStorage = {
  getItem: (key) => storageData[key] || null,
  setItem: (key, val) => {
    if (shouldThrowQuotaError) {
      const err = new Error('The quota has been exceeded.')
      err.name = 'QuotaExceededError'
      err.code = 22
      throw err
    }
    storageData[key] = String(val)
  },
  removeItem: (key) => { delete storageData[key] },
  clear: () => { storageData = {} }
}

async function runStorageErrorTests() {
  console.log('========================================================')
  console.log('🧪 PENGUJIAN PENANGANAN ERROR PENYIMPANAN KUIS (AD11-03)')
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

  const {
    saveQuizResult,
    getQuizHistory,
    saveQuizDraft,
    getQuizDraft,
    clearQuizDraft,
  } = await import('./src/utils/quizStorage.ts')

  const { saveQuizSubmission } = await import('./src/services/db.ts')

  const testUid = 'usr-student-test-01'
  const mockQuizResult = {
    id: 'quiz_test_attempt_101',
    quizId: 'identifikasi-hidrokarbon',
    quizTitle: 'Evaluasi Identifikasi Hidrokarbon',
    category: 'Identifikasi Hidrokarbon',
    completedAt: new Date().toISOString(),
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    score: 80,
    answers: [],
  }

  // --- 1. SIMULASI PENYIMPANAN NORMAL (BERHASIL) ---
  console.log('--- 1. Pengujian Penyimpanan Normal (Sukses) ---')
  shouldThrowQuotaError = false
  const resNormal = saveQuizResult(mockQuizResult, testUid)
  assert(resNormal.success === true, 'saveQuizResult mengembalikan status success: true saat penyimpanan normal')
  assert(resNormal.data?.id === mockQuizResult.id, 'saveQuizResult mengembalikan data hasil kuis yang tersimpan')
  assert(resNormal.error === undefined, 'Tidak ada error pada hasil penyimpanan normal')

  const historyNormal = getQuizHistory(testUid)
  assert(historyNormal.length === 1, 'Data hasil kuis benar-benar tersimpan di localStorage')
  assert(historyNormal[0].id === mockQuizResult.id, 'ID attempt tersimpan cocok di riwayat')

  // --- 2. SIMULASI KEGAGALAN PENYIMPANAN (QuotaExceededError) ---
  console.log('\n--- 2. Pengujian Penolakan Klaim Sukses Palsu (QuotaExceededError) ---')
  shouldThrowQuotaError = true

  const mockFailResult = {
    id: 'quiz_test_attempt_102',
    quizId: 'tata-nama-senyawa',
    quizTitle: 'Evaluasi Tata Nama Senyawa',
    category: 'Tata Nama Senyawa',
    completedAt: new Date().toISOString(),
    totalQuestions: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    score: 100,
    answers: [],
  }

  const resError = saveQuizResult(mockFailResult, testUid)
  assert(resError.success === false, 'Hentikan klaim sukses palsu: saveQuizResult mengembalikan success: false saat gagal')
  assert(resError.error !== undefined, 'Pesan error yang jelas dikembalikan oleh storage utility')
  assert(
    resError.error?.toLowerCase().includes('penuh') || resError.error?.includes('QuotaExceededError'),
    'Pesan error mendeteksi dan mengidentifikasi QuotaExceededError browser'
  )

  const historyAfterFail = getQuizHistory(testUid)
  const foundFailedItem = historyAfterFail.find(item => item.id === 'quiz_test_attempt_102')
  assert(foundFailedItem === undefined, 'Item yang gagal simpan dipastikan TIDAK ada di localStorage')

  // --- 3. PENGUJIAN INTEGRITAS DRAF JAWABAN SAAT SIMPAN HASIL GAGAL ---
  console.log('\n--- 3. Pengujian Integritas Draf Jawaban Saat Simpan Hasil Gagal ---')
  // Simpan draf sebelum kuis di-submit (kuota normal)
  shouldThrowQuotaError = false
  saveQuizDraft(testUid, {
    quizId: 'tata-nama-senyawa',
    category: 'Tata Nama Senyawa',
    questionsVersion: 'v1',
    answers: { 'q-01': 2, 'q-02': 0 }
  })

  const draftBefore = getQuizDraft(testUid, 'Tata Nama Senyawa', 'tata-nama-senyawa', 'v1')
  assert(draftBefore !== null, 'Draf jawaban siswa berhasil tercatat sebelum submit')

  // Logika QuizPage: Jika saveResult gagal, clearQuizDraft TIDAK dipanggil
  // Simulasikan submit gagal
  shouldThrowQuotaError = true
  const submitResult = saveQuizResult(mockFailResult, testUid)
  if (!submitResult.success) {
    // Draf dipertahankan (clearQuizDraft tidak dipanggil)
  } else {
    clearQuizDraft(testUid, 'Tata Nama Senyawa', 'tata-nama-senyawa', 'v1')
  }

  const draftAfter = getQuizDraft(testUid, 'Tata Nama Senyawa', 'tata-nama-senyawa', 'v1')
  assert(draftAfter !== null, 'Draf jawaban siswa TETAP DIPERTAHANKAN saat penyimpanan hasil kuis gagal')
  assert(draftAfter?.answers['q-01'] === 2, 'Isi jawaban draf siswa utuh dan tidak hilang')

  // --- 4. PENGUJIAN MEKANISME RETRY (IDEMPOTENCY / ANTI-DUPLIKASI) ---
  console.log('\n--- 4. Pengujian Coba Simpan Ulang (Retry) Tanpa Duplikasi ---')
  // Kuota browser pulih kembali
  shouldThrowQuotaError = false
  const retryResult = saveQuizResult(mockFailResult, testUid)
  assert(retryResult.success === true, 'Coba simpan ulang (Retry) berhasil setelah kuota storage tersedia')

  // Verifikasi tidak ada duplikasi data
  const historyAfterRetry = getQuizHistory(testUid)
  const matchingAttempts = historyAfterRetry.filter(item => item.id === mockFailResult.id)
  assert(matchingAttempts.length === 1, 'Retry menggunakan ID percobaan yang sama TIDAK menduplikasi data di riwayat')

  // Jika retry sukses, barulah draf dibersihkan
  if (retryResult.success) {
    clearQuizDraft(testUid, 'Tata Nama Senyawa', 'tata-nama-senyawa', 'v1')
  }
  const draftAfterSuccess = getQuizDraft(testUid, 'Tata Nama Senyawa', 'tata-nama-senyawa', 'v1')
  assert(draftAfterSuccess === null, 'Draf kuis berhasil dibersihkan setelah retry sukses')

  // --- 5. PENGUJIAN PENYIMPANAN SUBMISI LMS (db.ts) SAAT ERROR ---
  console.log('\n--- 5. Pengujian Penyimpanan Submisi LMS saat Storage Gagal ---')
  shouldThrowQuotaError = true
  const lmsFailResult = saveQuizSubmission({
    ...mockFailResult,
    id: 'sub_lms_fail_999',
    userId: testUid,
    userName: 'Siswa Test',
    userEmail: 'siswa.test@carbonova.test'
  })
  assert(lmsFailResult === false, 'saveQuizSubmission mengembalikan status false saat localStorage gagal/penuh')

  shouldThrowQuotaError = false
  const lmsSuccessResult = saveQuizSubmission({
    ...mockFailResult,
    id: 'sub_lms_success_999',
    userId: testUid,
    userName: 'Siswa Test',
    userEmail: 'siswa.test@carbonova.test'
  })
  assert(lmsSuccessResult === true, 'saveQuizSubmission mengembalikan status true saat penyimpanan normal')

  console.log('\n========================================================')
  console.log(`🎉 HASIL PENGUJIAN ERROR STORAGE: ${passed} LULUS, ${failed} GAGAL`)
  console.log('========================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runStorageErrorTests().catch(err => {
  console.error('Unhandled test error:', err)
  process.exit(1)
})
