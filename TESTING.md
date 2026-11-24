# Dokumentasi Pengujian Sesi 2 (AD11-02: Isolasi State & Draf Multi-Pengguna)

Dokumen ini mencatat skenario pengujian fungsional untuk validasi isolasi draf kuis, riwayat pengerjaan, dan akses detail pengerjaan antara dua akun pengguna berbeda (Pengguna A dan Pengguna B) yang menggunakan browser yang sama.

---

## 1. Tabel Pengujian Sesi 2

| No | Langkah Pengujian | Aksi & Skenario | Hasil yang Diharapkan | Hasil Aktual | Status |
|:--:|:------------------|:----------------|:----------------------|:-------------|:------:|
| **1** | **A isi draf Hidrokarbon -> Refresh** | Pengguna A login, memilih kategori *"Identifikasi Hidrokarbon"*, memilih opsi jawaban untuk beberapa butir soal tanpa menekan tombol "Kumpulkan Jawaban", lalu me-refresh halaman browser (`F5` / reload). | Kategori tetap berada di *"Identifikasi Hidrokarbon"* (tidak reset ke *"Semua Topik"*). Jawaban yang telah dipilih Pengguna A tetap tercentang/terpilih secara utuh. Draf tersimpan di localStorage dengan format key `carbonova:draft:{uidA}:Identifikasi Hidrokarbon:...` dan format `Record<questionId, answer>`. | Sesuai ekspektasi: Kategori dan draf jawaban berhasil dipulihkan dari `getQuizDraft`, tidak kembali ke default. | **LULUS** |
| **2** | **A selesaikan -> Logout** | Pengguna A menyelesaikan seluruh soal kuis, menekan "Kumpulkan Jawaban", lalu menekan tombol Logout. | Submisi tersimpan ke riwayat Pengguna A (`carbonova:history:{uidA}`). Draf aktif kuis Pengguna A dibersihkan. Saat logout, fungsi `clearUserState(uidA)` dipanggil dan seluruh state lokal UI kuis (jawaban aktif, draf, detail) dikosongkan. | Sesuai ekspektasi: Draf kuis dihapus setelah submit, riwayat tersimpan, dan state sesi A di memori dibersihkan saat logout. | **LULUS** |
| **3** | **B login browser sama -> Cek draf, riwayat & akses detail** | Pengguna B login pada browser dan perangkat yang sama persis setelah Pengguna A logout. Pengguna B membuka halaman Kuis, tab Riwayat, dan mencoba mengakses URL/ID attempt milik Pengguna A. | - Halaman pengerjaan kuis Pengguna B bersih (tidak ada draf jawaban sisa milik Pengguna A).<br>- Tab Riwayat Pengguna B kosong (tidak memuat riwayat milik Pengguna A).<br>- Upaya membaca detail attempt Pengguna A (`getQuizAttempt(uidB, attemptIdA)`) **ditolak / mengembalikan `null`** karena verifikasi kepemilikan `attempt.userId === uidB` gagal. | Sesuai ekspektasi: State Pengguna B terisolasi penuh. Detail pengerjaan milik A tidak dapat diakses oleh B. | **LULUS** |
| **4** | **B kerjakan kategori beda -> Refresh** | Pengguna B memilih kategori berbeda (misal: *"Tata Nama Senyawa"*), mengisi beberapa butir jawaban draf, lalu me-refresh halaman browser. | Kategori yang terbuka setelah refresh tetap *"Tata Nama Senyawa"*. Jawaban draf milik Pengguna B terpilih kembali tanpa ada campur aduk dengan data Pengguna A. Draf tersimpan di key `carbonova:draft:{uidB}:Tata Nama Senyawa:...`. | Sesuai ekspektasi: Kategori dan draf jawaban Pengguna B pulih sesuai topik yang sedang dikerjakan. | **LULUS** |
| **5** | **Balik ke Akun A -> Verifikasi integritas data** | Pengguna B logout, lalu Pengguna A login kembali di browser tersebut. Buka halaman Kuis dan tab Riwayat. | Data dan riwayat Pengguna A tetap utuh sesuai pengerjaan sebelumnya. Riwayat Pengguna A tidak terkontaminasi atau ketambahan data pengerjaan Pengguna B. | Sesuai ekspektasi: Riwayat Pengguna A terbaca utuh dari `carbonova:history:{uidA}`, isolasi antar pengguna berhasil. | **LULUS** |

---

## 2. Bagian yang Belum Bisa Diuji Nyata (Firestore Cloud)

Meskipun logika isolasi lokal (localStorage, RBAC memori, proteksi hook, dan mitigasi race condition pada `QuizPage.tsx` / `quizStorage.ts`) telah teruji dan berjalan sesuai spesifikasi, terdapat keterbatasan pada integrasi cloud backend yang **belum dapat diuji secara live/nyata**:

1. **Koneksi Live Firebase Firestore**:
   - Pengujian live membutuhkan konfigurasi Firebase API key, project ID, dan jaringan live Firestore cloud yang aktif.
   - Tanpa emulator Firebase lokal atau kredensial cloud aktif pada lingkungan pengujian saat ini, sinkronisasi dokumen realtime `onSnapshot` dan penulisan `setDoc` / `addDoc` ke Firestore cloud belum diverifikasi langsung terhadap server Google Cloud.

