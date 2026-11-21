# PRD Tampilan Website – Carbonova

## 1. Tujuan

Dokumen ini disusun sebagai pedoman perancangan antarmuka (User Interface/UI) dan pengalaman pengguna (User Experience/UX) pada website Carbonova.

Carbonova merupakan website pembelajaran kimia yang dirancang untuk membantu siswa memahami kimia organik, khususnya senyawa karbon, melalui materi terstruktur, visualisasi molekul 3D, simulasi interaktif, dan latihan soal berbasis penalaran.

Perancangan tampilan website difokuskan pada:
- Menciptakan tampilan website yang modern, bersih, menarik, dan mudah digunakan.
- Menyediakan navigasi yang sederhana agar pengguna dapat mengakses setiap fitur dengan mudah.
- Menampilkan materi pembelajaran kimia secara terstruktur dan informatif.
- Menghadirkan pengalaman belajar interaktif melalui Molecule Explorer dan Carbon Lab.
- Menyediakan latihan soal untuk membantu pengguna mengukur pemahaman terhadap materi.
- Memperkenalkan fitur dan navigasi website kepada pengguna baru melalui Interactive Product Tour.

Dokumen ini berfokus pada desain, tata letak, komponen antarmuka, navigasi, dan interaksi visual website, bukan pada keseluruhan logika sistem atau pengembangan backend.

## 2. Daftar Halaman

Website Carbonova terdiri atas tujuh halaman utama:

1. Halaman Login
2. Halaman Home / Beranda
3. Halaman Materi
4. Halaman Molecule Explorer
5. Halaman Carbon Lab
6. Halaman Latihan Soal
7. Halaman Tentang

Selain halaman utama, terdapat fitur Interactive Product Tour yang memberikan panduan interaktif kepada pengguna ketika pertama kali masuk ke website.

## 3. Halaman Login

Halaman Login merupakan halaman awal yang digunakan pengguna untuk mengakses website Carbonova.

**Komponen:**
- Logo dan identitas Carbonova.
- Input Email / Username.
- Input Password.
- Tombol Login.

**Alur:**
- Pengguna memasukkan Email / Username dan Password.
- Setelah berhasil login, pengguna diarahkan ke halaman Home.
- Jika pengguna belum pernah menyelesaikan Interactive Product Tour, sistem akan menjalankan panduan secara otomatis.
- Jika pengguna sudah pernah menyelesaikan panduan, pengguna langsung dapat menggunakan website tanpa menampilkan Product Tour kembali.

## 4. Halaman Home / Beranda

Halaman Home merupakan halaman utama yang menjadi pusat navigasi dan pengenalan website Carbonova.

**Komponen:**
- Navbar berisi enam menu utama.
- Logo dan identitas Carbonova.
- Headline atau pengenalan Carbonova.
- Deskripsi singkat mengenai website.
- Ilustrasi atau visualisasi molekul karbon.
- Tombol Mulai Eksplorasi.
- Tombol Jelajahi Molekul.

**Desain:**
- Menggunakan layout yang bersih dan modern.
- Menampilkan visualisasi molekul sebagai elemen pendukung.
- Memiliki hierarki teks yang jelas.
- Menyediakan akses yang mudah menuju halaman lainnya.

## 5. Halaman Materi

Halaman Materi digunakan untuk menyajikan materi pembelajaran kimia karbon secara terstruktur.

**Komponen:**
- Judul halaman Materi.
- Daftar enam modul pembelajaran.
- Card materi.
- Deskripsi singkat setiap modul.
- Tombol untuk membuka materi.

**Desain:**
- Materi ditampilkan dalam bentuk card.
- Setiap modul memiliki judul dan deskripsi.
- Tampilan dibuat sederhana agar pengguna mudah menemukan materi yang ingin dipelajari.

## 6. Halaman Molecule Explorer

