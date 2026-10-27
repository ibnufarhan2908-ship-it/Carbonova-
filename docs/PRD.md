# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# CARBONOVA — Interactive Carbon Chemistry Learning Website

**Version:** 1.0  
**Product Type:** Educational Website  
**Subject:** Chemistry — Carbon Compounds  
**Language:** Bahasa Indonesia  
**Target Users:** Siswa SMA/MA  
**Platform:** Responsive Web Application

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Name

Carbonova — Explore the World of Carbon Compounds.

### 1.2 Product Vision

Carbonova merupakan website pembelajaran kimia interaktif yang dirancang untuk membantu siswa memahami materi senyawa karbon melalui eksplorasi struktur molekul, visualisasi ikatan kimia, tata nama senyawa, sifat fisik dan kimia, serta latihan soal berbasis penalaran.

Website menggabungkan konsep pembelajaran kimia dengan teknologi digital agar siswa tidak hanya menghafal rumus dan nama senyawa, tetapi juga mampu mengidentifikasi struktur, menemukan pola, dan menarik kesimpulan berdasarkan bukti ilmiah.

### 1.3 Problem Statement

Materi senyawa karbon memiliki beberapa tantangan dalam pembelajaran:
- Siswa kesulitan membayangkan struktur molekul dalam bentuk tiga dimensi.
- Siswa sering menghafal tata nama tanpa memahami hubungan antara struktur dan nama senyawa.
- Siswa membutuhkan latihan untuk menghubungkan rumus molekul, rumus struktur, gugus fungsi, dan sifat senyawa.
- Pembelajaran yang hanya menggunakan teks dan gambar statis kurang memberikan kesempatan untuk eksplorasi mandiri.
- Siswa membutuhkan soal yang melatih penalaran, analisis bukti, evaluasi, dan penarikan kesimpulan.

### 1.4 Product Goals

1. Menyediakan materi senyawa karbon yang terstruktur dan akurat.
2. Memvisualisasikan struktur molekul karbon secara interaktif.
3. Membantu siswa memahami hubungan struktur, gugus fungsi, tata nama, dan sifat senyawa.
4. Menyediakan latihan soal dengan beragam tingkat penalaran.
5. Memberikan umpan balik dan pembahasan yang mendukung pemahaman konsep.
6. Menghadirkan pengalaman belajar yang modern, menarik, dan responsif.

---

## 2. TARGET USERS

### Primary Users: Siswa SMA/MA

Kebutuhan:
- Memahami konsep senyawa karbon.
- Mengidentifikasi struktur dan gugus fungsi.
- Berlatih menentukan nama senyawa.
- Memahami hubungan struktur dengan sifat senyawa.
- Mengukur pemahaman melalui kuis interaktif.

### Secondary Users: Guru Kimia

Kebutuhan:
- Menyediakan media pembelajaran digital.
- Menggunakan visualisasi sebagai pendukung penjelasan.
- Memberikan latihan soal kepada siswa.

---

## 3. LEARNING OBJECTIVES

Setelah menggunakan website, siswa diharapkan mampu:

1. Menjelaskan karakteristik atom karbon dan kemampuannya membentuk rantai karbon.
2. Mengidentifikasi jenis ikatan dan bentuk rantai karbon.
3. Membedakan rumus molekul, rumus struktur, dan rumus struktur terkondensasi.
4. Mengidentifikasi golongan hidrokarbon berdasarkan jenis ikatan.
5. Menjelaskan tata nama dasar alkana, alkena, dan alkuna.
6. Mengidentifikasi gugus fungsi senyawa turunan alkana.
7. Menjelaskan hubungan struktur molekul dengan sifat senyawa.
8. Menganalisis pola data dan menarik kesimpulan tentang karakteristik senyawa karbon.

---

## 4. INFORMATION ARCHITECTURE

Website memiliki halaman utama berikut:

- Beranda
- Materi
- Eksplorasi Molekul
- Carbon Lab
- Latihan Soal
- Evaluasi
- Tentang

Gunakan React Router untuk navigasi ant halaman. Setiap halaman harus memiliki URL dan komponen yang jelas.

Navbar harus dibuat sebagai komponen terpisah dari konten halaman. Navbar tidak boleh digabungkan langsung ke dalam komponen Homepage.

---

## 5. CORE FEATURES

### 5.1 Homepage

Buat beranda dengan gaya visual modern, scientific, dan sedikit futuristik.

#### Hero Section

Headline:
"Discover the Chemistry of Carbon"

Subheadline:
"Jelajahi struktur, sifat, dan reaktivitas senyawa karbon melalui pengalaman belajar kimia yang interaktif."

Primary CTA:
"Mulai Eksplorasi"

Secondary CTA:
"Jelajahi Molekul"

Gunakan visual utama berupa model molekul karbon dengan atom dan ikatan yang ditampilkan secara menarik.

#### Homepage Sections

1. Hero section.
2. Pengenalan singkat tentang senyawa karbon.
3. Kartu kategori materi.
4. Featured Molecules.
5. Bagian Carbon Lab.
6. Preview latihan soal.
7. Ringkasan tujuan pembelajaran.
8. Footer.

Setiap tombol navigasi harus mengarah ke halaman yang benar.

### 5.2 Learning Modules

Buat katalog materi dengan kartu pembelajaran, pencarian, dan filter kategori.

#### Module 1 — Kekhasan Atom Karbon

Materi:
- Nomor atom dan konfigurasi elektron karbon.
- Elektron valensi.
- Kemampuan membentuk empat ikatan kovalen.
- Ikatan karbon dengan karbon.
- Kemampuan membentuk rantai lurus, bercabang, dan siklik.
- Ikatan tunggal, rangkap dua, dan rangkap tiga.

Visualisasi:
- Model atom karbon sederhana.
- Ilustrasi ikatan kovalen.
- Perbandingan struktur rantai karbon.

#### Module 2 — Hidrokarbon

Materi:
- Pengertian hidrokarbon.
- Alkana.
- Alkena.
- Alkuna.
- Rumus umum hidrokarbon rantai terbuka dengan satu rantai tanpa cincin dan tanpa ikatan rangkap selain yang didefinisikan.
- Perbedaan struktur dan ikatan.
- Isomer struktur dasar.

Contoh:
- Metana, CH₄.
- Etana, C₂H₆.
- Propana, C₃H₈.
- Etena, C₂H₄.
- Propena, C₃H₆.
- Etuna, C₂H₂.

Sediakan tabel perbandingan rumus, jenis ikatan, dan contoh senyawa.

#### Module 3 — Tata Nama Senyawa Karbon

Materi:
- Menentukan rantai induk.
- Menentukan jumlah atom karbon.
- Penomoran rantai.
- Penentuan posisi ikatan rangkap.
- Penamaan cabang alkil sederhana.
- Tata nama dasar alkana, alkena, dan alkuna.

Contoh pembelajaran:
- CH₄: metana.
- CH₃–CH₃: etana.
- CH₃–CH₂–CH₃: propana.
- CH₂=CH₂: etena.
- CH≡CH: etuna.
- CH₃–CH₂–OH: etanol.

Tambahkan fitur "Name This Molecule" yang menampilkan struktur senyawa dan meminta siswa memilih nama yang tepat.

#### Module 4 — Gugus Fungsi

Materi:
- Alkohol.
- Eter.
- Aldehida.
- Keton.
- Asam karboksilat.
- Ester.
- Haloalkana.
- Amina sebagai pengayaan jika sesuai dengan cakupan pembelajaran.

Untuk setiap gugus fungsi, tampilkan:
- Struktur umum.
- Contoh senyawa.
- Rumus struktur.
- Tata nama dasar.
- Sifat atau karakteristik utama.
- Contoh pemanfaatan dalam kehidupan sehari-hari.