2. **Evaluasi Firebase Security Rules di Server**:
   - Aturan keamanan Firestore (*Firestore Security Rules*) yang memvalidasi bahwa `request.auth.uid == resource.data.userId` di sisi server belum dapat dievaluasi langsung tanpa koneksi Firestore aktif atau Firebase Emulator Suite.

3. **Sinkronisasi Multi-Tab / Multi-Device Realtime Cloud**:
   - Pengujian penyelarasan riwayat kuis lintas perangkat nyata (misal: pengerjaan di Laptop A disinkronkan ke Handphone B melalui Firestore listener) masih menunggu ketersediaan environment Firebase live.

---

## 3. Dokumentasi Pengujian Temuan AD11-03: Penanganan Error Penyimpanan Hasil Kuis

### Deskripsi Temuan AD11-03
Sebelum perbaikan, fungsi `saveQuizResult` menelan *exception* (misalnya `QuotaExceededError` atau `DOMException: Storage quota exceeded`) pada blok `catch` dan tetap mengembalikan objek `result` seolah-olah data tersimpan. Halaman `QuizPage.tsx` secara otomatis menampilkan banner hijau *"Hasil pengerjaan otomatis tersimpan di localStorage browser Anda."*, padahal data tidak tersimpan dan draf kuis langsung terhapus.

### Solusi & Mitigasi yang Diterapkan
1. **Eliminasi Klaim Sukses Palsu**: `saveQuizResult` pada `src/utils/quizStorage.ts` kini mengembalikan objek bertipe `SaveQuizResultResponse`:
   ```ts
   export interface SaveQuizResultResponse {
     success: boolean
     data?: StoredQuizResult
     error?: string
   }
   ```
2. **Kondisional Banner Status**: Di `QuizPage.tsx`, pesan sukses berwarna hijau HANYA muncul jika `saveRes.success === true`.
3. **Penanganan Error Ramah Pengguna**: Jika penyimpanan gagal (`saveRes.success === false`):
   - Banner error (amber/kuning) ditampilkan dengan pesan eksplisit mengenai penyebab kegagalan (misalnya kuota penuh).
   - Skor akhir, butir evaluasi, dan pembahasan soal **tetap tampil utuh** agar siswa tidak kehilangan nilai belajarnya.
   - Draf jawaban siswa **tidak dihapus** dari storage.
   - Disediakan tombol **"Coba Simpan Ulang (Retry)"** dengan *idempotency* (mempertahankan ID percobaan yang sama agar tidak terjadi duplikasi saat penyimpanan berhasil).
   - Disediakan opsi **"Ekspor Hasil (JSON)"** dan **"Unduh Laporan (Teks)"** sebagai berkas cadangan offline mandiri bagi siswa.

---

### Cara Mensimulasikan Gagal Simpan di Browser

Anda dapat mensimulasikan kondisi kegagalan kuota penyimpanan (`QuotaExceededError`) di browser melalui Console DevTools (`F12`):

#### Langkah Simulasi:
1. Buka halaman kuis di browser (`http://localhost:5173/latihan`).
2. Jawab beberapa soal kuis hingga selesai.
3. Buka **DevTools** (`F12` atau `Ctrl + Shift + I`) lalu masuk ke tab **Console**.
4. Tempelkan (*paste*) script mock berikut untuk memaksa `localStorage.setItem` melempar `QuotaExceededError`:
   ```javascript
   window.__origSetItem = localStorage.setItem;
   localStorage.setItem = function(key, val) {
     if (key.includes('history')) {
       const err = new Error('The quota has been exceeded.');
       err.name = 'QuotaExceededError';
       err.code = 22;
       throw err;
     }
     return window.__origSetItem.apply(this, arguments);
   };
   console.warn('⚠️ Simulasi QuotaExceededError aktif pada localStorage');
   ```
5. Kembali ke halaman kuis dan klik tombol **"Kumpulkan Jawaban"**.
6. **Periksa Hasil:**
   - Pesan sukses hijau **TIDAK muncul**.
   - Muncul banner peringatan kuning: *"Penyimpanan Otomatis ke Browser Gagal"*.
   - Nilai skor dan pembahasan seluruh butir soal tetap dapat dipelajari.
   - Muncul tombol **"Coba Simpan Ulang (Retry)"**, **"Ekspor Hasil (JSON)"**, dan **"Unduh Laporan (Teks)"**.
7. Klik tombol **"Ekspor Hasil (JSON)"** atau **"Unduh Laporan (Teks)"**: berkas hasil kuis langsung terunduh ke komputer Anda.
8. Pulihkan kembali fungsi `localStorage` asli di Console:
   ```javascript
   localStorage.setItem = window.__origSetItem;
   console.log('✅ Penyimpanan normal dipulihkan');
   ```
9. Klik tombol **"Coba Simpan Ulang (Retry)"**:
   - Sistem berhasil menyimpan data.
   - Banner otomatis berubah menjadi hijau sukses: *"Hasil pengerjaan otomatis tersimpan di localStorage browser Anda."*.
   - Tidak terjadi duplikasi entri riwayat kuis.

---

### Hasil Pengujian Otomatis AD11-03
Jalankan di terminal:
```powershell
node test_quiz_storage_error.mjs
```
Hasil: **17 Lulus, 0 Gagal**.
