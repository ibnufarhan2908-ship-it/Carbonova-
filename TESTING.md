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

---

## 4. Dokumentasi Pengujian Temuan AD11-05: Aksesibilitas Navigasi Keyboard Modal Detail Hasil Kuis

### Deskripsi Temuan AD11-05
Sebelum perbaikan, komponen modal detail hasil kuis (`src/components/quiz/QuizResultDetailModal.tsx`) memiliki keterbatasan aksesibilitas bagi pengguna keyboard dan teknologi asistif (*screen reader*):
1. **Tidak Ada Handler Tombol Escape**: Pengguna tidak dapat menutup modal dengan menekan tombol `Escape` pada keyboard.
2. **Kehilangan Fokus & Tidak Ada Focus Restoration**: Ketika modal dibuka, fokus kursor tidak otomatis berpindah ke tombol atau elemen di dalam modal. Saat modal ditutup, fokus kursor hilang ke `document.body` alih-alih kembali ke tombol pemicu (*trigger button*).
3. **Kebocoran Fokus Keyboard (No Focus Trap)**: Menekan tombol `Tab` atau `Shift + Tab` menyebabkan fokus melompat keluar ke navbar, tautan, atau tombol di halaman latar belakang di belakang modal (*focus leaking*).
4. **Elemen Latar Belakang Masih Aktif**: Konten di belakang modal tidak diisolasi (`aria-hidden` / `inert`), sehingga pembaca layar tetap membaca konten latar belakang saat modal aktif.

---

### Solusi & Mitigasi yang Diterapkan

File yang dimodifikasi: [`src/components/quiz/QuizResultDetailModal.tsx`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/components/quiz/QuizResultDetailModal.tsx)

1. **Penutupan Modal dengan Tombol Escape**:
   - Menambahkan event listener `keydown` global saat modal terbuka:
     ```ts
     if (e.key === 'Escape') {
       e.preventDefault()
       e.stopPropagation()
       onClose()
       return
     }
     ```
   - Tombol `Escape` langsung menutup modal dari posisi fokus manapun di dalam modal.

2. **Fokus Awal & Pengembalian Fokus (Focus Restoration)**:
   - Menyimpan referensi elemen pemicu aktif menggunakan `useRef`:
     ```ts
     previousActiveElementRef.current = document.activeElement as HTMLElement | null
     ```
   - Memindahkan fokus keyboard secara otomatis saat modal terbuka ke tombol tutup header (`closeButtonRef.current.focus()`) menggunakan `setTimeout(..., 0)`.
   - Pada *cleanup* saat modal tertutup, fokus kursor secara presisi dikembalikan ke elemen pemicu:
     ```ts
     if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
       previousActiveElementRef.current.focus()
     }
     ```

3. **Kunci Putaran Tab di Dalam Modal (Focus Trap)**:
   - Mengambil seluruh elemen interaktif yang terlihat menggunakan selector:
     `'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'`
   - **Forward Tab Wrap**: Jika fokus berada pada elemen interaktif terakhir di modal dan pengguna menekan `Tab`, fokus secara otomatis diputar kembali ke elemen interaktif pertama (tombol tutup header).
   - **Backward Tab Wrap**: Jika fokus berada pada elemen pertama dan pengguna menekan `Shift + Tab`, fokus diputar ke elemen interaktif terakhir (tombol tutup footer).

4. **Isolasi Latar Belakang & Portaling**:
   - Memanfaatkan `createPortal(modalContent, document.body)` dari `react-dom` agar modal dirender langsung di `<body>`, terpisah dari kontainer `#root`.
   - Menerapkan `rootEl.setAttribute('aria-hidden', 'true')` dan `rootEl.setAttribute('inert', '')` saat modal dibuka, lalu memulihkannya saat modal ditutup.
   - Mengunci scroll halaman utama dengan `document.body.style.overflow = 'hidden'`.
   - Menambahkan penanganan klik backdrop luar (`e.target === e.currentTarget`) untuk menutup modal secara intuitif.

5. **Navigasi & Pembacaan Detail Soal dengan Keyboard**:
   - Menambahkan atribut `tabIndex={0}`, `role="region"`, dan `aria-label="Rincian Jawaban Soal"` pada kontainer daftar soal dan pembahasan agar pengguna keyboard dapat menggulir (*scroll*) konten panjang menggunakan tombol panah atas/bawah (*Arrow Keys*), `Page Up`, dan `Page Down`.

