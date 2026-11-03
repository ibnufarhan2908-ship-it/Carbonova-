import type { QuizQuestion } from '../types/chemistry'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Konsep Dasar Atom Karbon
  {
    id: 'q-valensi',
    category: 'Konsep Dasar Atom Karbon',
    question:
      'Atom karbon memiliki nomor atom 6 dengan konfigurasi elektron 1s² 2s² 2p². Apa implikasi langsung dari konfigurasi ini terhadap pembentukan senyawa organik?',
    options: [
      'Karbon cenderung melepaskan 4 elektron valensinya membentuk kation C⁴⁺ yang sangat elektropositif',
      'Karbon cenderung menangkap 4 elektron dari atom logam untuk membentuk ion karbida C⁴⁻ stabil',
      'Karbon memiliki 4 elektron valensi dan menggunakan pasangan elektron bersama untuk membentuk 4 ikatan kovalen stabil (tetravalensi)',
      'Karbon hanya dapat membentuk ikatan kovalen tunggal dengan atom hidrogen saja',
    ],
    correctIndex: 2,
    explanation:
      'Energi ionisasi total untuk melepas 4 elektron (membentuk C⁴⁺) maupun afinitas elektron untuk menangkap 4 elektron (membentuk C⁴⁻) terlampau tinggi. Oleh sebab itu, karbon mencapai konfigurasi oktet stabil dengan cara pemakaian elektron bersama (ikatan kovalen) sebanyak 4 pasang, yang dikenal sebagai sifat tetravalen atom karbon.',
    reasoningLevel: 'Pemahaman',
    difficulty: 'Dasar',
  },
  {
    id: 'q-katenasi',
    category: 'Konsep Dasar Atom Karbon',
    stimulus:
      'Silikon (Si) berada tepat di bawah karbon pada golongan 14 dan juga memiliki 4 elektron valensi. Namun di alam, senyawa silikon rantai panjang (seperti silana) jauh lebih sedikit dan kurang stabil dibanding jutaan variasi senyawa rantai karbon (katenasi).',
    question:
      'Faktor utama apa yang menyebabkan atom karbon mampu membentuk rantai kovalen panjang yang sangat stabil dibandingkan atom silikon?',
    options: [
      'Jari-jari atom karbon relatif kecil sehingga tumpang-tindih (overlap) orbital ikatan C–C sangat kuat dan berenergi ikatan tinggi (348 kJ/mol)',
      'Atom karbon tidak memiliki neutron sehingga massa intinya lebih ringan',
      'Silikon memiliki elektronegativitas yang jauh lebih tinggi daripada karbon sehingga ikatannya rapuh',
      'Atom karbon bersifat logam sedangkan silikon merupakan gas mulia',
    ],
    correctIndex: 0,
    explanation:
      'Karbon memiliki periode 2 dengan jari-jari atom yang kecil, sehingga jarak antariatan C–C pendek dan tumpang tindih orbital ikatan sigma sangat efektif. Energi ikatan C–C (348 kJ/mol) jauh lebih besar daripada ikatan Si–Si (222 kJ/mol). Hal ini memberikan karbon kemampuan katenasi luar biasa membentuk rantai lurus, bercabang, hingga cincin siklik yang kokoh.',
    reasoningLevel: 'Analisis',
    difficulty: 'HOTS',
  },

  // 2. Identifikasi Hidrokarbon
  {
    id: 'q-deret-homolog',
    category: 'Identifikasi Hidrokarbon',
    stimulus:
      'Tiga senyawa hidrokarbon tak bercabang diuji di laboratorium: Zat X memiliki rumus molekul C₅H₁₂, Zat Y memiliki C₅H₁₀, dan Zat Z memiliki C₅H₈.',
    question:
      'Berdasarkan perbandingan rumus umum hidrokarbon alifatik terbuka, kelompokkan ketiga zat tersebut secara berurutan!',
    options: [
      'Zat X: Alkana (CnH2n+2), Zat Y: Alkena (CnH2n), Zat Z: Alkuna (CnH2n-2)',
      'Zat X: Alkena, Zat Y: Alkana, Zat Z: Alkuna',
      'Zat X: Alkuna, Zat Y: Alkena, Zat Z: Alkana',
      'Ketiga zat merupakan alkana jenuh karena memiliki jumlah atom C yang sama',
    ],
    correctIndex: 0,
    explanation:
      'Rumus umum hidrokarbon rantai terbuka: Alkana = CₙH₂ₙ₊₂ (untuk n=5 → C₅H₁₂); Alkena = CₙH₂ₙ (untuk n=5 → C₅H₁₀); Alkuna = CₙH₂ₙ₋₂ (untuk n=5 → C₅H₈). Maka Zat X adalah pentana (alkana), Zat Y adalah pentena (alkena), dan Zat Z adalah pentuna (alkuna).',
    reasoningLevel: 'Penerapan',
    difficulty: 'Dasar',
  },
  {
    id: 'q-posisi-atom-c',
    category: 'Identifikasi Hidrokarbon',
    stimulus:
      'Diberikan rumus struktur senyawa 2,2,4-trimetilpentana (isooktana): CH₃–C(CH₃)₂–CH₂–CH(CH₃)–CH₃',
    question:
      'Berapa jumlah atom karbon kuartener (4°) dan tersier (3°) yang terdapat pada molekul isooktana tersebut?',
    options: [
      '1 atom C kuartener dan 1 atom C tersier',
      '2 atom C kuartener dan 1 atom C tersier',
      '1 atom C kuartener dan 2 atom C tersier',
      '0 atom C kuartener dan 3 atom C tersier',
    ],
    correctIndex: 0,
    explanation:
      'Atom C kuartener (4°) mengikat 4 atom C lain secara langsung; pada senyawa ini adalah atom C nomor 2 (yang mengikat 2 cabang metil, C1, dan C3). Atom C tersier (3°) mengikat 3 atom C lain; pada senyawa ini adalah atom C nomor 4 (yang mengikat 1 cabang metil, C3, dan C5). Jadi, terdapat 1 atom C kuartener dan 1 atom C tersier.',
    reasoningLevel: 'Analisis',
    difficulty: 'Menengah',
  },

  // 3. Tata Nama Senyawa Karbon
  {
    id: 'q-tata-nama-alkena',
    category: 'Tata Nama Senyawa',
    stimulus: 'Suatu senyawa hidrokarbon memiliki rumus struktur: CH₃–CH(CH₃)–CH₂–CH=CH₂',
    question:
      'Berdasarkan aturan tata nama IUPAC, nama yang paling tepat untuk senyawa hidrokarbon tersebut adalah...',
    options: [
      '4-metil-1-pentena',
      '2-metil-4-pentena',
      '4-metil-pentana',
      '2-isopropil-etena',
    ],
    correctIndex: 0,
    explanation:
      'Langkah penamaan IUPAC: (1) Rantai induk terpanjang yang memuat ikatan rangkap dua terdiri dari 5 atom C (pentena). (2) Penomoran wajib dimulai dari ujung rantai yang terdekat dengan ikatan rangkap dua, sehingga C1 adalah =CH₂ dan C2 adalah –CH=. (3) Cabang metil (–CH₃) terletak pada atom C nomor 4. Oleh karena itu, namanya adalah 4-metil-1-pentena.',
    reasoningLevel: 'Penerapan',
    difficulty: 'Menengah',
  },
  {
    id: 'q-tata-nama-alkuna',
    category: 'Tata Nama Senyawa',
    stimulus: 'Diberikan senyawa: CH₃–C≡C–CH(CH₃)–CH₃',
    question:
      'Tentukan nama IUPAC yang tepat untuk senyawa alkuna bercabang di atas!',
    options: [
      '4-metil-2-pentuna',
      '2-metil-3-pentuna',
      '4,4-dimetil-2-butuna',
      'isopropil-metil-asetilena',
    ],
    correctIndex: 0,
    explanation:
      'Rantai utama terpanjang memuat ikatan rangkap tiga memiliki 5 atom C (pentuna). Penomoran dimulai dari ujung kiri agar ikatan rangkap tiga mendapat nomor serendah mungkin (nomor 2). Cabang metil berada pada atom C nomor 4. Nama IUPAC yang benar adalah 4-metil-2-pentuna.',
    reasoningLevel: 'Penerapan',
    difficulty: 'Menengah',
  },

  // 4. Identifikasi Gugus Fungsi
  {
    id: 'q-gugus-fungsi-fehling',
    category: 'Identifikasi Gugus Fungsi',
    stimulus:
      'Dua cairan beraroma berbeda, Senyawa A dan Senyawa B, keduanya memiliki rumus molekul C₃H₆O. Saat direaksikan dengan pereaksi Fehling, Senyawa A menghasilkan endapan merah bata Cu₂O, sedangkan Senyawa B tidak bereaksi.',
    question:
      'Manakah kesimpulan yang tepat mengenai gugus fungsi pada kedua senyawa tersebut?',
    options: [
      'Senyawa A adalah aldehida (propanal, –CHO) dan Senyawa B adalah keton (propanon, –CO–)',
      'Senyawa A adalah alkohol dan Senyawa B adalah asam karboksilat',
      'Senyawa A adalah ester dan Senyawa B adalah eter',
      'Senyawa A adalah keton sedangkan Senyawa B adalah alkena',
    ],
    correctIndex: 0,
    explanation:
      'Aldehida (alkanal) dan keton (alkanon) merupakan pasangan isomer gugus fungsi dengan rumus umum CₙH₂ₙO. Gugus aldehida (–CHO) memiliki atom H pereduksi pada karbonil sehingga dapat mereduksi ion Cu²⁺ pada pereaksi Fehling menjadi endapan merah bata tembaga(I) oksida (Cu₂O). Keton (–CO–) tidak memiliki atom H pada karbonil sehingga tidak dapat dioksidasi oleh Fehling.',
    reasoningLevel: 'Penalaran Induktif',
    difficulty: 'HOTS',
  },
  {
    id: 'q-gugus-ester',
    category: 'Identifikasi Gugus Fungsi',
    stimulus:
      'Reaksi antara asam etanoat (CH₃COOH) dan etanol (CH₃CH₂OH) dengan katalis asam sulfat pekat menghasilkan zat cair beraroma harum manis buah (C₄H₈O₂) serta air.',
    question:
      'Golongan senyawa dan nama gugus fungsi hasil reaksi esterifikasi tersebut adalah...',
    options: [
      'Ester dengan gugus fungsi karboalkoksi (–COO–)',
      'Eter dengan gugus fungsi alkoksi (–O–)',
      'Aldehida dengan gugus fungsi formil (–CHO)',
      'Asam karboksilat dengan gugus karboksil (–COOH)',
    ],
    correctIndex: 0,
    explanation:
      'Reaksi antara asam karboksilat dan alkohol disebut reaksi esterifikasi Fischer. Hasilnya adalah senyawa ester (etil etanoat) yang memiliki gugus fungsi –COO– (karboalkoksi/ester) serta memiliki karakteristik aroma harum buah-buahan.',
    reasoningLevel: 'Pemahaman',
    difficulty: 'Dasar',
  },

  // 5. Keisomeran
  {
    id: 'q-isomer-kerangka',
    category: 'Isomer',
    stimulus:
      'Senyawa hidrokarbon butana (n-butana) dan 2-metilpropana (isobutana) sama-sama memiliki rumus molekul C₄H₁₀. Titik didih n-butana adalah -0.5 °C sedangkan isobutana adalah -11.7 °C.',
    question:
      'Mengapa titik didih n-butana lebih tinggi dibandingkan isobutana meskipun keduanya merupakan isomer?',
    options: [
      'n-Butana berbentuk rantai lurus sehingga memiliki luas permukaan kontak antarmolekul lebih besar, menyebabkan gaya Van der Waals lebih kuat',
      'n-Butana memiliki ikatan hidrogen antarmolekul sedangkan isobutana tidak',
      'Isobutana memiliki massa molekul (Mr) yang lebih kecil daripada n-butana',
      'Ikatan kovalen C–C pada isobutana lebih mudah terputus saat dipanaskan',
    ],
    correctIndex: 0,
    explanation:
      'Kedua molekul memiliki massa molar sama (Mr = 58 g/mol). Molekul n-butana yang memanjang memiliki luas bidang singgung kontak antarmolekul lebih lebar dibanding isobutana yang berbentuk membulat/bercabang rapat. Akibatnya, gaya dispersi London (Van der Waals) pada n-butana lebih kokoh dan memerlukan energi termal lebih besar untuk mendidih.',
    reasoningLevel: 'Analisis',
    difficulty: 'Menengah',
  },
  {
    id: 'q-isomer-posisi',
    category: 'Isomer',
    question:
      'Pasangan senyawa manakah di bawah ini yang merupakan contoh dari isomer posisi?',
    options: [
      '1-propanol (CH₃–CH₂–CH₂–OH) dan 2-propanol (CH₃–CH(OH)–CH₃)',
      'Etanol (CH₃–CH₂–OH) dan Dimetil eter (CH₃–O–CH₃)',
      'n-pentana dan 2-metilbutana',
      'Propena dan Siklopropana',
    ],
    correctIndex: 0,
    explanation:
      'Isomer posisi adalah senyawa dengan rumus molekul dan kerangka rantai karbon induk yang sama, namun letak/posisi ikatan rangkap atau gugus fungsinya berbeda. Pada 1-propanol dan 2-propanol, gugus –OH berpindah dari atom C nomor 1 ke atom C nomor 2 pada rantai 3 karbon yang sama.',
    reasoningLevel: 'Pemahaman',
    difficulty: 'Dasar',
  },

  // 6. Analisis Sifat dan Reaksi
  {
    id: 'q-titik-didih-etanol-eter',
    category: 'Analisis Sifat & Reaksi',
    stimulus:
      'Diberikan dua senyawa berisomer dengan rumus molekul identik (C₂H₆O): Etanol (CH₃–CH₂–OH) mendidih pada suhu 78.4 °C, sedangkan Dimetil Eter (CH₃–O–CH₃) mendidih pada -24.0 °C pada tekanan 1 atm.',
    question:
      'Berdasarkan konsep ikatan kimia, mengapa perbedaan titik didih keduanya begitu ekstrem (>100 °C)?',
    options: [
      'Molekul etanol membentuk ikatan hidrogen antarmolekul melalui gugus –O–H, sedangkan dimetil eter hanya memiliki gaya tarik dipol-dipol yang jauh lebih lemah',
      'Etanol memiliki ikatan kovalen C–C yang jauh lebih kuat daripada ikatan C–O pada eter',
      'Dimetil eter mudah terbakar spontan di udara sehingga menguap lebih cepat',
      'Massa molekul relatif etanol lebih besar daripada dimetil eter',
    ],
    correctIndex: 0,
    explanation:
      'Pada etanol, hidrogen terikat langsung pada oksigen yang sangat elektronegatif (ikatan O–H polar), memungkinkan terbentuknya ikatan hidrogen antarmolekul yang membutuhkan energi sangat besar untuk diputus. Pada dimetil eter, oksigen diapit oleh atom C sehingga tidak memiliki ikatan O–H; antarsesama molekul eter hanya terjadi gaya dipol-dipol lemah.',
    reasoningLevel: 'Analisis',
    difficulty: 'HOTS',
  },
  {
    id: 'q-uji-bromin',
    category: 'Analisis Sifat & Reaksi',
    stimulus:
      'Dua tabung reaksi tanpa label diuji dengan meneteskan air bromin (Br₂, larutan berwarna cokelat kemerahan). Tabung 1 (heksena) menyebabkan warna cokelat langsung hilang seketika tanpa perlu pemanasan, sedangkan Tabung 2 (heksana) warnanya tetap cokelat.',
    question:
      'Prinsip reaksi kimia organik apa yang mendasari hasil uji ketidakjenuhan tersebut?',
    options: [
      'Alkena pada tabung 1 mengalami reaksi adisi cepat pada ikatan rangkap dua (C=C) mengikat Br₂ menjadi 1,2-dibromoheksana yang tak berwarna',
      'Heksena mengalami reaksi pembakaran sempurna dengan bromin membentuk gas CO₂',
      'Heksana pada tabung 2 tidak berwarna karena telah mengikat seluruh atom bromin',
      'Reaksi pada tabung 1 adalah reaksi eliminasi yang melepaskan gas hidrogen',
    ],
    correctIndex: 0,
    explanation:
      'Alkena adalah hidrokarbon tak jenuh yang memiliki ikatan pi (π) pada ikatan rangkap dua C=C. Ikatan ini mudah diserang oleh halogen seperti Br₂ melalui reaksi adisi elektrofilik membentuk haloalkana jenuh tak berwarna. Alkana jenuh tidak mengalami adisi karena hanya memiliki ikatan tunggal sigma (σ) yang stabil.',
    reasoningLevel: 'Penalaran Induktif',
    difficulty: 'Menengah',
  },

  // 7. Penalaran Kimia & Evaluasi
  {
    id: 'q-evaluasi-klaim-oksigen',
    category: 'Penalaran Kimia',
    stimulus:
      'Seorang siswa membuat hipotesis: "Setiap senyawa organik yang memiliki atom oksigen pasti memiliki titik didih yang jauh lebih tinggi daripada alkana dengan jumlah atom karbon yang sama."',
    question:
      'Bagaimana penilaian Anda terhadap hipotesis siswa tersebut berdasarkan data ilmiah?',
    options: [
      'Hipotesis SALAH, karena senyawa eter (seperti dimetil eter, C₂H₆O, Td = -24°C) memiliki titik didih yang mendekati alkana (propana, C₃H₈, Td = -42°C) karena sesama molekul eter tidak dapat membentuk ikatan hidrogen',
      'Hipotesis BENAR, karena semua atom oksigen mampu mendonorkan ikatan hidrogen kuat ke segala arah',
      'Hipotesis BENAR, karena keberadaan oksigen selalu melipatgandakan berat molekul senyawa',
      'Hipotesis SALAH, karena atom oksigen bersifat nonpolar dan selalu menurunkan titik didih',
    ],
    correctIndex: 0,
    explanation:
      'Klaim siswa tersebut merupakan overgeneralisasi yang keliru. Oksigen hanya menaikkan titik didih secara signifikan jika membentuk gugus yang memiliki ikatan hidrogen antarmolekul (seperti –OH pada alkohol atau asam karboksilat). Pada eter (R–O–R\'), tidak ada atom H yang terikat langsung pada O, sehingga tidak ada ikatan hidrogen sesama molekul eter; titik didihnya hanya sedikit lebih tinggi dari alkana.',
    reasoningLevel: 'Evaluasi',
    difficulty: 'HOTS',
  },
  {
    id: 'q-stoikiometri-pembakaran',
    category: 'Penalaran Kimia',
    stimulus:
      'Gas propana (C₃H₈) dibakar di ruang tertutup. Jika pasokan gas oksigen berlimpah, persamaan reaksinya adalah: C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(g). Namun jika pasokan oksigen tidak mencukupi, terbentuk gas beracun karbon monoksida (CO) dan partikel jelaga karbon (C).',
    question:
      'Mengapa pembakaran hidrokarbon pada kondisi defisiensi oksigen sangat berbahaya bagi kesehatan manusia?',
    options: [
      'Gas CO yang terbentuk memiliki afinitas pengikatan hemoglobin darah sekitar 200–250 kali lebih kuat daripada oksigen, menghambat transportasi O₂ ke seluruh jaringan tubuh',
      'Gas CO bereaksi dengan air di udara menghasilkan asam sulfat pekat yang korosif',
      'Pembakaran tidak sempurna menyerap seluruh energi tubuh manusia secara eksotermik',
      'Jelaga karbon mengubah gas oksigen di ruangan menjadi gas klorin beracun',
    ],
    correctIndex: 0,
    explanation:
      'Gas karbon monoksida (CO) tidak berbau dan tidak berwarna. Ketika terhirup, CO berikatan dengan hemoglobin membentuk karboksihemoglobin (COHb). Karena ikatan CO-Hb 200–250 kali lebih kuat dibanding O₂-Hb, darah kehilangan kapasitas menghantarkan oksigen ke otak dan jantung, memicu asfiksia hipoksia dan kematian.',
    reasoningLevel: 'Evaluasi',
    difficulty: 'HOTS',
  },
]
