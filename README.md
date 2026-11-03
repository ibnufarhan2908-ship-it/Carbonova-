# CARBONOVA — Interactive Carbon Chemistry Learning Website

**Carbonova** adalah website pembelajaran kimia interaktif yang dirancang untuk membantu siswa SMA/MA memahami materi senyawa karbon melalui eksplorasi struktur molekul, visualisasi ikatan kovalen, tata nama IUPAC sistematis, keisomeran, eksperimen laboratorium virtual, serta latihan soal penalaran HOTS dengan penyimpanan hasil otomatis ke `localStorage`.

---

## 🔬 Fitur Utama

1. **Beranda (Homepage) Modern & Editorial**:
   - Hero section interaktif dengan visualisasi model atom karbon (tetrahedral sp³ & planar sp²).
   - Pengenalan konsep kekhasan atom karbon (tetravalensi, katenasi, rantai alifatik & siklik).
   - Kartu 6 kategori modul materi terstruktur.
   - Featured Molecules Showcase dengan interactive 2D ball-and-stick and structural formula viewer.
   - Preview 3 eksperimen virtual Carbon Lab.
   - Preview latihan soal penalaran ilmiah HOTS (Higher Order Thinking Skills).
   - 8 Capaian Pembelajaran (Learning Objectives) kimia kurikulum SMA/MA.

2. **Katalog & Pembaca Materi Interaktif (`/materi`)**:
   - **Modul 1: Kekhasan Atom Karbon** (nomor atom 6, konfigurasi elektron, tetravalensi, katenasi, ikatan tunggal/rangkap, posisi atom C primer s.d. kuartener).
   - **Modul 2: Hidrokarbon** (Alkana $C_nH_{2n+2}$, Alkena $C_nH_{2n}$, Alkuna $C_nH_{2n-2}$, deret homolog, perbandingan kereaktifan).
   - **Modul 3: Tata Nama Senyawa Karbon** (IUPAC sistematis, rantai induk terpanjang, penomoran cabang alkil, posisi ikatan rangkap) dilengkapi widget interaktif *"Name This Molecule"*.
   - **Modul 4: Gugus Fungsi Turunan Alkana** (Alkohol, Eter, Aldehida, Keton, Asam Karboksilat, Ester, Haloalkana dengan rumus umum, sifat, dan kegunaan).
   - **Modul 5: Keisomeran Senyawa Karbon** (Isomer kerangka n-butana vs isobutana, isomer posisi, isomer gugus fungsi, isomer geometri cis-trans).
   - **Modul 6: Sifat Fisik & Reaksi Kimia** (pengaruh panjang rantai dan ikatan hidrogen terhadap titik didih, pembakaran sempurna/tidak sempurna, adisi alkena, substitusi, dan esterifikasi).

3. **Molecule Explorer (`/molekul`)**:
   - Koleksi lengkap 12 molekul senyawa karbon sesuai PRD: **Metana**, **Etana**, **Propana**, **Butana**, **Etena**, **Etuna**, **Etanol**, **Etanal**, **Propanon**, **Asam Etanoat**, **Etil Etanoat**, dan **Benzena**.
   - Mode switch: Model Bola-Tongkat (Ball & Stick) vs Rumus Struktur 2D.
   - Kontrol Zoom In, Zoom Out, dan Tombol Reset Tampilan.
   - Legenda warna atom standar kimia (Karbon: Deep Navy, Hidrogen: Putih/Slate, Oksigen: Merah, Nitrogen: Biru).
   - Informasi lengkap: nama IUPAC, rumus molekul, rumus terkondensasi, Mr, titik didih, wujud zat, jenis ikatan kovalen, dan pemanfaatan dalam kehidupan sehari-hari.

4. **Carbon Lab (`/lab`)**:
   - **Molecular Structure Builder**: Perakitan atom C, H, dan O dengan validasi otomatis kaidah valensi (C=4, H=1, O=2) dan preset molekul edukatif.
   - **Simulasi Pembakaran (Combustion)**: Perbandingan pembakaran sempurna ($CO_2 + H_2O$) vs tidak sempurna ($CO + C$) dilengkapi neraca kekekalan atom stoikiometri setara.
   - **Uji Ketidakjenuhan**: Simulasi tabung reaksi penambahan air bromin ($Br_2$) pada alkana jenuh vs alkena tak jenuh (reaksi adisi ikatan rangkap dua).