Contoh:
- Etanol: alkohol.
- Etanal: aldehida.
- Propanon: keton.
- Asam etanoat: asam karboksilat.
- Etil etanoat: ester.

Pastikan struktur dan nama senyawa sesuai dengan aturan tata nama yang benar.

#### Module 5 — Isomer Senyawa Karbon

Materi:
- Pengertian isomer.
- Isomer rantai.
- Isomer posisi.
- Isomer gugus fungsi sebagai pengayaan.
- Perbedaan rumus molekul dan struktur.

Contoh:
- Butana dan 2-metilpropana sebagai isomer rantai.
- Etanol dan dimetil eter sebagai pasangan dengan rumus molekul sama tetapi gugus fungsi berbeda.

Sediakan perbandingan visual untuk membantu siswa melihat perbedaan struktur.

#### Module 6 — Sifat dan Reaksi Senyawa Karbon

Materi:
- Hubungan struktur dengan sifat fisik.
- Pengaruh panjang rantai karbon terhadap titik didih pada seri homolog yang sebanding.
- Reaksi pembakaran hidrokarbon.
- Reaksi adisi pada alkena.
- Reaksi substitusi sederhana pada alkana sebagai pengayaan.
- Reaksi esterifikasi sederhana.

Gunakan persamaan reaksi yang telah diseimbangkan dan jelaskan kondisi reaksi apabila diperlukan.

---

## 6. MOLECULE EXPLORER

Fitur utama untuk mengeksplorasi struktur senyawa karbon.

### 6.1 Main Interface

Tampilkan:
- Area visualisasi molekul.
- Nama senyawa.
- Rumus molekul.
- Rumus struktur.
- Kategori senyawa.
- Jumlah atom dan jenis ikatan.
- Deskripsi singkat.

### 6.2 Molecule Collection

Sediakan koleksi awal:
- Metana.
- Etana.
- Propana.
- Butana.
- Etena.
- Etuna.
- Etanol.
- Etanal.
- Propanon.
- Asam etanoat.
- Etil etanoat.
- Benzena sebagai materi pengayaan.

### 6.3 Interactive Features

- Pengguna dapat memilih molekul dari katalog.
- Visualisasi berubah sesuai molekul yang dipilih.
- Atom dan ikatan diberi warna yang konsisten.
- Nama dan rumus senyawa diperbarui secara otomatis.
- Sediakan opsi tampilan model bola-dan-tongkat dan rumus struktur 2D jika memungkinkan.
- Jika model 3D diterapkan, dukung rotasi dan zoom.
- Sediakan legenda warna atom.
- Sediakan tombol reset tampilan.

Gunakan library visualisasi molekul yang kompatibel dengan React apabila diperlukan. Jika implementasi 3D belum tersedia, gunakan diagram 2D yang akurat.

Jangan menampilkan model molekul dekoratif yang tidak sesuai dengan rumus kimianya.

---

## 7. CARBON LAB

Buat halaman eksperimen digital untuk membantu siswa mengeksplorasi konsep senyawa karbon.

### 7.1 Virtual Experiment: Molecular Structure Builder

Fitur:
- Menyediakan atom karbon, hidrogen, dan oksigen.
- Pengguna memilih struktur senyawa dari kumpulan komponen yang tersedia.
- Pengguna dapat menyusun model melalui antarmuka drag-and-drop jika dapat diimplementasikan dengan baik.
- Sistem memeriksa validitas ikatan berdasarkan aturan valensi dasar.
- Sistem memberikan umpan balik terhadap struktur yang dibuat.
- Menampilkan rumus struktur dan rumus molekul jika struktur valid.

Untuk MVP, batasi builder pada beberapa molekul sederhana yang telah ditentukan. Jangan mengklaim dapat mengenali semua kemungkinan struktur kimia.

