import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { LESSON_MODULES } from '../data/lessons'

export default function MaterialsPage() {
  const [searchParams] = useSearchParams()
  const initialModul = searchParams.get('modul') || ''
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')

  const categories = ['Semua', 'Konsep Dasar', 'Golongan Utama', 'Nomenklatur Kimia', 'Turunan Alkana', 'Struktur Molekul', 'Reaktivitas Kimia']

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
          hingga reaksi organik dan identifikasi gugus fungsi.
        </p>
      </div>

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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
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
          const isHighlighted = initialModul === module.slug
          return (
            <div
              key={module.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                isHighlighted ? 'border-[#1DAA9A] ring-2 ring-teal-500/20' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
                    Modul {module.moduleNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {module.estimatedMinutes} Menit
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-[#101C3A]">{module.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{module.subtitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{module.description}</p>

                {/* Topics List */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cakupan Bahasan:
                  </span>
                  <ul className="space-y-1.5">
                    {module.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1DAA9A] mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {module.keyFormula}
                </span>
                <Link
                  to={`/materi?modul=${module.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Pelajari</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