---

### Cara Menguji Aksesibilitas Keyboard di Browser

1. Buka browser dan login ke akun Siswa atau Guru di Carbonova (`http://localhost:5173`).
2. Masuk ke halaman **Riwayat Kuis** atau **Dashboard Siswa / Guru**.
3. Gunakan tombol `Tab` pada keyboard untuk menavigasi daftar riwayat hingga tombol **"Lihat Detail"** / **"Detail"** terfokus (terdapat outline ring fokus).
4. Tekan tombol `Enter` atau `Space` untuk membuka modal detail pengerjaan.
5. **Uji Fokus Awal**:
   - Perhatikan bahwa fokus kursor langsung berada pada tombol silang (**X** / *"Tutup detail kuis"*) di sudut kanan atas modal.
6. **Uji Focus Trap (Tab Forward)**:
   - Tekan `Tab`: fokus berpindah ke kontainer area rincian soal.
   - Tekan panah bawah/atas (`Down Arrow` / `Up Arrow`) pada keyboard: daftar pembahasan soal dapat digulir dengan mulus.
   - Tekan `Tab`: fokus berpindah ke tombol **"Tutup"** di footer bawah modal.
   - Tekan `Tab` sekali lagi: fokus **TIDAK PERNAH keluar ke navbar atau halaman utama**, melainkan langsung berputar kembali ke tombol silang (**X**) di header.
7. **Uji Focus Trap (Shift + Tab Backward)**:
   - Saat fokus berada di tombol silang (**X**), tekan `Shift + Tab`.
   - Fokus berputar mundur ke tombol **"Tutup"** di footer.
8. **Uji Penutupan dengan Tombol Escape**:
   - Tekan tombol `Esc` pada keyboard: modal langsung tertutup seketika.
9. **Uji Focus Restoration**:
   - Setelah modal tertutup, periksa posisi fokus: kursor secara otomatis kembali menyorot tombol **"Lihat Detail"** yang memicunya tadi (tidak lompat ke awal halaman).
10. **Uji Backdrop Click**:
    - Buka kembali modal, lalu klik area gelap di luar kotak modal: modal menutup dan fokus kembali ke tombol pemicu.

---

### Hasil Pengujian Otomatis AD11-05
Jalankan di terminal:
```powershell
node test_modal_accessibility.mjs
```
Hasil: **Semua skenario lulus (7 Lulus, 0 Gagal)**:
- Selector elemen interaktif focus trap valid dan komprehensif
- Fokus awal otomatis mengarah ke tombol tutup modal
- Tab pada elemen terakhir berputar (*wrap around*) ke elemen pertama di modal
- Shift + Tab pada elemen pertama berputar mundur ke elemen terakhir
- Menekan tombol Escape langsung memicu penutupan modal
- Fokus keyboard berhasil dikembalikan ke elemen pemicu awal setelah modal tertutup
- Klik backdrop luar menutup modal, klik konten dalam dipertahankan

---

## 5. Dokumentasi Pengujian Temuan AD11-06: Perbaikan Masalah Layout Meluber (Horizontal Overflow) pada Viewport 375px

### Deskripsi Temuan AD11-06
Pada viewport ponsel selebar 375px (seperti iPhone SE / iPhone 12/13/14 Mini), ditemukan masalah *horizontal overflow* (lebar konten melebihi lebar layar) pada dua halaman utama:
1. **Bar Shortcut Navigasi Dashboard Siswa**:
   - Baris tombol navigasi ("Dashboard Siswa", "Materi Pembelajaran", "Latihan Soal", "Riwayat Pengerjaan") menggunakan flexbox kaku satu baris (`flex items-center gap-2`) tanpa pembungkusan (*wrap*).
   - Akibatnya, lebar kontainer membengkak hingga **488px**, menyebabkan tombol "Riwayat Pengerjaan" terpotong di tepi kanan layar dan memicu scroll horizontal pada seluruh dokumen.