Halaman Molecule Explorer merupakan fitur untuk mengeksplorasi struktur molekul senyawa karbon dalam bentuk visualisasi 3D.

**Komponen:**
- Area visualisasi molekul 3D.
- Daftar card molekul.
- Tombol kategori molekul, seperti Semua dan kategori lainnya.
- Informasi nama dan rumus molekul.
- Tombol informasi molekul.

**Interaksi:**
- Pengguna dapat memilih molekul yang ingin dipelajari.
- Pengguna dapat memutar molekul dengan menggeser objek menggunakan mouse atau layar sentuh.
- Pengguna dapat melakukan zoom in dan zoom out.
- Pengguna dapat membuka informasi untuk melihat keterangan molekul.

**Desain:**
- Area visualisasi 3D menjadi fokus utama halaman.
- Daftar molekul ditampilkan dalam bentuk card.
- Informasi molekul disajikan secara ringkas dan mudah dipahami.

## 7. Halaman Carbon Lab

Halaman Carbon Lab merupakan fitur pembelajaran interaktif untuk mengeksplorasi karakteristik dan struktur senyawa karbon.

**Komponen dan fitur:**
- Simulasi pembakaran.
- Simulasi uji ikatan rangkap.
- Builder molekul.
- Area visualisasi atau simulasi.
- Informasi dan petunjuk penggunaan fitur.

**Desain:**
- Setiap simulasi ditampilkan dengan tata letak yang jelas.
- Area interaksi dibedakan dari area informasi.
- Menggunakan visualisasi yang mendukung pemahaman konsep kimia.

## 8. Halaman Latihan Soal

Halaman Latihan Soal digunakan untuk menguji pemahaman pengguna terhadap materi yang telah dipelajari.

**Komponen:**
- Daftar latihan soal.
- Pertanyaan dan stimulus.
- Pilihan jawaban.
- Tombol navigasi soal.
- Indikator progres pengerjaan.
- Tombol Selesai / Submit.
- Tampilan hasil latihan.

**Desain:**
- Soal ditampilkan secara terstruktur.
- Pilihan jawaban mudah dibaca dan dipilih.
- Hasil latihan disajikan secara informatif.

**Karakteristik soal:**
- Menggunakan soal berbasis penalaran atau HOTS.
- Menghadirkan stimulus yang relevan.
- Mendorong kemampuan analisis dan penggunaan bukti ilmiah.

## 9. Halaman Tentang

Halaman Tentang digunakan untuk memperkenalkan identitas, visi, standar keilmuan, dan konsep pembelajaran yang diterapkan dalam website Carbonova.

### A. Visi Kami

**Belajar Kimia Tanpa Sekadar Menghafal**

Kimia organik adalah ilmu tentang pola, geometri, dan logika ikatan elektron. Melalui eksplorasi digital dan simulasi interaktif, siswa dapat membangun pemahaman konseptual yang kokoh dan tahan lama.

### B. Standar Keilmuan

**Akurasi & Standar IUPAC**

Seluruh aturan tata nama, rumus struktur, persamaan stoikiometri, dan data sifat fisik senyawa disusun dengan cermat mengacu pada standar IUPAC Blue Book serta kurikulum kimia SMA/MA nasional.

### C. Empat Pilar Pembelajaran

Halaman Tentang menampilkan empat pilar utama yang menjadi dasar pengembangan website Carbonova.

1. **Modul Terstruktur**
   - Menyediakan enam modul materi komprehensif dari dasar hingga turunan alkana.

2. **Molecule Explorer**
   - Menyediakan visualisasi 3D bola-tongkat dan geometri ruang senyawa.

3. **Carbon Lab**
   - Menyediakan simulasi pembakaran, uji ikatan rangkap, dan builder molekul.

4. **Evaluasi HOTS**
   - Menyediakan soal penalaran berbasis stimulus, analisis, dan bukti ilmiah.

### D. Desain Halaman

