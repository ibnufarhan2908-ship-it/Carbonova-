# CARBONOVA — Interactive Carbon Chemistry Learning Website

**Carbonova** adalah website pembelajaran kimia interaktif yang dirancang untuk membantu siswa SMA/MA memahami materi senyawa karbon melalui eksplorasi struktur molekul, visualisasi ikatan kovalen, tata nama IUPAC, keisomeran, dan eksperimen laboratorium virtual.

---

## 🔬 Fitur Utama

1. **Beranda (Homepage) Komprehensif**:
   - Hero section interaktif dengan visual model atom karbon (tetrahedral sp³ & planar sp²).
   - Pengenalan konsep kekhasan atom karbon (tetravalensi, katenasi, rantai alifatik/siklik).
   - Kartu 6 kategori modul materi terstruktur.
   - Featured Molecules Showcase dengan interactive 2D ball-and-stick and structural formula viewer.
   - Preview 3 eksperimen virtual Carbon Lab.
   - Preview latihan soal penalaran ilmiah HOTS (Higher Order Thinking Skills).
   - 8 Capaian Pembelajaran (Learning Objectives) kimia kurikulum SMA/MA.

2. **Katalog Materi (`/materi`)**:
   - Modul 1: Kekhasan Atom Karbon
   - Modul 2: Hidrokarbon (Alkana, Alkena, Alkuna)
   - Modul 3: Tata Nama Senyawa Karbon (IUPAC)
   - Modul 4: Gugus Fungsi Turunan Alkana (Alkohol, Eter, Aldehida, Keton, Asam Karboksilat, Ester)
   - Modul 5: Keisomeran Senyawa Karbon
   - Modul 6: Sifat Fisik & Reaksi Kimia
   - Fitur pencarian instan dan filter kategori materi.

3. **Molecule Explorer (`/molekul`)**:
   - Katalog 12 molekul senyawa karbon nyata (Metana, Etana, Propana, Etena, Etuna, Etanol, Asam Asetat, Propanon, Benzena, dll).
   - Mode switch: Model Bola-Tongkat (Ball & Stick) vs Rumus Struktur 2D.
   - Legenda warna atom standar kimia (Karbon, Hidrogen, Oksigen, Nitrogen).
   - Informasi lengkap: nama IUPAC, rumus molekul, Mr, titik didih, wujud zat, jenis ikatan kovalen, dan aplikasi harian.

4. **Carbon Lab (`/lab`)**:
   - **Molecular Structure Builder**: Perakitan molekul dengan validasi otomatis kaidah valensi (C=4, H=1, O=2).
   - **Simulasi Pembakaran (Combustion)**: Perbandingan pembakaran sempurna ($CO_2 + H_2O$) vs tidak sempurna ($CO + C$) dengan persamaan stoikiometri setara.
   - **Uji Ketidakjenuhan**: Simulasi tabung reaksi penambahan air bromin ($Br_2$) pada alkana vs alkena (reaksi adisi ikatan rangkap dua).

5. **Latihan Soal & Evaluasi (`/latihan`)**:
   - Soal penalaran ilmiah berbasis stimulus tabel dan eksperimen.
   - Indikator level penalaran (Pemahaman, Penerapan, Analisis, Penalaran Induktif, Evaluasi).
   - Pembahasan ilmiah mendalam dan evaluasi skor otomatis.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Type Checking)
- **Bundler**: Vite 6 / 8 (HMR Instan & Build Optimal)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` token sistem)
- **Routing**: React Router (`react-router-dom`)
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans*)

---

## 📁 Struktur Direktori

```
src/
├── components/
│   ├── home/
│   │   └── HeroMoleculeVisual.tsx     # Visual hero atom karbon interaktif
│   ├── layout/
│   │   ├── Footer.tsx                 # Footer terpisah
│   │   └── MainLayout.tsx             # Wrapper layout dengan ScrollToTop
│   ├── molecules/
│   │   └── MoleculeViewer2D.tsx       # Visualizer 2D bola-tongkat & rumus struktur
│   └── navigation/
│       └── Navbar.tsx                 # Navbar terpisah & responsif
├── data/
│   ├── lessons.ts                     # Dataset 6 modul & 8 capaian pembelajaran
│   ├── molecules.ts                   # Dataset 12 molekul karbon akurat
│   └── questions.ts                   # Dataset bank soal penalaran HOTS
├── pages/
│   ├── AboutPage.tsx                  # Halaman Tentang Carbonova
│   ├── CarbonLabPage.tsx              # Halaman virtual experiment
│   ├── HomePage.tsx                   # Halaman Beranda lengkap (8 section)
│   ├── MaterialsPage.tsx              # Halaman silabus & modul materi
│   ├── MoleculeExplorerPage.tsx       # Halaman direktori molekul interaktif
│   └── QuizPage.tsx                   # Halaman kuis dan evaluasi
├── types/
│   └── chemistry.ts                   # Definisi tipe TypeScript kimia
├── App.tsx                            # Konfigurasi routing
├── index.css                          # Konfigurasi Tailwind v4 & tema warna
└── main.tsx                           # Entry point React DOM
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
   Buka peramban di `http://localhost:5173/`.

4. **Uji Build Produksi**:
   ```bash
   npm run build
   npm run preview
   ```