2. **Tab Navigasi Eksperimen Carbon Lab**:
   - Tiga tab eksperimen ("Molecular Builder", "Simulasi Pembakaran", "Uji Ketidakjenuhan") ditempatkan dalam kontainer flex horizontal satu baris (`flex items-center gap-2`).
   - Teks label yang panjang menyebabkan kontainer meluber hingga **422px**, memotong tab "Uji Ketidakjenuhan" di sisi kanan.
3. **Sub-Toggle Kontrol Reaksi**:
   - Pilihan "Pembakaran Sempurna vs Tak Sempurna" dan sampel uji alkena/alkana diletakkan berdampingan secara kaku di layar kecil.

---

### Solusi & Perubahan Kelas CSS/Tailwind

#### 1. File [`src/pages/student/StudentDashboardPage.tsx`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/pages/student/StudentDashboardPage.tsx)
- **Bar Shortcut Navigasi Siswa (Baris 131–158)**:
  - Mengubah kontainer dari:
    ```tsx
    <div className="flex items-center gap-2">
    ```
    Menjadi:
    ```tsx
    <div className="flex flex-wrap items-center gap-2 w-full max-w-full">
    ```
  - Menyesuaikan ukuran tombol shortcut: `px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm` dan menambahkan `shrink-0` pada ikon Lucide.
  - Hasil: Pada layar 375px, 4 tombol shortcut turun (*wrap*) menjadi 2 baris yang tersusun rapi (2 tombol di baris atas, 2 tombol di baris bawah), pas di dalam lebar kontainer 343px tanpa scroll horizontal.
- **Header Profil Siswa & Logout (Baris 104)**:
  - Mengubah pembungkus profil & tombol logout menjadi:
    ```tsx
    <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 ...">
    ```
- **Header Riwayat Pengerjaan (Baris 302)**:
  - Mengubah kontainer menjadi `flex flex-col sm:flex-row sm:items-center justify-between gap-2` agar judul dan tautan riwayat lengkap tidak berhimpitan di layar sempit.

#### 2. File [`src/pages/CarbonLabPage.tsx`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/pages/CarbonLabPage.tsx)
- **Tab Utama Laboratorium Virtual (Baris 199–236)**:
  - Mengubah kontainer tab dari flex kaku satu baris:
    ```tsx
    <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
    ```
    Menjadi grid responsif yang terdistribusi sempurna:
    ```tsx
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-full">
    ```
  - Hasil:
    - Di layar ponsel (<640px, termasuk 375px): Ketiga tab tersusun secara vertikal (*full-width stack*) dengan tinggi sentuh nyaman (~48px), semua teks dan ikon terbaca utuh 100%, serta tidak ada pemotongan tab.
    - Di layar tablet & desktop (≥640px): Otomatis kembali menjadi 3 kolom sejajar dalam 1 baris (`sm:grid-cols-3`).
- **Toggle Mode Pembakaran (Baris 488)**:
  - Mengubah `flex gap-2` menjadi `flex flex-col sm:flex-row gap-2` sehingga kedua tombol opsi pembakaran tertumpuk rapi di mobile dan berdampingan di desktop.
- **Toggle Sampel Uji Ketidakjenuhan (Baris 631)**:
  - Mengubah `flex gap-2` menjadi `flex flex-col sm:flex-row gap-2` untuk tombol sampel Alkena dan Alkana.

---

### Cara Menguji Responsivitas Viewport 375px di Browser

1. Buka browser (Chrome, Edge, atau Firefox) dan jalankan aplikasi Carbonova (`http://localhost:5173`).
2. Tekan `F12` untuk membuka **Developer Tools**.
3. Klik tombol **Toggle Device Toolbar** (`Ctrl + Shift + M`) untuk masuk ke mode simulasi mobile.
4. Pilih preset **iPhone SE** atau atur resolusi manual ke lebar **375px** (tinggi 667px atau 812px).
5. **Uji Halaman Dashboard Siswa (`/siswa/dashboard`)**:
   - Perhatikan bar shortcut navigasi: Tombol "Dashboard Siswa", "Materi Pembelajaran", "Latihan Soal", dan "Riwayat Pengerjaan" tampil utuh dan tersusun rapi dalam 2 baris.
   - Buka Console DevTools dan ketik:
     ```javascript
     console.log('Scroll width:', document.documentElement.scrollWidth, 'Client width:', document.documentElement.clientWidth);
     ```
   - **Hasil yang Diharapkan**: Nilai `scrollWidth` sama persis dengan `clientWidth` (**375**), dan scrollbar horizontal halaman **TIDAK muncul**.
   - Klik setiap tombol shortcut ("Materi Pembelajaran", "Latihan Soal", "Riwayat Pengerjaan") untuk memastikan semua link dapat dijangkau dan berfungsi normal.