### 7.2 Virtual Experiment: Combustion

Tampilkan simulasi konseptual pembakaran hidrokarbon.

Fitur:
- Pengguna memilih contoh hidrokarbon.
- Website menampilkan persamaan reaksi pembakaran sempurna yang setara.
- Pengguna melihat jumlah atom sebelum dan sesudah reaksi.
- Website memberikan penjelasan mengenai produk pembakaran.
- Tampilkan perbedaan pembakaran sempurna dan tidak sempurna secara konseptual.

Jangan menampilkan instruksi untuk melakukan pembakaran nyata. Fitur ini merupakan simulasi pembelajaran digital.

### 7.3 Virtual Experiment: Identifying Unsaturation

Buat simulasi konseptual untuk membandingkan hidrokarbon jenuh dan tak jenuh.

Fitur:
- Pengguna memilih contoh alkana atau alkena.
- Website menampilkan struktur ikatan.
- Website memberikan hasil pengamatan simulasi yang sesuai dengan skenario pembelajaran.
- Jelaskan bahwa pengujian kimia nyata membutuhkan prosedur keselamatan dan pengawasan yang tepat.

Jangan menyatakan hasil eksperimen yang disimulasikan sebagai data eksperimen nyata.

---

## 8. QUIZ AND ASSESSMENT

Buat sistem evaluasi interaktif dengan tampilan yang menarik.

### 8.1 Quiz Categories

1. Konsep dasar atom karbon.
2. Identifikasi hidrokarbon.
3. Tata nama senyawa.
4. Identifikasi gugus fungsi.
5. Isomer.
6. Analisis sifat dan reaksi.
7. Penalaran kimia.

### 8.2 Question Types

- Pilihan ganda.
- Identifikasi struktur.
- Pencocokan nama dan rumus.
- Analisis stimulus berupa tabel atau informasi eksperimen.
- Penarikan kesimpulan berdasarkan data.
- Evaluasi pernyataan berdasarkan bukti yang relevan.

### 8.3 Reasoning Levels

Sediakan variasi soal yang mengukur:
- Pemahaman dan identifikasi konsep.
- Penerapan konsep dalam situasi baru.
- Analisis hubungan antara struktur dan sifat.
- Penalaran induktif untuk menemukan pola dan membuat generalisasi.
- Evaluasi kesesuaian klaim dengan bukti ilmiah.

Setiap soal harus memiliki:
- Stimulus jika diperlukan.
- Pertanyaan yang jelas.
- Pilihan jawaban.
- Kunci jawaban.
- Pembahasan ilmiah.
- Label tingkat kesulitan atau jenis penalaran.

### 8.4 Quiz Logic

- Satu soal ditampilkan pada satu waktu atau dalam daftar yang terstruktur.
- Tampilkan progres pengerjaan.
- Pengguna dapat memilih jawaban.
- Sistem memeriksa jawaban.
- Skor dihitung berdasarkan jumlah jawaban benar.
- Tampilkan pembahasan setelah kuis dikumpulkan.
- Sediakan tombol mengulang kuis.
- Tampilkan rekomendasi materi untuk dipelajari kembali.

Untuk MVP, sediakan minimal 5 soal pada setiap kategori yang telah diimplementasikan.

---

## 9. DESIGN SYSTEM AND UI/UX

### 9.1 Visual Direction

Gunakan desain modern, editorial, scientific, dan premium. Hindari tampilan seperti template sekolah generik.

### 9.2 Color Palette

- Primary: Deep Navy `#101C3A`
- Secondary: Teal `#1DAA9A`
- Accent: Electric Cyan `#5DE0E6`
- Background: `#F5F7FB`
- Surface: `#FFFFFF`
- Text Primary: `#1D2939`
- Text Secondary: `#667085`

Gunakan warna aksen untuk elemen interaktif dan informasi penting.

### 9.3 Typography

Gunakan Inter atau Plus Jakarta Sans.

