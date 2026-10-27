import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Atom,
  CheckCircle2,
  Layers,
  Flame,
  FileText,
  GitBranch,
  ChevronRight,
} from 'lucide-react'
import HeroMoleculeVisual from '../components/home/HeroMoleculeVisual'
import MoleculeViewer2D from '../components/molecules/MoleculeViewer2D'
import { MOLECULES_DATA } from '../data/molecules'
import { LESSON_MODULES, LEARNING_OBJECTIVES } from '../data/lessons'
import { QUIZ_QUESTIONS } from '../data/questions'

export default function HomePage() {
  // State for Featured Molecules section
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('etanol')
  const activeMolecule =
    MOLECULES_DATA.find((m) => m.id === selectedMoleculeId) || MOLECULES_DATA[0]

  // State for Interactive Quiz Teaser
  const teaserQuestion = QUIZ_QUESTIONS[0]
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)

  const handleOptionSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index)
    }
  }

  const handleQuizSubmit = () => {
    if (selectedOption !== null) {
      setIsAnswerSubmitted(true)
    }
  }

  const handleQuizReset = () => {
    setSelectedOption(null)
    setIsAnswerSubmitted(false)
  }

  // Icon mapping for module cards
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-5 h-5 text-teal-600" />
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-600" />
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-600" />
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-emerald-600" />
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-600" />
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />
    }
  }

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 pb-8 overflow-hidden">
        {/* Soft geometric background patterns */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge Kurikulum */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-[#1DAA9A]" />
                <span className="text-xs font-semibold text-slate-700">
                  Pembelajaran Kimia SMA/MA Berbasis Bukti
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#101C3A] leading-[1.12]">
                Discover the <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#101C3A] via-[#1DAA9A] to-[#15887B] bg-clip-text text-transparent">
                  Chemistry of Carbon
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Jelajahi struktur, sifat, dan reaktivitas senyawa karbon melalui pengalaman belajar
                kimia yang interaktif. Pahami hubungan atom, ikatan kovalen, dan tata nama tanpa sekadar menghafal.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/materi"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#5DE0E6]" />
                  <span>Mulai Eksplorasi</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/molekul"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#101C3A] border border-slate-300/80 text-sm font-bold shadow-2xs hover:shadow-xs transition-all"
                >
                  <Compass className="w-4 h-4 text-[#1DAA9A]" />
                  <span>Jelajahi Molekul</span>
                </Link>
              </div>

              {/* Quick Scientific Stats / Highlights */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#101C3A]">4 Ikatan</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Kovalen Tetravalen
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#1DAA9A]">6 Modul</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Materi Terstruktur
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#101C3A]">3 Eksperimen</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Lab Virtual Interaktif
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5">
              <HeroMoleculeVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PENGENALAN SINGKAT SENYAWA KARBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
              <Atom className="w-3.5 h-3.5 text-[#1DAA9A]" />
              Kekhasan Atom Karbon
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Mengapa Karbon Menjadi Tulang Punggung Kehidupan?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dari jutaan jenis senyawa di alam semesta, lebih dari 90% di antaranya merupakan senyawa karbon.
              Atom karbon memiliki konfigurasi unik [He] 2s² 2p² yang memungkinkannya membentuk ikatan yang sangat variatif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center font-bold text-teal-800 text-sm">
                4
              </div>
              <h3 className="font-bold text-[#101C3A] text-sm">Tetravalensi Karbon</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Memiliki 4 elektron valensi yang selalu dipakai bersama untuk membentuk 4 ikatan kovalen yang stabil.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-800 text-sm">
                C-C
              </div>
              <h3 className="font-bold text-[#101C3A] text-sm">Kemampuan Katenasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Atom karbon dapat berikatan kuat dengan sesama atom karbon membentuk rantai panjang tanpa batas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center font-bold text-purple-800 text-sm">
                ≈
              </div>
              <h3 className="font-bold text-[#101C3A] text-sm">Variasi Bentuk Rantai</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membentuk rantai lurus (alifatik), bercabang, maupun cincin tertutup (siklik & aromatik).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-sm">
                ≡
              </div>
              <h3 className="font-bold text-[#101C3A] text-sm">Tiga Jenis Ikatan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mampu membentuk ikatan tunggal (C–C), ikatan rangkap dua (C=C), dan ikatan rangkap tiga (C≡C).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KARTU KATEGORI MATERI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
              Kurikulum Senyawa Karbon
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Modul Pembelajaran Terstruktur
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Disusun secara hierarkis mulai dari konsep dasar ikatan hingga reaksi kimia dan keisomeran.
            </p>
          </div>

          <Link
            to="/materi"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1DAA9A] hover:text-[#15887B] transition-colors"
          >
            <span>Lihat Semua Silabus</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LESSON_MODULES.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getModuleIcon(module.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Modul {module.moduleNumber}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#101C3A] group-hover:text-[#1DAA9A] transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {module.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {module.description}
                </p>

                {/* Topics preview */}
                <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                  {module.topics.slice(0, 3).map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DAA9A] mt-1 shrink-0" />
                      <span className="line-clamp-1">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {module.estimatedMinutes} Menit Belajar
                </span>
                <Link
                  to={`/materi?modul=${module.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#101C3A] group-hover:text-[#1DAA9A] transition-colors"
                >
                  <span>Buka Materi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED MOLECULES EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
              Molecule Explorer Teaser
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Koleksi Molekul Pilihan
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Pilih molekul untuk melihat geometri ikatan, rumus struktur, dan aplikasinya di kehidupan nyata.
            </p>
          </div>

          <Link
            to="/molekul"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
          >
            <Compass className="w-4 h-4 text-[#1DAA9A]" />
            <span>Katalog Lengkap (12 Molekul)</span>
          </Link>
        </div>

        {/* Molecule Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOLECULES_DATA.filter((m) => m.isFeatured).map((mol) => (
            <button
              key={mol.id}
              onClick={() => setSelectedMoleculeId(mol.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMoleculeId === mol.id
                  ? 'bg-[#101C3A] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{mol.name}</span>
              <span className="ml-1.5 opacity-70 font-mono text-[11px]">({mol.formula})</span>
            </button>
          ))}
        </div>

        {/* Interactive Molecule Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          {/* Left: 2D Interactive Molecular Viewer */}
          <div className="lg:col-span-7">
            <MoleculeViewer2D molecule={activeMolecule} height={340} />
          </div>

          {/* Right: Molecule Details & IUPAC Information */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {activeMolecule.category}
                </span>
                {activeMolecule.functionalGroup && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {activeMolecule.functionalGroup}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-[#101C3A]">{activeMolecule.name}</h3>
              <p className="text-xs font-mono text-slate-500">IUPAC: {activeMolecule.iupacName}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeMolecule.description}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Rumus Terkondensasi:</span>
                <span className="font-mono font-bold text-slate-800">{activeMolecule.condensedFormula}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Titik Didih:</span>
                <span className="font-semibold text-slate-800">{activeMolecule.boilingPoint}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Wujud Suhu Ruang:</span>
                <span className="font-semibold text-slate-800">{activeMolecule.stateAtRoomTemp}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Aplikasi / Manfaat:</span>
                <p className="text-slate-700 text-xs leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{activeMolecule.dailyUses}"
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/molekul?id=${activeMolecule.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Compass className="w-4 h-4 text-[#5DE0E6]" />
                <span>Buka Detail di Molecule Explorer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BAGIAN CARBON LAB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#101C3A] via-[#142347] to-[#0A1124] text-white p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-4 mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-[#5DE0E6] text-xs font-semibold border border-teal-500/30">
              <FlaskConical className="w-3.5 h-3.5" />
              Laboratorium Digital
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Eksperimen Virtual di Carbon Lab
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Lakukan simulasi perakitan molekul, reaksi pembakaran hidrokarbon, dan uji ketidakjenuhan ikatan secara aman di laboratorium digital interaktif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Experiment 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4 hover:border-teal-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[#5DE0E6]">
                <Atom className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Structure Builder</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rakit atom C, H, dan O dengan validasi valensi otomatis untuk menguji apakah struktur molekul stabil menurut kaidah kimia.
              </p>
              <Link
                to="/lab?tab=builder"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5DE0E6] hover:underline pt-2"
              >
                <span>Mulai Merakit Molekul</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Experiment 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4 hover:border-teal-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Simulasi Pembakaran</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bandingkan pembakaran sempurna (CO₂ + H₂O) vs tidak sempurna (CO + jelaga) dengan penyetaraan reaksi stoikiometri otomatis.
              </p>
              <Link
                to="/lab?tab=combustion"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline pt-2"
              >
                <span>Uji Reaksi Pembakaran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Experiment 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4 hover:border-teal-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Uji Ketidakjenuhan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simulasi penambahan air bromin (Br₂) pada alkana vs alkena untuk membuktikan reaksi adisi pada ikatan rangkap dua.
              </p>
              <Link
                to="/lab?tab=unsaturation"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline pt-2"
              >
                <span>Simulasi Uji Bromin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREVIEW LATIHAN SOAL (INTERACTIVE TEASER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
              Uji Penalaran Kimia HOTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Latihan Soal Berbasis Analisis
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Uji pemahaman konsep Anda secara langsung. Coba jawab soal stimulus penalaran di bawah ini:
            </p>
          </div>

          <Link
            to="/latihan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-xs font-bold text-white transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-[#5DE0E6]" />
            <span>Bank Soal Lengkap</span>
          </Link>
        </div>

        {/* Live Interactive Question Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
                Level: {teaserQuestion.reasoningLevel}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Topik: {teaserQuestion.category}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Tingkat: {teaserQuestion.difficulty}</span>
          </div>

          {/* Stimulus Box */}
          {teaserQuestion.stimulus && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <span className="font-bold text-teal-800 block mb-1">Stimulus Analisis:</span>
              {teaserQuestion.stimulus}
            </div>
          )}

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-bold text-[#101C3A] leading-snug">
            {teaserQuestion.question}
          </h4>

          {/* Options List */}
          <div className="space-y-3">
            {teaserQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = isAnswerSubmitted && idx === teaserQuestion.correctIndex
              const isWrong = isAnswerSubmitted && isSelected && idx !== teaserQuestion.correctIndex

              let optionClasses =
                'border-slate-200 hover:border-slate-300 bg-white text-slate-700'

              if (isSelected && !isAnswerSubmitted) {
                optionClasses = 'border-[#1DAA9A] bg-teal-50/50 text-[#101C3A] ring-1 ring-[#1DAA9A]'
              } else if (isCorrect) {
                optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
              } else if (isWrong) {
                optionClasses = 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${optionClasses}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                          ? 'bg-rose-600 text-white'
                          : isSelected
                            ? 'bg-[#1DAA9A] text-white'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{option}</span>
                </button>
              )
            })}
          </div>

          {/* Action Button & Feedback */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedOption === null}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedOption !== null
                    ? 'bg-[#101C3A] hover:bg-[#182852] text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleQuizReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                Coba Jawab Lagi
              </button>
            )}

            <span className="text-xs text-slate-500">
              {isAnswerSubmitted
                ? selectedOption === teaserQuestion.correctIndex
                  ? '🎉 Jawaban Anda Tepat!'
                  : '💡 Jawaban belum tepat, pelajari pembahasan di bawah.'
                : 'Pilih salah satu opsi lalu klik periksa jawaban.'}
            </span>
          </div>

          {/* Detailed Scientific Explanation when submitted */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-2 animate-in fade-in duration-300">
              <div className="font-bold flex items-center gap-2 text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pembahasan Ilmiah:</span>
              </div>
              <p className="leading-relaxed text-slate-700">{teaserQuestion.explanation}</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. RINGKASAN CAPAIAN PEMBELAJARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
            Tujuan Pembelajaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
            Target Capaian Belajar Kimia Karbon
          </h2>
          <p className="text-sm text-slate-600">
            Setelah menyelesaikan pembelajaran di Carbonova, siswa diharapkan mampu menguasai 8 kompetensi utama berikut:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEARNING_OBJECTIVES.map((obj) => (
            <div
              key={obj.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
                  {obj.code}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{obj.category}</span>
              </div>
              <h3 className="font-bold text-sm text-[#101C3A]">{obj.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{obj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#101C3A] via-[#16274E] to-[#1DAA9A] text-white p-8 sm:p-12 text-center sm:text-left sm:flex items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 mb-6 sm:mb-0">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Siap Menjelajahi Dunia Senyawa Karbon?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl">
              Mulai dari modul pertama tentang kekhasan atom karbon atau uji kemampuan Anda di laboratorium virtual.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/materi"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#101C3A] text-xs font-bold shadow-md hover:bg-slate-100 transition-all text-center"
            >
              Mulai Modul 1
            </Link>
            <Link
              to="/lab"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500/30 hover:bg-teal-500/40 border border-teal-400/40 text-white text-xs font-bold transition-all text-center"
            >
              Buka Carbon Lab
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