6. **Uji Halaman Carbon Lab (`/lab`)**:
   - Perhatikan 3 tab utama: "Molecular Builder", "Simulasi Pembakaran", dan "Uji Ketidakjenuhan" tersusun vertikal dengan tombol yang luas dan mudah disentuh.
   - Ketik kembali di Console:
     ```javascript
     console.log('Scroll width:', document.documentElement.scrollWidth, 'Client width:', document.documentElement.clientWidth);
     ```
   - **Hasil yang Diharapkan**: `scrollWidth === 375`. Tidak ada tombol tab yang terpotong di tepi kanan.
   - Buka tab "Simulasi Pembakaran" dan "Uji Ketidakjenuhan": perhatikan bahwa tombol toggle reaksi juga tersusun rapi tanpa meluber.

---

### Hasil Pengujian Otomatis AD11-06
Jalankan di terminal:
```powershell
node test_responsive_layout.mjs
```
Hasil: **Semua skenario tata letak lulus (3 Lulus, 0 Gagal)**:
- Bar shortcut Dashboard Siswa menggunakan `flex-wrap` dan `w-full max-w-full`.
- Tab eksperimen Carbon Lab menggunakan `grid grid-cols-1 sm:grid-cols-3` responsif.
- Sub-toggle kontrol reaksi menggunakan `flex-col sm:flex-row`.

---

## 6. Dokumentasi Pengujian Fitur "Masuk dengan Google" (Google Sign-In)

### Deskripsi Fitur
Sebagai alternatif login selain form email & kata sandi yang telah ada, fitur **Google Sign-In** ditambahkan dengan memanfaatkan layanan **Firebase Authentication** (`GoogleAuthProvider` & `signInWithPopup`). Fitur ini memungkinkan pengguna (siswa maupun guru) untuk masuk secara instan menggunakan akun Google mereka tanpa perlu mengingat kata sandi terpisah.

---

### Solusi & Implementasi Teknis

1. **Service Layer ([`src/services/firebaseAuth.ts`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/services/firebaseAuth.ts))**:
   - Menambahkan fungsi `firebaseSignInWithGoogle()` menggunakan `GoogleAuthProvider` dan `signInWithPopup(auth, provider)`.
   - Mengonfigurasi parameter kustom `provider.setCustomParameters({ prompt: 'select_account' })` agar dialog pemilihan akun Google selalu muncul saat tombol diklik.
   - **Pembuatan / Sinkronisasi Profil Firestore**:
     - Memeriksa dokumen pada koleksi Firestore `users/{uid}`.
     - Jika dokumen belum ada, profil baru otomatis dibuat menggunakan `fbUser.displayName`, `fbUser.email`, dan `fbUser.photoURL`.
     - Jika dokumen sudah ada, profil dimuat dan field `photoURL` serta `lastLoginAt` diperbarui.
   - **Aturan Penetapan Role Aman (AD11-01)**:
     - Logika penetapan role menggunakan validator `isTeacherAccount(email, uid)`.
     - Jika email akun Google cocok dengan email guru tepercaya (`guru.demo@carbonova.test` atau konfigurasi `VITE_TEACHER_EMAIL`), akun ditetapkan sebagai `teacher`.
     - Seluruh akun Google umum lainnya secara otomatis dan aman ditetapkan sebagai `student`.
   - **Penanganan Error Popup Humanis (Bahasa Indonesia)**:
     - `auth/popup-closed-by-user`: *"Jendela login Google ditutup sebelum proses masuk selesai. Silakan coba kembali."*
     - `auth/popup-blocked`: *"Jendela popup Google diblokir oleh browser. Harap izinkan popup pada peramban Anda lalu coba lagi."*
     - `auth/cancelled-popup-request`: *"Proses login Google dibatalkan karena ada jendela popup lain yang dibuka."*
     - `auth/operation-not-allowed`: *"Metode login Google belum diaktifkan di Firebase Console."*
     - `auth/unauthorized-domain`: *"Domain aplikasi ini belum diizinkan di Firebase Console."*