Pastikan:
- Judul memiliki hierarki yang jelas.
- Isi materi nyaman dibaca.
- Rumus kimia mudah dibedakan dari teks biasa.
- Ukuran font menyesuaikan layar.

### 9.4 Navbar

Navbar wajib dibuat sebagai komponen terpisah.

Item navigasi:
- Logo Carbonova.
- Beranda.
- Materi.
- Molecule Explorer.
- Carbon Lab.
- Latihan Soal.
- Tentang.

Persyaratan:
- Navbar memiliki jarak antaritem yang konsisten.
- Navbar tidak menutupi konten halaman.
- Active state menunjukkan halaman yang sedang dibuka.
- Dropdown Materi berfungsi apabila digunakan.
- Pada perangkat mobile, tampilkan menu hamburger.
- Pastikan tombol menu mobile dapat membuka dan menutup navigasi.
- Navbar dapat dibuat sticky jika tidak mengganggu pengalaman pengguna.

### 9.5 Cards and Interaction

- Gunakan radius kartu yang konsisten.
- Gunakan bayangan ringan.
- Tambahkan hover state yang halus.
- Gunakan transisi singkat.
- Hindari animasi yang mengganggu kegiatan belajar.
- Pastikan setiap kartu yang tampak dapat diklik benar-benar memiliki aksi.

### 9.6 Responsive Design

Website harus berfungsi pada desktop, laptop, tablet, dan smartphone.

Pastikan visualisasi molekul, kartu materi, panel eksperimen, dan kuis menyesuaikan lebar layar.

### 9.7 Accessibility

- Gunakan semantic HTML.
- Sediakan label yang jelas.
- Pastikan kontras warna memadai.
- Dukung navigasi keyboard.
- Gunakan teks alternatif untuk gambar.
- Jangan hanya mengandalkan warna untuk membedakan jawaban atau jenis atom.

---

## 10. TECHNICAL REQUIREMENTS

Gunakan stack berikut:
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Lucide React.
- Library visualisasi molekul yang kompatibel jika diperlukan.
- localStorage untuk progres belajar sederhana.

Gunakan versi dependency yang stabil dan kompatibel ketika proyek dibuat.

### Suggested Folder Structure

src/
- components/
  - layout/
  - navigation/
  - cards/
  - ui/
- pages/
  - HomePage.tsx
  - MaterialsPage.tsx
  - LessonPage.tsx
  - MoleculeExplorerPage.tsx
  - CarbonLabPage.tsx
  - QuizPage.tsx
  - AboutPage.tsx
- features/
  - molecule-explorer/
  - molecular-builder/
  - combustion-simulation/
  - quiz/
- data/
  - molecules.ts
  - lessons.ts
  - questions.ts
- hooks/
- utils/
- assets/
- styles/

Pisahkan data molekul, konten materi, soal, dan logika simulasi dari komponen presentasi.

---

## 11. NON-FUNCTIONAL REQUIREMENTS

1. Website dapat dibuka tanpa login.
2. Semua halaman utama dapat diakses melalui navigasi.
3. Setiap fitur inti memiliki interaksi yang nyata.
4. Rumus, nama, struktur, dan reaksi kimia harus konsisten.
5. Website responsif pada berbagai perangkat.
6. Tidak ada tombol utama yang hanya menjadi dekorasi.
7. Gunakan aset yang legal dan sesuai.
8. Tangani kondisi kosong dan error.
9. Hindari ketergantungan API eksternal untuk fitur inti.
10. Pastikan build berhasil dan tidak ada error kritis pada browser.
11. Sediakan dokumentasi instalasi dan penggunaan.
12. Gunakan bahasa Indonesia yang jelas dan sesuai konteks pembelajaran.

---

## 12. MVP DEVELOPMENT PLAN

### Phase 1 — Foundation
- Setup proyek.
- Design system.
- Navbar dan footer.
- Routing.
- Homepage responsif.

