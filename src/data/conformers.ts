export interface ConformerMolecule {
  id: string
  name: string
  iupacName: string
  formula: string
  condensedFormula: string
  molecularWeight: number
  category: string
  cid: number
  pubchemCompoundSlug: string
  pubchemUrl: string
  description: string
  parentChainExplanation: string
  numberingExplanation: string
  branchExplanation: string
  iupacRuleExplanation: string
  commonPitfall: string
  badgeText?: string
}

export const CONFORMER_MOLECULES: ConformerMolecule[] = [
  {
    id: '3-metil-1-pentena',
    name: '3-Metil-1-pentena',
    iupacName: '3-metil-1-pentena (3-methylpent-1-ene)',
    formula: 'C₆H₁₂',
    condensedFormula: 'CH₂=CH–CH(CH₃)–CH₂–CH₃',
    molecularWeight: 84.16,
    category: 'Alkena Bercabang',
    cid: 12969,
    pubchemCompoundSlug: '3-Methyl-1-pentene',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3-Methyl-1-pentene#section=3D-Conformer&fullscreen=true',
    description:
      'Alkena bercabang dengan ikatan rangkap dua C=C di ujung rantai dan satu cabang metil pada atom karbon C-3. Molekul ini merupakan model acuan utama dalam menguji pemahaman prioritas ikatan rangkap di atas gugus cabang.',
    parentChainExplanation:
      'Rantai terpanjang yang memuat ikatan rangkap dua (C=C) memiliki 5 atom karbon. Nama rantai induknya adalah "pentena". Rantai tidak boleh diambil tanpa melewati ikatan rangkap.',
    numberingExplanation:
      'Penomoran WAJIB dimulai dari ujung kiri yang paling dekat dengan ikatan rangkap dua (=CH₂ sebagai C-1, –CH= sebagai C-2). Posisi ikatan rangkap adalah nomor 1 (1-pentena).',
    branchExplanation:
      'Gugus cabang metil (–CH₃) terikat pada atom C nomor 3 dari rantai induk pentena.',
    iupacRuleExplanation:
      'Gabungkan [Nomor Cabang]-[Nama Cabang][Nomor Ikatan Rangkap]-[Rantai Induk] → 3-metil-1-pentena.',
    commonPitfall:
      '❌ Menamainya "3-metil-4-pentena" karena menghitung dari kanan demi cabang; atau "2-etil-1-butena" padahal ada rantai 5 karbon yang lebih panjang memuat ikatan rangkap.',
    badgeText: 'Struktur PubChem Request',
  },
  {
    id: '2-metilbutana',
    name: '2-Metilbutana',
    iupacName: '2-metilbutana (2-methylbutane / isopentana)',
    formula: 'C₅H₁₂',
    condensedFormula: 'CH₃–CH(CH₃)–CH₂–CH₃',
    molecularWeight: 72.15,
    category: 'Alkana Bercabang Tunggal',
    cid: 6556,
    pubchemCompoundSlug: '6556',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6556#section=3D-Conformer&fullscreen=true',
    description:
      'Isomer rantai dari pentana dengan satu cabang metil. Senyawa hidrokarbon jenuh yang menjadi contoh dasar aturan penomoran cabang alkana terendah.',
    parentChainExplanation:
      'Rantai karbon kontinu terpanjang terdiri dari 4 atom karbon, sehingga rantai induknya adalah "butana".',
    numberingExplanation:
      'Penomoran dimulai dari ujung kiri agar cabang metil memperoleh nomor serendah mungkin (C-2). Jika dihitung dari kanan cabang akan berada di C-3 (keliru).',
    branchExplanation:
      'Terdapat satu gugus alkil metil (–CH₃) yang terikat pada atom C-2.',
    iupacRuleExplanation:
      'Format [Nomor Cabang]-[Nama Cabang][Rantai Induk] → 2-metilbutana.',
    commonPitfall:
      '❌ Menamainya "3-metilbutana" karena memulai penomoran dari sisi kanan. Aturan IUPAC mensyaratkan lokan nomor cabang sekecil mungkin.',
    badgeText: 'Alkana Cabang Tunggal',
  },
  {
    id: '2-2-dimetilpropana',
    name: '2,2-Dimetilpropana',
    iupacName: '2,2-dimetilpropana (neopentana)',
    formula: 'C₅H₁₂',
    condensedFormula: 'CH₃–C(CH₃)₂–CH₃ atau C(CH₃)₄',
    molecularWeight: 72.15,
    category: 'Alkana Cabang Ganda (Geminal)',
    cid: 10041,
    pubchemCompoundSlug: '10041',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10041#section=3D-Conformer&fullscreen=true',
    description:
      'Isomer pentana dengan struktur simetris tetrahedral sempurna di mana atom karbon pusat mengikat empat gugus metil.',
    parentChainExplanation:
      'Rantai lurus terpanjang hanya memuat 3 atom karbon, sehingga rantai induknya adalah "propana".',
    numberingExplanation:
      'Penomoran dari ujung manapun menghasilkan karbon cabang tepat berada di posisi tengah C-2.',
    branchExplanation:
      'Terdapat DUA cabang metil pada atom karbon yang SAMA (C-2). Gunakan awalan "di-" untuk menyatakan dua cabang identik.',
    iupacRuleExplanation:
      'Kedua nomor posisi wajib ditulis berulang dipisahkan koma: 2,2-dimetilpropana.',
    commonPitfall:
      '❌ Menulis "2-dimetilpropana" atau "dimetilpropana" saja. Aturan IUPAC mewajibkan penulisan nomor lokasi bagi SETIAP cabang secara terpisah (2,2-).',
    badgeText: 'Cabang Geminal (di-)',
  },
  {
    id: '2-3-dimetilbutana',
    name: '2,3-Dimetilbutana',
    iupacName: '2,3-dimetilbutana (2,3-dimethylbutane)',
    formula: 'C₆H₁₄',
    condensedFormula: 'CH₃–CH(CH₃)–CH(CH₃)–CH₃',
    molecularWeight: 86.18,
    category: 'Alkana Cabang Bersebelahan (Vicinal)',
    cid: 6589,
    pubchemCompoundSlug: '6589',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6589#section=3D-Conformer&fullscreen=true',
    description:
      'Isomer heksana yang memiliki dua cabang metil pada dua atom karbon tetangga di rantai induk butana.',
    parentChainExplanation:
      'Rantai lurus terpanjang memiliki 4 atom karbon, nama rantai induk adalah "butana".',
    numberingExplanation:
      'Karena struktur simetris, penomoran dari kiri maupun kanan menghasilkan lokasi cabang yang sama persis: posisi C-2 dan C-3.',
    branchExplanation:
      'Terdapat dua cabang metil yang masing-masing terletak di atom C-2 dan C-3.',
    iupacRuleExplanation:
      'Nomor posisi dipisahkan tanda koma dan diikuti awalan di-: 2,3-dimetilbutana.',
    commonPitfall:
      '❌ Tertukar dengan 2,2-dimetilbutana yang kedua cabangnya berada di atom karbon yang sama.',
    badgeText: 'Cabang Berdampingan',
  },
  {
    id: '3-etil-4-metilheksana',
    name: '3-Etil-4-metilheksana',
    iupacName: '3-etil-4-metilheksana (3-ethyl-4-methylhexane)',
    formula: 'C₉H₂₀',
    condensedFormula: 'CH₃–CH₂–CH(C₂H₅)–CH(CH₃)–CH₂–CH₃',
    molecularWeight: 128.26,
    category: 'Alkana Cabang Campuran Alfabetis',
    cid: 18314,
    pubchemCompoundSlug: '18314',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/18314#section=3D-Conformer&fullscreen=true',
    description:
      'Studi kasus rantai hidrokarbon dengan dua jenis cabang berbeda (etil dan metil). Menguji penerapan urutan alfabetis dalam penulisan nama IUPAC.',
    parentChainExplanation:
      'Rantai kontinu terpanjang adalah 6 atom karbon (heksana). Jangan terjebak menghitung hanya rantai lurus horizontal jika rantai belok lebih panjang.',
    numberingExplanation:
      'Penomoran dimulai dari ujung kiri memberikan nomor cabang 3 dan 4 (sama seperti jika dihitung dari kanan). Karena nomor setara, urutan abjad cabang etil diutamakan mendapat nomor lebih rendah jika ada pertimbangan lanjutan.',
    branchExplanation:
      'Gugus etil (–C₂H₅) di C-3 dan gugus metil (–CH₃) di C-4.',
    iupacRuleExplanation:
      'Cabang diurutkan secara ALFABETIS: "etil" ditulis mendahului "metil" (e mendahului m). Nama resmi: 3-etil-4-metilheksana.',
    commonPitfall:
      '❌ Menulis "4-metil-3-etilheksana". Urutan penulisan nama cabang WAJIB mengikuti alfabet, bukan urutan nomor posisi.',
    badgeText: 'Prioritas Alfabet',
  },
  {
    id: '2-butuna',
    name: '2-Butuna',
    iupacName: '2-butuna (but-2-yne)',
    formula: 'C₄H₆',
    condensedFormula: 'CH₃–C≡C–CH₃',
    molecularWeight: 54.09,
    category: 'Alkuna Ikatan Rangkap Tiga',
    cid: 10419,
    pubchemCompoundSlug: '10419',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10419#section=3D-Conformer&fullscreen=true',
    description:
      'Alkuna simetris internal dengan ikatan rangkap tiga C≡C yang memiliki sudut ikatan linier 180° akibat hibridisasi sp.',
    parentChainExplanation:
      'Rantai terpanjang memiliki 4 atom C dengan ikatan rangkap tiga: "butuna".',
    numberingExplanation:
      'Struktur simetris, sehingga ikatan rangkap tiga terletak pada posisi atom C-2 dari kedua arah.',
    branchExplanation:
      'Rantai lurus tanpa cabang alkil.',
    iupacRuleExplanation:
      'Tulis nomor posisi ikatan rangkap tiga sebelum nama induk: 2-butuna (atau but-2-una).',
    commonPitfall:
      '❌ Mengabaikan nomor posisi ikatan rangkap karena menganggap hanya ada satu jenis butuna (padahal ada isomer posisi 1-butuna).',
    badgeText: 'Alkuna Linier',
  },
  {
    id: '1-butena',
    name: '1-Butena',
    iupacName: '1-butena (but-1-ene)',
    formula: 'C₄H₈',
    condensedFormula: 'CH₂=CH–CH₂–CH₃',
    molecularWeight: 56.11,
    category: 'Alkena Terminal',
    cid: 7844,
    pubchemCompoundSlug: '7844',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/7844#section=3D-Conformer&fullscreen=true',
    description:
      'Alkena rantai terbuka dengan ikatan rangkap dua C=C di ujung (terminal). Gas yang mudah dicairkan dan digunakan dalam produksi polimer.',
    parentChainExplanation:
      'Rantai terpanjang terdiri atas 4 atom C memuat ikatan rangkap dua: "butena".',
    numberingExplanation:
      'Penomoran dimulai dari ujung ikatan rangkap (C-1 di =CH₂), sehingga ikatan rangkap berada di posisi 1.',
    branchExplanation:
      'Rantai lurus tanpa cabang alkil.',
    iupacRuleExplanation:
      'Nomor posisi ikatan rangkap dicantumkan di depan: 1-butena (atau but-1-ena).',
    commonPitfall:
      '❌ Menomori dari sisi kanan menjadi "3-butena". Ikatan rangkap dua harus selalu memperoleh nomor serendah mungkin.',
    badgeText: 'Alkena Terminal',
  },
]