2. **State Management ([`src/context/AuthContext.tsx`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/context/AuthContext.tsx))**:
   - Menambahkan fungsi `loginWithGoogle()` ke dalam antarmuka `AuthContextType`.
   - Menghubungkan proses popup Firebase ke state autentikasi global aplikasi (`user`, `role`, `isAuthenticated`).

3. **Tipe Data ([`src/types/auth.ts`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/types/auth.ts))**:
   - Menambahkan properti opsional `photoURL?: string` pada antarmuka `User` untuk mendukung avatar foto profil dari akun Google.

4. **Antarmuka Pengguna ([`src/pages/auth/LoginPage.tsx`](file:///c:/Users/ASUS/Downloads/Zaffi_Antigravity/Carbonova-/src/pages/auth/LoginPage.tsx))**:
   - Form input email & kata sandi tetap dipertahankan 100%.
   - Di bawah tombol submit utama, ditambahkan:
     - Pemisah visual elegan bergaris dengan label teks **"atau"**.
     - Tombol **"Masuk dengan Google"** (atau *"Daftar dengan Google"* saat berada di tab pendaftaran) dengan ikon resmi Google (G multi-warna SVG).
     - Indikator putaran (*loading spinner*) dan teks *"Menghubungkan ke Google..."* selama jendela popup Google aktif.
   - **Pengalihan Otomatis Berdasarkan Peran**:
     - Akun guru Google dialihkan otomatis ke Dashboard Guru (`/guru/dashboard`).
     - Akun siswa Google dialihkan otomatis ke Dashboard Siswa (`/siswa/dashboard`).

---

### Cara Menguji Fitur Google Sign-In

#### 1. Pengujian Manual di Browser
1. Jalankan aplikasi Carbonova di browser:
   ```powershell
   npm.cmd run dev
   ```
2. Buka halaman login di [`http://localhost:5173/login`](http://localhost:5173/login).
3. **Periksa Tampilan UI**:
   - Di bawah tombol *"Masuk ke Sistem"*, terdapat garis pembatas *"atau"* dan tombol *"Masuk dengan Google"*.
   - Tombol Google memiliki ikon resmi Google berwarna dan tampilan responsif.
4. **Uji Klik Tombol Google**:
   - Klik tombol **"Masuk dengan Google"**:
   - Tombol berubah menampilkan spinner loading *"Menghubungkan ke Google..."*.
   - Jendela popup autentikasi Google akan terbuka.
5. **Uji Skenario Tutup Popup (Cancel)**:
   - Tutup jendela popup Google sebelum memilih akun.
   - Banner error muncul dengan pesan: *"Jendela login Google ditutup sebelum proses masuk selesai. Silakan coba kembali."*.
6. **Uji Skenario Berhasil Masuk**:
   - Pilih akun Google Anda di jendela popup.
   - Banner hijau sukses muncul: *"Berhasil masuk dengan Google! Mengalihkan ke dashboard..."*.
   - Jika akun Google Anda adalah akun umum, Anda diarahkan ke `/siswa/dashboard`.
   - Jika akun Google Anda cocok dengan email guru utama (`VITE_TEACHER_EMAIL`), Anda diarahkan ke `/guru/dashboard`.

---

### Hasil Pengujian Otomatis Fitur Google Sign-In
Jalankan di terminal:
```powershell
node test_google_auth.mjs
```
Hasil: **Semua skenario Google Sign-In lulus (7 Lulus, 0 Gagal)**:
- Integrasi `GoogleAuthProvider` dan `signInWithPopup` di `firebaseAuth.ts` terverifikasi.
- `loginWithGoogle` terintegrasi pada `AuthContextType` dan `AuthProvider`.
- Komponen tombol, ikon Google resmi, loading spinner, dan redirect role di `LoginPage.tsx` terpasang.
- Logika penetapan role akun umum Google otomatis menjadi `student`.
- Logika penetapan role email guru resmi Google ditetapkan menjadi `teacher`.
- Seluruh kode error popup Firebase (`popup-closed-by-user`, `popup-blocked`) dipetakan ke pesan bahasa Indonesia yang jelas.