### Phase 2 — Learning Content
- Katalog materi.
- Halaman materi kekhasan atom karbon.
- Halaman materi hidrokarbon.
- Halaman tata nama dasar.
- Halaman gugus fungsi.

### Phase 3 — Interactive Features
- Molecule Explorer.
- Carbon Lab sederhana.
- Kuis tata nama.
- Kuis identifikasi gugus fungsi.
- Penilaian dan pembahasan.

### Phase 4 — Quality Assurance
- Uji seluruh navigasi.
- Uji responsivitas.
- Uji validitas struktur molekul yang didukung.
- Uji skor kuis.
- Periksa akurasi konten.
- Jalankan build produksi.
- Perbaiki error yang ditemukan.

Prioritaskan kualitas dan fungsi setiap fitur sebelum menambahkan fitur lanjutan.

---

## 13. ACCEPTANCE CRITERIA

MVP dianggap selesai apabila:

- Homepage menampilkan identitas Carbonova dengan konsisten.
- Navbar dan seluruh navigasi utama berfungsi.
- Katalog materi dapat dibuka.
- Materi senyawa karbon memiliki konten yang substantif.
- Molecule Explorer dapat mengganti dan menampilkan informasi molekul.
- Carbon Lab memberikan hasil simulasi sesuai aturan yang diterapkan.
- Kuis dapat menerima jawaban dan menghitung skor.
- Pembahasan sesuai dengan jawaban dan konsep kimia.
- Tampilan berfungsi pada desktop dan smartphone.
- Tidak ada placeholder pada fitur inti yang diklaim selesai.
- Proyek dapat dijalankan secara lokal.
- README tersedia dan menjelaskan cara menjalankan aplikasi.

---

## 14. INSTRUCTIONS FOR ANTIGRAVITY AI AGENT

Bertindaklah sebagai senior React developer, UI/UX designer, dan educational technology developer dengan pemahaman yang kuat terhadap pembelajaran kimia.

Baca file PRD.md secara keseluruhan sebelum melakukan implementasi.

### Implementation Rules

1. Periksa struktur proyek sebelum mengubah file.
2. Buat arsitektur aplikasi yang modular.
3. Pisahkan navbar, footer, halaman, dan komponen pembelajaran.
4. Implementasikan homepage terlebih dahulu.
5. Pastikan setiap halaman memiliki routing yang benar.
6. Implementasikan konten kimia yang akurat dan relevan.
7. Bangun visualisasi molekul dengan rumus dan struktur yang sesuai.
8. Implementasikan logika kuis dan simulasi yang dapat diuji.
9. Jalankan build dan perbaiki error.
10. Periksa responsivitas dan aksesibilitas.
11. Dokumentasikan fitur yang sudah selesai dan keterbatasan yang ada.
12. Jangan mengganti fitur yang diminta dengan mockup statis tanpa alasan teknis.

### Design Quality Rules

- Buat tampilan yang memiliki identitas visual unik.
- Hindari desain generik yang hanya berisi kumpulan kartu.
- Gunakan visual molekul sebagai elemen utama dengan tetap memperhatikan keterbacaan.
- Pertahankan konsistensi warna, tipografi, jarak, dan radius.
- Pisahkan struktur navigasi dari konten utama.
- Jangan menambahkan efek dekoratif secara berlebihan.

### Final Deliverables

Hasil implementasi harus mencakup:
1. Source code aplikasi.
2. Homepage Carbonova.
3. Katalog dan halaman materi senyawa karbon.
4. Molecule Explorer.
5. Carbon Lab.
6. Sistem kuis dan evaluasi.
7. Desain responsif.
8. README.
9. Ringkasan fitur yang berhasil diimplementasikan dan fitur yang belum selesai.

**Prioritas tertinggi: akurasi kimia, pengalaman belajar yang interaktif, struktur kode yang rapi, dan UI/UX yang berkualitas.**