- Bagian Visi Kami ditampilkan sebagai pengenalan utama.
- Bagian Standar Keilmuan menjelaskan acuan ilmiah Carbonova.
- Empat Pilar Pembelajaran ditampilkan dalam bentuk empat card.
- Setiap pilar dilengkapi ikon atau ilustrasi yang sesuai.
- Tampilan menggunakan kombinasi warna navy, putih, dan tosca.

## 10. Navbar / Header

Navbar merupakan komponen navigasi utama yang ditampilkan pada bagian atas website.

**Menu navigasi:**
1. Home
2. Materi
3. Molecule Explorer
4. Carbon Lab
5. Latihan Soal
6. Tentang

**Komponen tambahan:**
- Logo Carbonova.
- Informasi pengguna yang sedang login.
- Tombol Logout.

**Ketentuan desain:**
- Menggunakan background putih.
- Menu aktif memiliki penanda visual.
- Menggunakan ikon sebagai pendukung navigasi jika diperlukan.
- Memiliki tampilan responsif.
- Pada perangkat mobile, menu navigasi dapat disesuaikan menjadi hamburger menu.

## 11. Interactive Product Tour

### A. Tujuan

Interactive Product Tour merupakan fitur panduan interaktif yang bertujuan memperkenalkan navigasi dan fitur utama Carbonova kepada pengguna baru.

Panduan menggunakan metode spotlight dan tooltip untuk menyorot elemen tertentu pada website, sehingga pengguna dapat mengenali letak dan fungsi setiap menu secara langsung.

### B. Waktu Kemunculan

- Muncul secara otomatis setelah pengguna berhasil login untuk pertama kali.
- Pengguna diarahkan terlebih dahulu ke halaman Home.
- Panduan dimulai dari menu Home pada navbar.
- Tidak ditampilkan kembali setelah pengguna menyelesaikan atau melewati panduan.

### C. Tahapan Product Tour

**Step 1 – Home**
- Menyorot menu Home pada navbar.
- Menjelaskan bahwa Home merupakan halaman utama dan pusat navigasi Carbonova.

**Step 2 – Materi**
- Menyorot menu Materi.
- Menjelaskan bahwa pengguna dapat mempelajari enam modul kimia karbon yang tersedia.

**Step 3 – Molecule Explorer**
- Menyorot menu Molecule Explorer.
- Menjelaskan fitur visualisasi molekul 3D, termasuk memilih, memutar, dan memperbesar molekul.

**Step 4 – Carbon Lab**
- Menyorot menu Carbon Lab.
- Memperkenalkan fitur simulasi pembakaran, uji ikatan rangkap, dan builder molekul.

**Step 5 – Latihan Soal**
- Menyorot menu Latihan Soal.
- Menjelaskan bahwa pengguna dapat menguji pemahaman melalui soal berbasis penalaran dan analisis.

**Step 6 – Tentang**
- Menyorot menu Tentang.
- Menjelaskan bahwa halaman ini berisi visi Carbonova, standar keilmuan, dan empat pilar pembelajaran.

**Step 7 – Finish / Mulai Jelajah**
- Menampilkan pesan penutup bahwa pengenalan website telah selesai.
- Menampilkan ajakan untuk mulai menjelajahi Carbonova.
- Menampilkan tombol Mulai Jelajah.

### D. Desain dan Interaksi

- Menggunakan efek spotlight untuk menyorot elemen yang sedang diperkenalkan.
- Area di luar elemen yang disorot menggunakan overlay gelap transparan.
- Elemen yang disorot tetap terlihat jelas.
- Tooltip muncul di dekat elemen yang sedang diperkenalkan.
- Tooltip berisi judul dan deskripsi singkat.
- Posisi tooltip menyesuaikan lokasi elemen.
- Menampilkan indikator progres setiap tahap.
- Menyediakan tombol Sebelumnya, Berikutnya, dan Lewati.
- Pada tahap terakhir, tombol Berikutnya berubah menjadi Mulai Jelajah.
- Menggunakan animasi transisi yang halus.
- Tampilan responsif pada desktop, tablet, dan smartphone.

