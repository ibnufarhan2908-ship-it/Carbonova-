import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Compass, Search } from 'lucide-react'
import MoleculeViewer2D from '../components/molecules/MoleculeViewer2D'
import { MOLECULES_DATA } from '../data/molecules'

export default function MoleculeExplorerPage() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('id') || 'metana'

  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(initialId)
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    const idFromUrl = searchParams.get('id')
    if (idFromUrl) {
      setSelectedMoleculeId(idFromUrl)
    }
  }, [searchParams])

  const categories = [
    'Semua',
    'Alkana',
    'Alkena',
    'Alkuna',
    'Alkohol',
    'Keton',
    'Asam Karboksilat',
    'Aromatik',
  ]

  const filteredMolecules = MOLECULES_DATA.filter((m) => {
    const matchesCategory =
      selectedCategory === 'Semua' || m.category === selectedCategory
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.iupacName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentMolecule =
    MOLECULES_DATA.find((m) => m.id === selectedMoleculeId) || filteredMolecules[0] || MOLECULES_DATA[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          Molecule Explorer Interaktif
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
          Eksplorasi Struktur & Geometri Molekul
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pelajari geometri molekul senyawa karbon, jenis ikatan kovalen (tunggal, rangkap dua, rangkap tiga),
          serta rumus struktur 2D yang akurat sesuai aturan valensi.
        </p>
      </div>

      {/* Main Grid: Left Catalog, Right Interactive Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Molecule Directory List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari molekul (etanol, CH₄)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#101C3A] text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Molecules List Cards */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredMolecules.map((m) => {
              const isSelected = m.id === currentMolecule.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoleculeId(m.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50/60 border-[#1DAA9A] ring-1 ring-[#1DAA9A]'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#101C3A]">{m.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                        {m.formula}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">IUPAC: {m.iupacName}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {m.category}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Detailed Viewer and Scientific Data */}
        <div className="lg:col-span-8 space-y-6">
          {/* Molecular Viewer Component */}
          <MoleculeViewer2D molecule={currentMolecule} height={360} />

          {/* Detailed Chemistry Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1DAA9A] block">
                Identitas Senyawa
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Senyawa:</span>
                  <span className="font-bold text-[#101C3A]">{currentMolecule.name}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tata Nama IUPAC:</span>
                  <span className="font-mono font-bold text-slate-800">{currentMolecule.iupacName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Rumus Molekul:</span>
                  <span className="font-mono font-bold text-teal-700">{currentMolecule.formula}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Massa Molar (Mr):</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {currentMolecule.molecularWeight} g/mol
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Gugus Fungsi:</span>
                  <span className="font-semibold text-slate-700">
                    {currentMolecule.functionalGroup || 'Tidak ada (Hidrokarbon murni)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Properties Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1DAA9A] block">
                Sifat Fisik & Ikatan
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Titik Didih:</span>
                  <span className="font-semibold text-slate-800">{currentMolecule.boilingPoint}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Wujud Suhu Kamar (25°C):</span>
                  <span className="font-semibold text-slate-800">{currentMolecule.stateAtRoomTemp}</span>
                </div>
                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-500 block mb-1">Jenis Ikatan Kovalen:</span>
                  <ul className="space-y-1">
                    {currentMolecule.bondTypes.map((b, idx) => (
                      <li key={idx} className="font-mono text-[11px] text-slate-700">
                        • {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Real-world Usage Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-[#101C3A]">Pemanfaatan dalam Kehidupan Sehari-hari</h4>
            <p className="text-slate-600 leading-relaxed italic">
              "{currentMolecule.dailyUses}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
