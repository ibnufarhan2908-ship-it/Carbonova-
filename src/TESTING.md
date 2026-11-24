# TESTING.md - Carbonova
## Pengujian Perbaikan AD11-02 (Sesi 2) - Draf & Riwayat Kuis Per Akun

**Scope:** HANYA AD11-02. Tidak mengubah AD11-01 (role guru).
**Tanggal:** 23 November 2026
**Akun Uji:** A: a@test.com, B: b@test.com (1 browser yang sama)

### 1. File yang Diubah + Struktur Key
**Diubah:**
- `src/utils/quizStorage.ts` - Key baru, filter userId, validasi attempt
- `src/pages/QuizPage.tsx` - Load draf setelah auth, anti race condition, clear state saat logout

**Key Lama (Bermasalah):**
- Draf: `quiz-answers` (global, tanpa uid)
- Riwayat: `carbonova_quiz_history_v1` (global)

**Key Baru (Aman):**
- Draf: `carbonova:draft:{uid}:{category}:{quizId}:{questionsVersion}`
- Riwayat: `carbonova:history:{uid}`
- Tamu: `carbonova:draft:guest:{category}:{quizId}:{questionsVersion}`
- `getQuizHistory(uid)` wajib filter `item.userId === uid`
- `getQuizAttempt(uid, attemptId)` wajib cek `attempt.userId === uid`, jika beda return null

### 2. Tabel Pengujian
| No | Skenario | Hasil | Status |
| --- | --- | --- | --- |
| 1 | A isi draf Hidrokarbon, refresh | Draf pulih, kategori tetap Hidrokarbon | LULUS |
| 2 | A selesaikan kuis, lalu logout | Riwayat A tersimpan | LULUS |
| 3 | B login di browser yang sama | Draf & riwayat B KOSONG, tidak ada data A | LULUS |
| 4 | B buka Detail hasil milik A | Ditolak / tidak tampil | LULUS |
| 5 | B kerjakan kategori beda, refresh | Draf B pulih, tidak menimpa A | LULUS |
| 6 | Logout B, login A lagi | Data A utuh, tanpa data B | LULUS |

**Bukti:** Screenshot Riwayat B kosong + Local Storage hanya key `carbonova:draft:{uid B}`

### 3. Hasil npm run build
**Status:** LULUS

### 4. Bagian yang Belum Diuji Nyata
- **Firestore Rules / Cloud:** Belum diuji di Firebase nyata, baru localStorage lokal.
- **Sinkronisasi Lintas Perangkat:** Belum diuji.
- **Hosting Nyata:** Belum diuji di URL publik.

**Kesimpulan Sesi 2:** AD11-02 LULUS untuk cakupan localStorage lokal. Bagian cloud BELUM DIUJI.