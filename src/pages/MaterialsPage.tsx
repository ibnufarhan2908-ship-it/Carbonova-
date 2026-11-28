import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  Atom,
  Lock,
} from 'lucide-react'
import { LESSON_MODULES } from '../data/lessons'
import { LESSON_DETAILS } from '../data/lessonDetails'
import LessonDetailView from '../components/materials/LessonDetailView'
import { formatChemicalText } from '../components/ChemicalFormula'
import { useAuth } from '../context/AuthContext'
import { markModuleStudied, getStudentProgress } from '../services/db'
import { isModuleFree } from '../utils/freemium'
import LoginRequiredModal from '../components/auth/LoginRequiredModal'

export default function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeModuleSlug = searchParams.get('modul') || ''
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false)
  const [selectedLockedSlug, setSelectedLockedSlug] = useState<string | null>(null)
  const [_freemiumUpdate, setFreemiumUpdate] = useState(0)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleFreemiumChange = () => setFreemiumUpdate((v) => v + 1)
    window.addEventListener('carbonova:freemium_changed', handleFreemiumChange)
    return () => window.removeEventListener('carbonova:freemium_changed', handleFreemiumChange)
  }, [])

  const currentUserId = user ? user.id : 'guest'
  const studiedSlugs = new Set(getStudentProgress(currentUserId).map((p) => p.moduleSlug))

  useEffect(() => {
    if (activeModuleSlug) {
      markModuleStudied(currentUserId, activeModuleSlug)
    }
  }, [activeModuleSlug, currentUserId])

  const categories = [
    'Semua',
    'Konsep Dasar',
    'Golongan Utama',
    'Nomenklatur Kimia',
    'Turunan Alkana',
    'Struktur Molekul',
    'Reaktivitas Kimia',
  ]

  const handleSelectModule = (slug: string) => {
    const free = isModuleFree(slug)
    if (!isAuthenticated && !free) {
      setSelectedLockedSlug(slug)
      setIsLoginRequiredOpen(true)
      return
    }
    setSearchParams({ modul: slug })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToCatalog = () => {
    setSearchParams({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // If a module is active, check freemium access for guest
  if (activeModuleSlug && LESSON_DETAILS[activeModuleSlug]) {
    const isFreeAccess = isModuleFree(activeModuleSlug)

    if (!isAuthenticated && !isFreeAccess) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#101C3A]">Login untuk membuka materi ini</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Materi pembelajaran ini bersifat premium. Silakan masuk atau daftar akun terlebih dahulu untuk membaca silabus dan penjelasan lengkap.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleBackToCatalog}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Kembali ke Silabus
            </button>
            <Link
              to="/login"
              state={{
                from: `/materi?modul=${activeModuleSlug}`,
                message: 'Login untuk membuka materi ini',
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Login / Daftar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )
    }

    const activeLesson = LESSON_DETAILS[activeModuleSlug]
    const allSlugs = LESSON_MODULES.map((m) => m.slug)
    const currentIndex = allSlugs.indexOf(activeModuleSlug)
    const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : undefined
    const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : undefined

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LessonDetailView
          lesson={activeLesson}
          onBack={handleBackToCatalog}
          onSelectModule={handleSelectModule}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
        />
      </div>
    )
  }

  const filteredModules = LESSON_MODULES.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'Semua' || module.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Katalog Materi Senyawa Karbon
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
          Silabus & Modul Pembelajaran
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pelajari materi senyawa karbon mulai dari dasar pembentukan ikatan kovalen, tata nama IUPAC,
          hingga reaksi organik dan identifikasi gugus fungsi secara terstruktur.
        </p>
      </div>

      {/* Guest Mode Notification Banner */}
      {!user && (
        <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
            <span>
              <strong>Mode Tamu:</strong> Modul yang Anda pelajari otomatis ditandai dan disimpan di peramban ini (localStorage).
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1 font-bold text-teal-800 hover:text-teal-950 underline shrink-0"
          >
            Login / Daftar Akun
          </Link>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi (misal: alkana, eter, isomer, tata nama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-[#101C3A] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          // Hanya cek freemium untuk GUEST (belum login)
          const isGuest = !isAuthenticated
          const free = isModuleFree(module)
          const isLocked = isGuest && !free // Terkunci hanya jika guest DAN bukan modul gratis

          // Status progres hanya untuk user yang sudah login
          const isStudied = isAuthenticated && studiedSlugs.has(module.slug)

          return (
            <div
              key={module.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                isLocked
                  ? 'border-amber-200/80 hover:border-amber-300'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Badge Nomor Modul */}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 inline-flex items-center gap-1">
                      <Atom className="w-3 h-3 text-[#1DAA9A]" />
                      Modul {module.moduleNumber}
                    </span>

                    {/* Badge Freemium — HANYA tampil untuk GUEST */}
                    {isGuest && (
                      free ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 inline-flex items-center gap-1">
                          Gratis
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          Terkunci
                        </span>
                      )
                    )}

                    {/* Badge Status Progres — HANYA tampil untuk user LOGIN */}
                    {isAuthenticated && (
                      isStudied ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Selesai
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60 inline-flex items-center gap-1">
                          Belum
                        </span>
                      )
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {module.estimatedMinutes} Menit
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-[#101C3A]">
                    {formatChemicalText(module.title)}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {formatChemicalText(module.subtitle)}
                  </p>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed">
                  {formatChemicalText(module.description)}
                </div>

                {/* Topics List */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cakupan Bahasan:
                  </span>
                  <ul className="space-y-1.5">
                    {module.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1DAA9A] mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{formatChemicalText(t)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {module.keyFormula ? formatChemicalText(module.keyFormula) : ''}
                </span>
                {/* Tombol TERKUNCI — hanya untuk guest pada modul tidak gratis */}
                {isLocked ? (
                  <button
                    type="button"
                    onClick={() => handleSelectModule(module.slug)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Login untuk Membuka</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectModule(module.slug)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Pelajari Materi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Akses Materi Terkunci untuk Tamu */}
      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        title="Login untuk membuka materi ini"
        message="Login untuk membuka materi ini. Silakan masuk atau daftar akun terlebih dahulu untuk mengakses seluruh modul pembelajaran kimia karbon secara lengkap."
        buttonText="Login / Daftar"
        redirectPath={selectedLockedSlug ? `/materi?modul=${selectedLockedSlug}` : '/materi'}
      />
    </div>
  )
}