5. **Latihan Soal & Evaluasi Penalaran HOTS (`/latihan`)**:
   - Bank soal bervariasi mencakup 7 kategori PRD dengan level penalaran: *Pemahaman, Penerapan, Analisis, Penalaran Induktif, dan Evaluasi*.
   - Filter pemilihan topik kuis spesifik maupun kuis komprehensif seluruh materi.
   - Umpan balik dan pembahasan ilmiah mendalam setelah kuis dikumpulkan.

6. **Penyimpanan Hasil Kuis Otomatis & Riwayat Kuis (`/riwayat`)**:
   - Penyimpanan persisten otomatis menggunakan browser `localStorage` (`src/utils/quizStorage.ts`).
   - Setiap pengerjaan memiliki Attempt ID unik sehingga hasil sebelumnya tidak tertimpa saat mengerjakan ulang.
   - Riwayat tetap tersedia saat halaman di-refresh, saat navigasi antarhalaman, maupun ketika browser ditutup dan dibuka kembali.
   - **Dashboard Learning Progress**: Statistik total kuis diselesaikan, rata-rata skor, skor tertinggi, dan kuis terakhir.
   - **Modal Detail Pengerjaan**: Membaca kembali jawaban yang dipilih siswa, kunci jawaban, dan pembahasan ilmiah yang tersimpan.
   - Fitur penghapusan riwayat (per item atau seluruhnya) dengan modal konfirmasi keamanan.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Type Checking)
- **Bundler**: Vite 8 (HMR Instan & Build Optimal)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` token sistem)
- **Routing**: React Router (`react-router-dom` v7)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage dengan Safe Error-Handling Fallback
- **Typography**: Plus Jakarta Sans / Inter

---

## 📁 Struktur Direktori

```
src/
├── components/
│   ├── home/
│   │   └── HeroMoleculeVisual.tsx         # Visual hero atom karbon interaktif
│   ├── layout/
│   │   ├── Footer.tsx                     # Footer terpisah
│   │   └── MainLayout.tsx                 # Wrapper layout dengan ScrollToTop
│   ├── materials/
│   │   ├── LessonDetailView.tsx           # Tampilan detail pembaca materi
│   │   └── NameMoleculeWidget.tsx         # Aktivitas interaktif "Name This Molecule"
│   ├── molecules/
│   │   └── MoleculeViewer2D.tsx           # Visualizer 2D bola-tongkat & rumus struktur dengan zoom
│   ├── navigation/
│   │   └── Navbar.tsx                     # Navbar terpisah & responsif dengan dropdown materi
│   └── quiz/
│       ├── QuizHistoryView.tsx            # Dashboard riwayat kuis & statistik belajar
│       └── QuizResultDetailModal.tsx      # Modal peninjau jawaban & pembahasan kuis
├── data/
│   ├── lessonDetails.ts                   # Konten lengkap 6 modul materi & tabel kimia
│   ├── lessons.ts                         # Metadata modul & 8 capaian pembelajaran
│   ├── molecules.ts                       # Dataset 12 molekul karbon PRD dengan koordinat akurat
│   └── questions.ts                       # Dataset bank soal penalaran HOTS
├── hooks/
│   └── useQuizHistory.ts                  # Hook pengelola riwayat kuis & localStorage
├── pages/
│   ├── AboutPage.tsx                      # Halaman Tentang Carbonova
│   ├── CarbonLabPage.tsx                  # Halaman virtual experiment
│   ├── HomePage.tsx                       # Halaman Beranda lengkap
│   ├── MaterialsPage.tsx                  # Halaman silabus & modul materi
│   ├── MoleculeExplorerPage.tsx           # Halaman direktori molekul interaktif
│   └── QuizPage.tsx                       # Halaman kuis dan riwayat pengerjaan
├── types/
│   ├── chemistry.ts                       # Definisi tipe TypeScript kimia
│   └── quiz.ts                            # Definisi tipe QuizResult, Answers & Stats
├── utils/
│   └── quizStorage.ts                     # Modul penyimpanan lokal localStorage yang aman
├── App.tsx                                # Konfigurasi routing utama
├── index.css                              # Konfigurasi Tailwind v4 & tema warna
└── main.tsx                               # Entry point React DOM
```

---

## 🚀 Menjalankan Project Secara Lokal

1. **Pastikan Node.js terinstal**:
   ```bash
   node -v
   npm -v
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Uji Build Produksi**:
   ```bash
   npm run build
   ```