### E. Alur Setelah Product Tour

- Tombol Berikutnya membawa pengguna ke tahap selanjutnya.
- Tombol Sebelumnya membawa pengguna ke tahap sebelumnya.
- Tombol Lewati mengakhiri panduan secara langsung.
- Tombol Mulai Jelajah mengakhiri panduan setelah tahap terakhir.
- Setelah panduan selesai atau dilewati, pengguna tetap berada di halaman Home.
- Pengguna bebas memilih halaman yang ingin dikunjungi melalui navbar.
- Sistem tidak mengarahkan pengguna secara otomatis ke halaman lain.

### F. Penyimpanan Status

- Status Product Tour disimpan menggunakan Local Storage.
- Menggunakan key `carbonova-onboarding-done`.
- Nilai status menjadi `true` setelah pengguna menyelesaikan atau melewati panduan.
- Jika status sudah bernilai `true`, panduan tidak ditampilkan kembali.
- Pengguna dapat mengulang panduan melalui menu bantuan jika fitur tersebut disediakan.

## 12. Warna dan Tipografi

### A. Palet Warna

- **Navy Gelap / Slate-900:** warna utama untuk judul, tombol, dan elemen penting.
- **Tosca / Cyan:** warna aksen untuk ikon, highlight, indikator aktif, dan elemen interaktif.
- **Putih:** warna background utama.
- **Slate-600 / Abu-abu:** warna teks deskripsi dan informasi sekunder.

### B. Ketentuan Warna

- Tidak menggunakan warna hijau sebagai warna utama maupun aksen.
- Tidak menggunakan background ungu.
- Menjaga konsistensi warna pada seluruh halaman.
- Memastikan kontras teks dan background mudah dibaca.

### C. Tipografi

- Menggunakan font Inter atau Poppins.
- Judul menggunakan ketebalan font yang tegas.
- Deskripsi menggunakan ukuran dan ketebalan yang nyaman dibaca.
- Hierarki ukuran teks diterapkan secara konsisten.

## 13. Komponen UI

Komponen utama yang digunakan dalam website Carbonova meliputi:

1. Navbar / Header.
2. Button.
3. Card Materi.
4. Card Molekul.
5. Input Field.
6. Area Visualisasi 3D.
7. Kalkulator dan Simulasi.
8. Card Latihan Soal.
9. Modal / Pop-up.
10. Spotlight Overlay.
11. Tooltip.
12. Progress Indicator.
13. Interactive Product Tour.

## 14. Responsivitas Website

- Website dapat diakses melalui desktop, tablet, dan smartphone.
- Navbar menyesuaikan ukuran layar.
- Card dan konten menyesuaikan lebar perangkat.
- Visualisasi molekul 3D dapat digunakan pada perangkat mobile.
- Tooltip dan spotlight menyesuaikan posisi elemen agar tidak keluar dari area layar.
- Tombol navigasi mudah dijangkau dan digunakan.
- Seluruh halaman mempertahankan konsistensi tampilan pada berbagai ukuran perangkat.

## 15. Ketentuan Akhir Desain

Website Carbonova harus memiliki tampilan yang modern, bersih, konsisten, interaktif, dan mudah digunakan.

Setiap halaman memiliki fungsi dan karakteristik tampilan yang jelas, tetapi tetap menggunakan identitas visual yang sama.

Interactive Product Tour menjadi bagian dari pengalaman awal pengguna untuk memperkenalkan seluruh menu dan fitur Carbonova melalui panduan interaktif berbasis spotlight dan tooltip.

Setelah panduan selesai atau dilewati, pengguna tetap berada di halaman Home dan dapat menjelajahi seluruh fitur Carbonova secara bebas.