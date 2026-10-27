import type { QuizQuestion } from '../types/chemistry'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-home-teaser',
    category: 'Hubungan Struktur & Sifat',
    stimulus:
      'Diberikan dua senyawa dengan rumus molekul sama (C₂H₆O): Etanol (CH₃–CH₂–OH) memiliki titik didih 78.4 °C, sedangkan Dimetil Eter (CH₃–O–CH₃) memiliki titik didih -24 °C pada tekanan 1 atm.',
    question:
      'Berdasarkan data stimulus di atas, mengapa titik didih etanol jauh lebih tinggi dibandingkan dimetil eter meskipun keduanya memiliki massa molar (Mr = 46 g/mol) yang sama?',
    options: [
      'Etanol memiliki ikatan kovalen polar lebih kuat pada rantai C–C daripada dimetil eter',
      'Molekul etanol dapat membentuk ikatan hidrogen antarmolekul melalui gugus –OH, sedangkan dimetil eter tidak',
      'Dimetil eter memiliki ikatan rangkap dua yang mudah putus pada suhu rendah',
      'Massa jenis etanol lebih besar karena memiliki atom hidrogen yang lebih banyak',
    ],
    correctIndex: 1,
    explanation:
      'Etanol memiliki gugus hidroksil (–OH) yang hidrogennya terikat langsung pada atom oksigen yang sangat elektronegatif. Hal ini memungkinkan terjadinya ikatan hidrogen antarmolekul yang sangat kuat. Sebaliknya, pada dimetil eter atom H terikat pada C (C–H), sehingga antarmolekulnya hanya terdapat gaya tarik dipol-dipol yang jauh lebih lemah dari ikatan hidrogen.',
    reasoningLevel: 'Analisis',
    difficulty: 'Menengah',
  },
  {
    id: 'q-valensi',
    category: 'Konsep Dasar Atom Karbon',
    question:
      'Atom karbon memiliki nomor atom 6 dengan konfigurasi elektron [He] 2s² 2p². Apa implikasi langsung dari konfigurasi ini terhadap pembentukan senyawa organik?',
    options: [
      'Karbon cenderung melepaskan 4 elektron membentuk kation C⁴⁺ stabil',
      'Karbon cenderung menangkap 4 elektron dari logam membentuk anion C⁴⁻',
      'Karbon memiliki 4 elektron valensi dan mampu membentuk 4 ikatan kovalen bersama atom lain (tetravalensi)',
      'Karbon hanya dapat membentuk ikatan ionik dengan atom non-logam seperti hidrogen',
    ],
    correctIndex: 2,
    explanation:
      'Energi ionisasi untuk melepas 4 elektron (membentuk C⁴⁺) atau afinitas untuk menangkap 4 elektron (membentuk C⁴⁻) terlampau besar. Oleh karena itu, karbon mencapai kestabilan oktet dengan cara menggunakan pasangan elektron bersama (ikatan kovalen) sebanyak 4 buah (tetravalen).',
    reasoningLevel: 'Pemahaman',
    difficulty: 'Dasar',
  },
  {
    id: 'q-tata-nama',
    category: 'Tata Nama IUPAC',
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
      'Langkah penamaan IUPAC: (1) Rantai induk terpanjang yang mengandung ikatan rangkap memiliki 5 atom C (pentena). (2) Penomoran dimulai dari ujung terdekat dengan ikatan rangkap dua, sehingga C1 adalah =CH₂ dan C2 adalah –CH=. (3) Cabang metil (–CH₃) terletak pada atom C nomor 4. Jadi, namanya adalah 4-metil-1-pentena.',
    reasoningLevel: 'Penerapan',
    difficulty: 'Menengah',
  },
  {
    id: 'q-ketidakjenuhan',
    category: 'Sifat & Reaksi Kimia',
    stimulus:
      'Di laboratorium, dua tabung reaksi berisi zat cair tak berwarna A (heksana) dan B (heksena). Ketika beberapa tetes air bromin (Br₂ berwarna cokelat kemerahan) ditambahkan ke dalam kedua tabung tanpa katalis:',
    question:
      'Manakah pengamatan dan kesimpulan ilmiah yang tepat mengenai sifat ikatan pada senyawa tersebut?',
    options: [
      'Tabung A segera memudar karena heksana mengalami reaksi adisi cepat',
      'Tabung B segera memudar karena ikatan rangkap dua pada heksena mengalami reaksi adisi mengikat Br₂',
      'Kedua tabung tidak mengalami perubahan warna karena hidrokarbon bersifat inert',
      'Tabung B menghasilkan endapan putih karena terjadi reaksi pembakaran spontan',
    ],
    correctIndex: 1,
    explanation:
      'Heksena adalah alkena (hidrokarbon tak jenuh dengan ikatan C=C). Ikatan rangkap pi (π) pada alkena mudah diserang oleh halogen seperti bromin melalui reaksi adisi elektrofilik, menghasilkan 1,2-dibromoheksana yang tak berwarna sehingga warna cokelat Br₂ cepat hilang. Heksana (alkana jenuh) tidak bereaksi dengan Br₂ pada suhu kamar tanpa sinar UV.',
    reasoningLevel: 'Penalaran Induktif',
    difficulty: 'HOTS',
  },
  {
    id: 'q-isomer-struktur',
    category: 'Keisomeran',
    question:
      'Senyawa dengan rumus molekul C₄H₁₀ memiliki dua isomer rantai, yaitu n-butana dan 2-metilpropana (isobutana). Manakah pernyataan berikut yang BENAR mengenai perbedaan titik didih keduanya?',
    options: [
      '2-metilpropana memiliki titik didih lebih tinggi karena memiliki cabang yang lebih rapat',
      'n-butana memiliki titik didih lebih tinggi karena rantai lurus memiliki luas permukaan kontak antarmolekul yang lebih besar',
      'Keduanya memiliki titik didih persis sama karena massa molekul relatif (Mr)-nya identik',
      'n-butana memiliki titik didih lebih rendah karena ikatan C–C rantai lurus lebih mudah terputus',
    ],
    correctIndex: 1,
    explanation:
      'n-Butana berbentuk rantai lurus sehingga memiliki luas permukaan kontak antarmolekul yang lebih besar dibanding 2-metilpropana yang berbentuk membulat (kompak). Akibatnya, gaya tarik Van der Waals (gaya dispersi London) antarmolekul n-butana lebih kuat, menuntut energi panas lebih tinggi untuk mendidih (n-butana: -0.5 °C, isobutana: -11.7 °C).',
    reasoningLevel: 'Analisis',
    difficulty: 'Menengah',
  },
  {
    id: 'q-evaluasi-klaim',
    category: 'Evaluasi & Penalaran Ilmiah',
    stimulus:
      'Seorang siswa membuat klaim: "Semua senyawa yang mengandung gugus oksigen selalu memiliki titik didih lebih tinggi daripada hidrokarbon dengan massa molar serupa."',
    question:
      'Berdasarkan bukti ilmiah konsep kimia organik, bagaimana evaluasi Anda terhadap klaim siswa tersebut?',
    options: [
      'Klaim BENAR, karena keberadaan atom oksigen selalu menghasilkan ikatan hidrogen yang sangat kuat',
      'Klaim SALAH, karena senyawa eter seperti dimetil eter (Mr=46) memiliki titik didih (-24°C) yang tidak jauh berbeda dari propana (Mr=44, -42°C) karena eter tidak dapat membentuk ikatan hidrogen sesamanya',
      'Klaim BENAR, karena oksigen membuat senyawa menjadi bermuatan ionik sehingga sulit menguap',
      'Klaim SALAH, karena atom oksigen menurunkan berat molekul suatu zat sehingga selalu menurunkan titik didih',
    ],
    correctIndex: 1,
    explanation:
      'Klaim siswa tersebut salah (overgeneralisasi). Gugus oksigen hanya menghasilkan ikatan hidrogen antarmolekul jika atom H terikat langsung pada atom O (seperti pada alkohol dan asam karboksilat). Pada eter (R–O–R\'), atom O terikat pada C, sehingga sesama molekul eter tidak memiliki ikatan hidrogen. Gaya tarik dipol-dipol pada eter relatif lemah, sehingga titik didihnya jauh lebih dekat ke alkana dibanding ke alkohol dengan Mr setara.',
    reasoningLevel: 'Evaluasi',
    difficulty: 'HOTS',
  },
]
