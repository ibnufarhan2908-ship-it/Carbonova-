import type { DetailedLesson } from '../types/chemistry'

export const LESSON_DETAILS: Record<string, DetailedLesson> = {
  'kekhasan-atom-karbon': {
    id: 'modul-1',
    slug: 'kekhasan-atom-karbon',
    moduleNumber: 1,
    title: 'Kekhasan Atom Karbon',
    subtitle: 'Tetravalensi, Konfigurasi Elektron & Kemampuan Katenasi',
    category: 'Konsep Dasar',
    introduction:
      'Atom karbon merupakan unsur terpenting dalam kehidupan. Mengapa ada jutaan senyawa organik di bumi yang berbasis atom karbon? Jawabannya terletak pada keistimewaan struktur elektronik dan jari-jari atomnya.',
    interactiveWidgetType: 'valence-demo',
    sections: [
      {
        title: '1. Nomor Atom & Konfigurasi Elektron',
        content:
          'Atom Karbon (C) memiliki nomor atom 6, yang berarti memiliki 6 proton dan 6 elektron. Berdasarkan mekanika kuantum, konfigurasi elektronnya adalah 1s² 2s² 2p². Pada kulit terluar (kulit valensi n = 2), terdapat 4 elektron valensi (2 elektron pada orbital 2s dan 2 elektron pada orbital 2p).',
        formula: '₆C: [He] 2s² 2p²  (Elektron Valensi = 4)',
        highlight:
          'Dengan 4 elektron valensi, atom karbon membutuhkan 4 elektron tambahan untuk mencapai susunan oktet stabil (8 elektron) seperti gas mulia Neon (Ne).',
      },
      {
        title: '2. Kemampuan Tetravalensi (Membentuk 4 Ikatan Kovalen)',
        content:
          'Karbon tidak cenderung melepaskan 4 elektron (karena energi ionisasi total sangat tinggi) dan juga tidak mudah menangkap 4 elektron (afinitas elektron tinggi). Karbon mencapai kestabilan melalui pemakaian pasangan elektron bersama (ikatan kovalen). Karbon selalu membentuk tepat 4 ikatan kovalen.',
        highlight:
          'Tetravalensi karbon mengadopsi hibridisasi sp³ (tetrahedral, sudut 109.5°), sp² (trigonal planar, sudut 120°), atau sp (linier, sudut 180°).',
      },
      {
        title: '3. Kemampuan Katenasi (Membentuk Rantai Karbon)',
        content:
          'Jari-jari atom karbon relatif kecil karena terletak pada periode 2. Ukuran kecil ini membuat ikatan kovalen antar atom karbon (C–C) berjarak pendek dan sangat kuat (energi ikatan ~348 kJ/mol). Hal ini memungkinkan atom-atom karbon saling mengikat membentuk rantai karbon yang sangat panjang dan stabil.',
        table: {
          headers: ['Bentuk Rantai', 'Karakteristik', 'Contoh Senyawa'],
          rows: [
            ['Rantai Lurus', 'Atom C berjejer satu arah tanpa cabang samping', 'n-Butana, n-Heksana'],
            ['Rantai Bercabang', 'Terdapat atom C yang menempel di luar rantai utama', '2-Metilpropana, Isooktana'],
            ['Rantai Siklik', 'Ujung-ujung rantai karbon saling terhubung membentuk cincin tertutup', 'Siklopropana, Sikloheksana, Benzena'],
          ],
        },
      },
      {
        title: '4. Jenis Ikatan Kovalen Antara Atom Karbon',
        content:
          'Atom karbon dapat berbagi 1, 2, atau 3 pasang elektron dengan sesama atom karbon:',
        table: {
          headers: ['Jenis Ikatan', 'Pasangan Elektron', 'Contoh Senyawa', 'Kereaktifan'],
          rows: [
            ['Tunggal (C–C)', '1 pasang elektron (ikatan sigma σ)', 'Etana (CH₃–CH₃)', 'Kurang reaktif (jenuh)'],
            ['Rangkap Dua (C=C)', '2 pasang elektron (1 sigma σ + 1 pi π)', 'Etena (CH₂=CH₂)', 'Reaktif (tak jenuh, adisi)'],
            ['Rangkap Tiga (C≡C)', '3 pasang elektron (1 sigma σ + 2 pi π)', 'Etuna (CH≡CH)', 'Sangat reaktif'],
          ],
        },
      },
      {
        title: '5. Posisi Atom Karbon dalam Rantai',
        content:
          'Berdasarkan jumlah atom C lain yang diikat secara langsung, atom C dibedakan menjadi:\n- Atom C Primer (1°): Mengikat langsung 1 atom C lain.\n- Atom C Sekunder (2°): Mengikat langsung 2 atom C lain.\n- Atom C Tersier (3°): Mengikat langsung 3 atom C lain.\n- Atom C Kuartener (4°): Mengikat langsung 4 atom C lain.',
        formula: 'Contoh pada 2,2-dimetilbutana: CH₃–C(CH₃)₂–CH₂–CH₃',
        highlight:
          'Pada senyawa di atas: Atom C nomor 2 adalah atom C kuartener karena mengikat 4 atom C lain (dua gugus metil cabang, C1, dan C3).',
      },
    ],
    summaryPoints: [
      'Karbon memiliki 4 elektron valensi dan selalu membentuk 4 ikatan kovalen (tetravalen).',
      'Kemampuan katenasi membentuk rantai karbon kokoh dipicu oleh jari-jari atom C yang kecil.',
      'Rantai karbon dapat berbentuk alifatik terbuka (lurus/bercabang) maupun alisiklik/aromatik (tertutup).',
      'Dikenal 4 posisi atom karbon: primer (1°), sekunder (2°), tersier (3°), dan kuartener (4°).',
    ],
  },

  hidrokarbon: {
    id: 'modul-2',
    slug: 'hidrokarbon',
    moduleNumber: 2,
    title: 'Senyawa Hidrokarbon',
    subtitle: 'Alkana, Alkena, dan Alkuna: Struktur & Sifat Seri Homolog',
    category: 'Golongan Utama',
    introduction:
      'Hidrokarbon adalah senyawa organik paling murni yang hanya tersusun atas dua jenis unsur: Karbon (C) dan Hidrogen (H). Berdasarkan jenis ikatan kovalennya, hidrokarbon alifatik dibagi menjadi tiga deret homolog: Alkana, Alkena, dan Alkuna.',
    sections: [
      {
        title: '1. Alkana — Hidrokarbon Jenuh (CₙH₂ₙ₊₂)',
        content:
          'Alkana adalah hidrokarbon yang seluruh ikatan antar atom karbonnya merupakan ikatan kovalen tunggal (C–C). Alkana disebut "jenuh" karena setiap valensi atom karbon telah mengikat jumlah atom hidrogen secara maksimal. Alkana juga disebut parafin (daya gabung kecil) karena kestabilannya yang tinggi.',
        formula: 'Rumus Umum Alkana: CₙH₂ₙ₊₂',
        table: {
          headers: ['Jumlah C (n)', 'Nama Alkana', 'Rumus Molekul', 'Titik Didih (°C)', 'Fasa (25°C)'],
          rows: [
            ['n = 1', 'Metana', 'CH₄', '-161.5', 'Gas'],
            ['n = 2', 'Etana', 'C₂H₆', '-88.6', 'Gas'],
            ['n = 3', 'Propana', 'C₃H₈', '-42.0', 'Gas (LPG)'],
            ['n = 4', 'Butana', 'C₄H₁₀', '-0.5', 'Gas (Korek api)'],
            ['n = 5', 'Pentana', 'C₅H₁₂', '36.1', 'Cair (Pelarut)'],
            ['n = 8', 'Oktana', 'C₈H₁₈', '125.7', 'Cair (Bensin)'],
          ],
        },
      },
      {
        title: '2. Alkena — Hidrokarbon Tak Jenuh Ikatan Rangkap Dua (CₙH₂ₙ)',
        content:
          'Alkena (olefin) memiliki minimal satu ikatan rangkap dua (C=C). Ikatan rangkap dua terdiri atas 1 ikatan sigma (σ) kuat dan 1 ikatan pi (π) yang lebih lemah dan rentan putus, sehingga alkena jauh lebih reaktif daripada alkana.',
        formula: 'Rumus Umum Alkena: CₙH₂ₙ (untuk 1 ikatan rangkap dua)',
        highlight:
          'Contoh: Etena (CH₂=CH₂, gas pematangan buah alami) dan Propena (CH₂=CH–CH₃, bahan baku serat polipropilena).',
      },
      {
        title: '3. Alkuna — Hidrokarbon Tak Jenuh Ikatan Rangkap Tiga (CₙH₂ₙ₋₂)',
        content:
          'Alkuna memiliki minimal satu ikatan kovalen rangkap tiga (C≡C) yang terdiri atas 1 ikatan sigma (σ) dan 2 ikatan pi (π). Sudut ikatan pada atom C berikatan rangkap tiga adalah 180° (geometri linier sp).',
        formula: 'Rumus Umum Alkuna: CₙH₂ₙ₋₂ (untuk 1 ikatan rangkap tiga)',
        highlight:
          'Contoh: Etuna atau gas asetilena (CH≡CH) digunakan pada las karbit karena menghasilkan nyala api bersuhu di atas 3000 °C saat dibakar bersama gas oksigen murni.',
      },
      {
        title: '4. Perbandingan Seri Homolog Hidrokarbon',
        content:
          'Deret homolog adalah kelompok senyawa dengan rumus umum sama, sifat kimia mirip, dan antaranggota yang berurutan berbeda sebesar gugus –CH₂– (selisih massa Mr = 14).',
        table: {
          headers: ['Golongan', 'Rumus Umum', 'Jenis Ikatan', 'Contoh Pertama', 'Kereaktifan'],
          rows: [
            ['Alkana', 'CₙH₂ₙ₊₂', 'Tunggal C–C', 'Metana (CH₄)', 'Inert / Pembakaran & Substitusi'],
            ['Alkena', 'CₙH₂ₙ', 'Rangkap Dua C=C', 'Etena (C₂H₄)', 'Reaktif / Adisi & Polimerisasi'],
            ['Alkuna', 'CₙH₂ₙ₋₂', 'Rangkap Tiga C≡C', 'Etuna (C₂H₂)', 'Sangat Reaktif / Adisi'],
          ],
        },
      },
    ],
    summaryPoints: [
      'Alkana (CnH2n+2) adalah hidrokarbon jenuh ikatan kovalen tunggal.',
      'Alkena (CnH2n) memiliki ikatan rangkap dua C=C yang mudah mengalami reaksi adisi.',
      'Alkuna (CnH2n-2) memiliki ikatan rangkap tiga C≡C dengan sudut ikatan linier 180°.',
      'Semakin panjang rantai karbon dalam satu deret homolog, semakin tinggi titik didih dan massa jenisnya.',
    ],
  },

  'tata-nama-senyawa-karbon': {
    id: 'modul-3',
    slug: 'tata-nama-senyawa-karbon',
    moduleNumber: 3,
    title: 'Tata Nama Senyawa Karbon',
    subtitle: 'Aturan IUPAC Sistematis untuk Alkana, Alkena, dan Alkuna',
    category: 'Nomenklatur Kimia',
    introduction:
      'Untuk membedakan jutaan struktur senyawa organik di seluruh dunia, International Union of Pure and Applied Chemistry (IUPAC) menetapkan sistem penamaan baku. Pelajari 4 langkah praktis dalam menamai senyawa karbon.',
    interactiveWidgetType: 'name-molecule',
    sections: [
      {
        title: '1. Langkah 1: Menentukan Rantai Induk Terpanjang',
        content:
          'Rantai induk adalah rantai karbon terpanjang yang bersambung tanpa putus. Jika pada senyawa terdapat ikatan rangkap (alkena/alkuna), maka rantai induk WAJIB melewati ikatan rangkap tersebut meskipun ada cabang yang lebih panjang.',
        table: {
          headers: ['Jumlah C', 'Alkana Induk', 'Gugus Alkil (Cabang)', 'Alkena Induk'],
          rows: [
            ['1', 'Metana', '–CH₃ (Metil)', '—'],
            ['2', 'Etana', '–C₂H₅ (Etil)', 'Etena'],
            ['3', 'Propana', '–C₃H₇ (Propil)', 'Propena'],
            ['4', 'Butana', '–C₄H₉ (Butil)', 'Butena'],
            ['5', 'Pentana', '–C₅H₁₁ (Pentil)', 'Pentena'],
            ['6', 'Heksana', '–C₆H₁₃ (Heksil)', 'Heksena'],
          ],
        },
      },
      {
        title: '2. Langkah 2: Penomoran Rantai Induk',
        content:
          'Penomoran atom karbon pada rantai induk dimulai dari salah satu ujung:\n- Pada Alkana: Dimulai dari ujung yang paling dekat dengan cabang alkil terdekat.\n- Pada Alkena & Alkuna: Dimulai dari ujung yang paling dekat dengan IKATAN RANGKAP (ikatan rangkap memiliki prioritas lebih tinggi daripada cabang alkil).',
        formula: 'Contoh: CH₃–CH(CH₃)–CH₂–CH=CH₂  → Nomor 1 dimulai dari =CH₂',
      },
      {
        title: '3. Langkah 3: Penulisan Cabang Berulang & Alfabetis',
        content:
          'Jika terdapat lebih dari satu cabang sejenis, gunakan awalan di- (2), tri- (3), tetra- (4). Jika terdapat cabang yang berbeda jenis (misal metil dan etil), urutan penulisannya didasarkan pada urutan alfabetis bahasa Indonesia (etil ditulis sebelum metil; awalan di/tri tidak dihitung dalam urutan abjad).',
        highlight:
          'Format penulisan baku: [Nomor Cabang]-[Nama Cabang][Nomor Ikatan Rangkap]-[Nama Rantai Induk]',
      },
      {
        title: '4. Contoh Analisis Kasus Penamaan',
        content:
          'Mari analisis rumus struktur: CH₃–CH(CH₃)–CH(C₂H₅)–CH₂–CH₃\n1. Rantai terpanjang: 6 atom C (Heksana), bukan 5!\n2. Penomoran dari kiri: Cabang metil ada di C3 dan etil di C4 (nomor terendah).\n3. Nama IUPAC yang benar: 4-etil-3-metilheksana.',
        formula: 'Hasil Akhir: 4-etil-3-metilheksana',
      },
    ],
    summaryPoints: [
      'Cari rantai karbon terpanjang yang memuat gugus prioritas / ikatan rangkap.',
      'Nomori rantai dari ujung terdekat dengan ikatan rangkap atau cabang.',
      'Tuliskan cabang secara alfabetis dengan awalan pengali (di, tri, tetra).',
      'Gunakan tanda hubung (-) antara angka dan huruf, serta tanda koma (,) di antara angka.',
    ],
  },

  'gugus-fungsi': {
    id: 'modul-4',
    slug: 'gugus-fungsi',
    moduleNumber: 4,
    title: 'Gugus Fungsi Turunan Alkana',
    subtitle: 'Alkohol, Eter, Aldehida, Keton, Asam Karboksilat & Ester',
    category: 'Turunan Alkana',
    introduction:
      'Gugus fungsi adalah gugus atom atau ikatan spesifik di dalam molekul yang bertanggung jawab atas karakteristik sifat fisik dan reaksi kimia senyawa tersebut. Senyawa turunan alkana terbentuk ketika satu atau lebih atom H digantikan oleh gugus fungsi.',
    sections: [
      {
        title: '1. Alkohol (Alkanol) vs Eter (Alkoksi Alkana)',
        content:
          'Alkohol dan eter merupakan pasangan isomer gugus fungsi dengan rumus umum molekul sama CₙH₂ₙ₊₂O.',
        table: {
          headers: ['Karakteristik', 'Alkohol (Alkanol)', 'Eter (Alkoksi Alkana)'],
          rows: [
            ['Gugus Fungsi', '–OH (Hidroksil)', '–O– (Alkoksi / Eter)'],
            ['Rumus Umum', 'R–OH', 'R–O–R\''],
            ['Titik Didih', 'Tinggi (ada ikatan hidrogen)', 'Rendah (hanya dipol-dipol)'],
            ['Reaksi Na / PCl₅', 'Bereaksi melepaskan gas H₂', 'Tidak bereaksi dengan logam Na'],
            ['Contoh & Kegunaan', 'Etanol: Antiseptik, pelarut obat', 'Dietil eter: Obat bius (anestesi klasik)'],
          ],
        },
      },
      {
        title: '2. Aldehida (Alkanal) vs Keton (Alkanon)',
        content:
          'Aldehida dan keton merupakan pasangan isomer gugus fungsi yang sama-sama memiliki gugus karbonil (C=O) dengan rumus umum molekul CₙH₂ₙO.',
        table: {
          headers: ['Karakteristik', 'Aldehida (Alkanal)', 'Keton (Alkanon)'],
          rows: [
            ['Gugus Fungsi', '–CHO (Formil, posisi ujung rantai)', '–CO– (Karbonil diapit 2 alkil)'],
            ['Rumus Umum', 'R–CHO', 'R–CO–R\''],
            ['Uji Fehling', 'Mereduksi Cu²⁺ → endapan merah bata Cu₂O', 'Tidak dapat mereduksi Fehling'],
            ['Uji Tollens', 'Mereduksi Ag⁺ → cermin perak (Ag)', 'Tidak dapat mereduksi Tollens'],
            ['Contoh & Kegunaan', 'Formalin (Metanal): Pengawet biologi', 'Aseton (Propanon): Pembersih kuteks'],
          ],
        },
      },
      {
        title: '3. Asam Karboksilat (Asam Alkanoat) vs Ester (Alkil Alkanoat)',
        content:
          'Asam karboksilat dan ester merupakan pasangan isomer gugus fungsi dengan rumus umum molekul CₙH₂ₙO₂.',
        table: {
          headers: ['Karakteristik', 'Asam Karboksilat', 'Ester (Alkil Alkanoat)'],
          rows: [
            ['Gugus Fungsi', '–COOH (Karboksil)', '–COO– (Karboalkoksi)'],
            ['Rumus Umum', 'R–COOH', 'R–COO–R\''],
            ['Sifat Asam/Basa', 'Asam lemah (memerahkan lakmus biru)', 'Netral'],
            ['Aroma & Bau', 'Menyengat, asam kecut', 'Harum manis buah-buahan (esens)'],
            ['Contoh & Kegunaan', 'Asam etanoat (asam cuka dapur 4%)', 'Etil etanoat: Perasa aroma nanas/pir'],
          ],
        },
      },
      {
        title: '4. Haloalkana (Alkil Halida)',
        content:
          'Haloalkana terbentuk saat atom hidrogen digantikan oleh halogen (–F, –Cl, –Br, –I). Contoh: Kloroform (CHCl₃) dahulunya digunakan sebagai anestesi, dan Freon-12 (CF₂Cl₂) sebagai pendingin refrigeran AC.',
      },
    ],
    summaryPoints: [
      'Gugus fungsi menentukan reaktivitas utama molekul senyawa karbon.',
      'Pasangan isomer fungsi: Alkohol & Eter (CnH2n+2O); Aldehida & Keton (CnH2nO); Asam Karboksilat & Ester (CnH2nO2).',
      'Uji pembeda Fehling & Tollens membedakan aldehida (bereaksi positif) dengan keton (negatif).',
      'Ester beraroma harum buah dihasilkan melalui reaksi esterifikasi asam karboksilat dan alkohol.',
    ],
  },

  'isomer-senyawa-karbon': {
    id: 'modul-5',
    slug: 'isomer-senyawa-karbon',
    moduleNumber: 5,
    title: 'Keisomeran Senyawa Karbon',
    subtitle: 'Rumus Molekul Sama, Struktur & Sifat Berbeda',
    category: 'Struktur Molekul',
    introduction:
      'Isomer adalah dua senyawa atau lebih yang memiliki rumus molekul sama persis, namun memiliki rumus struktur, susunan ruang atom, dan sifat fisik-kimia yang berbeda.',
    interactiveWidgetType: 'isomer-compare',
    sections: [
      {
        title: '1. Isomer Kerangka (Isomer Rantai)',
        content:
          'Isomer kerangka terjadi pada senyawa yang memiliki rumus molekul dan gugus fungsi sama, tetapi susunan kerangka rantai karbon induknya berbeda (lurus vs bercabang).',
        formula: 'Contoh C₄H₁₀:\n- n-Butana: CH₃–CH₂–CH₂–CH₃ (Titik Didih = -0.5 °C)\n- 2-Metilpropana (Isobutana): CH₃–CH(CH₃)–CH₃ (Titik Didih = -11.7 °C)',
        highlight:
          'Molekul dengan cabang memiliki bentuk yang lebih membulat (luas kontak antarmolekul lebih kecil), sehingga gaya Van der Waals lebih lemah dan titik didihnya lebih rendah.',
      },
      {
        title: '2. Isomer Posisi',
        content:
          'Isomer posisi terjadi jika rumus molekul, gugus fungsi, dan kerangka rantai utama sama, tetapi posisi ikatan rangkap atau letak gugus fungsi pada rantai utama berbeda.',
        formula: 'Contoh pada Butena (C₄H₈):\n- 1-Butena: CH₂=CH–CH₂–CH₃\n- 2-Butena: CH₃–CH=CH–CH₃',
        highlight:
          'Contoh pada Alkohol (C₃H₈O):\n- 1-Propanol (propil alkohol): CH₃–CH₂–CH₂–OH\n- 2-Propanol (isopropil alkohol): CH₃–CH(OH)–CH₃',
      },
      {
        title: '3. Isomer Gugus Fungsi',
        content:
          'Isomer gugus fungsi terjadi pada senyawa dengan rumus molekul sama, namun jenis gugus fungsinya berbeda sehingga tergolong ke dalam kelas senyawa organik yang berlainan.',
        table: {
          headers: ['Rumus Molekul', 'Pasangan Isomer Fungsi', 'Perbedaan Sifat Fisik'],
          rows: [
            ['C₂H₆O', 'Etanol (–OH) & Dimetil Eter (–O–)', 'Etanol cair (Td 78°C), Eter gas (Td -24°C)'],
            ['C₃H₆O', 'Propanal (–CHO) & Propanon (–CO–)', 'Propanal mereduksi Fehling, Aseton tidak'],
            ['C₃H₆O₂', 'Asam propanoat (–COOH) & Metil etanoat (–COO–)', 'Asam kecut menyengat vs aroma harum manis'],
          ],
        },
      },
      {
        title: '4. Isomer Geometri (Cis-Trans) pada Alkena',
        content:
          'Ikatan rangkap dua C=C memiliki ikatan pi (π) kaku yang tidak dapat berputar bebas (rotasi terhalang). Jika masing-masing atom C ikatan rangkap mengikat dua gugus yang berbeda, timbul isomer geometri: Cis (gugus sejenis sepihak) dan Trans (gugus sejenis berseberangan).',
        formula: 'Contoh pada 2-butena: cis-2-butena vs trans-2-butena',
      },
    ],
    summaryPoints: [
      'Isomer kerangka berbeda dalam susunan percabangan rantai karbon utama.',
      'Isomer posisi berbeda letak ikatan rangkap atau letak gugus fungsi pada kerangka yang sama.',
      'Isomer gugus fungsi memiliki rumus molekul identik namun sifat kimia bertolak belakang karena gugus fungsi berbeda.',
      'Perbedaan bentuk geometri molekul memengaruhi luas kontak antarmolekul dan titik didih.',
    ],
  },

  'sifat-dan-reaksi': {
    id: 'modul-6',
    slug: 'sifat-dan-reaksi',
    moduleNumber: 6,
    title: 'Sifat Fisik & Reaksi Kimia',
    subtitle: 'Titik Didih, Kepolaran, Pembakaran, Adisi, dan Substitusi',
    category: 'Reaktivitas Kimia',
    introduction:
      'Sifat fisik dan reaktivitas kimia senyawa karbon ditentukan secara langsung oleh panjang rantai karbon, kepolaran ikatan, keberadaan ikatan hidrogen, serta keberadaan ikatan pi (π).',
    sections: [
      {
        title: '1. Pengaruh Panjang Rantai & Ikatan Hidrogen terhadap Titik Didih',
        content:
          'Terdapat dua hukum utama terkait sifat fisik hidrokarbon dan turunannya:\n1. Semakin panjang rantai karbon (massa molar Mr meningkat), semakin luas area kontak antarmolekul, sehingga gaya dispersi London meningkat dan titik didih makin tinggi.\n2. Senyawa dengan ikatan hidrogen (seperti alkohol dan asam karboksilat) memiliki titik didih jauh lebih tinggi dibanding eter, aldehid, atau alkana dengan massa molar setara.',
        formula: 'Urutan Titik Didih (Mr setara): Alkana < Eter < Aldehida/Keton < Alkohol < Asam Karboksilat',
      },
      {
        title: '2. Reaksi Pembakaran Hidrokarbon (Oksidasi)',
        content:
          'Reaksi pembakaran merupakan reaksi hidrokarbon dengan gas oksigen (O₂) yang melepaskan kalor besar (eksotermik):\n- Pembakaran Sempurna (O₂ berlimpah): Menghasilkan gas karbon dioksida (CO₂) dan uap air (H₂O).\n- Pembakaran Tak Sempurna (O₂ terbatas): Menghasilkan gas beracun karbon monoksida (CO) dan partikel jelaga karbon (C).',
        formula: 'Pembakaran Sempurna Metana: CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g) + Energi',
      },
      {
        title: '3. Reaksi Adisi (Penjenuhan Ikatan Rangkap)',
        content:
          'Reaksi adisi adalah pemutusan ikatan rangkap (dua atau tiga) menjadi ikatan tunggal dengan memasukkan atom-atom baru. Reaksi ini merupakan ciri khas alkena dan alkuna.',
        table: {
          headers: ['Jenis Adisi', 'Reaktan', 'Persamaan Reaksi', 'Produk'],
          rows: [
            ['Hidrogenasi', 'Gas Hidrogen (H₂) + Katalis Ni/Pt', 'CH₂=CH₂ + H₂ → CH₃–CH₃', 'Alkana jenuh (Etana)'],
            ['Halogenasi (Uji Bromin)', 'Air Bromin (Br₂ cokelat)', 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br', '1,2-dibromoetana (bening)'],
            ['Hidrohalogenasi', 'Asam Halida (HCl / HBr)', 'CH₂=CH₂ + HCl → CH₃–CH₂Cl', 'Kloroetana (Aturan Markovnikov)'],
          ],
        },
      },
      {
        title: '4. Reaksi Substitusi & Esterifikasi',
        content:
          '- Reaksi Substitusi: Penggantian atom H pada alkana jenuh oleh halogen (misal klorinasi metana dengan sinar UV: CH₄ + Cl₂ → CH₃Cl + HCl).\n- Reaksi Esterifikasi: Pembentukan ester dari asam karboksilat dan alkohol dengan pelepasan molekul air (H₂O).',
        formula: 'Esterifikasi: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (Etil Etanoat) + H₂O',
      },
    ],
    summaryPoints: [
      'Gaya antarmolekul dan ikatan hidrogen mengontrol titik didih dan kelarutan zat.',
      'Pembakaran sempurna menghasilkan CO2 dan H2O; pembakaran tidak sempurna menghasilkan gas berbahaya CO.',
      'Ikatan rangkap dua (C=C) pada alkena sangat khas mengalami reaksi adisi yang memutuskan ikatan pi.',
      'Reaksi esterifikasi menghasilkan ester beraroma harum buah yang banyak digunakan di industri pangan.',
    ],
  },
}

