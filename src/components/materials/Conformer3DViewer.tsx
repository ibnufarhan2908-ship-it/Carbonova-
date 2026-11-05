import { useState } from 'react'
import {
  ExternalLink,
  Sparkles,
  RefreshCw,
  Layers,
  AlertTriangle,
  Atom,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { CONFORMER_MOLECULES, type ConformerMolecule } from '../../data/conformers'

interface Conformer3DViewerProps {
  initialMoleculeId?: string
  className?: string
}

export default function Conformer3DViewer({
  initialMoleculeId = '3-metil-1-pentena',
  className = '',
}: Conformer3DViewerProps) {
  const [selectedId, setSelectedId] = useState<string>(initialMoleculeId)
  const [renderMode, setRenderMode] = useState<'balls' | 'stick' | 'vdw'>('balls')
  const [engine, setEngine] = useState<'molview' | 'icn3d'>('molview')
  const [iframeKey, setIframeKey] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const currentMolecule: ConformerMolecule =
    CONFORMER_MOLECULES.find((m) => m.id === selectedId) || CONFORMER_MOLECULES[0]

  const handleSelectMolecule = (id: string) => {
    setSelectedId(id)
    setIsLoading(true)
    setIframeKey((prev) => prev + 1)
  }

  const handleReload = () => {
    setIsLoading(true)
    setIframeKey((prev) => prev + 1)
  }

  // Construct iframe source URL
  const iframeSrc =
    engine === 'molview'
      ? `https://embed.molview.org/v1/?mode=${renderMode}&cid=${currentMolecule.cid}&bg=white`
      : `https://www.ncbi.nlm.nih.gov/Structure/icn3d/full.html?type=pubchem&cid=${currentMolecule.cid}&width=100%25&height=100%25&showcommand=0&shownote=0`

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden space-y-6 p-6 sm:p-8 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-[#1DAA9A]" />
              Visualisasi Konformer 3D PubChem
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              NCBI / NIH Database
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101C3A] tracking-tight">
            Eksplorasi Konformer 3D & Nomenklatur IUPAC
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Amati struktur ruang tiga dimensi molekul nyata dari PubChem dan pelajari mengapa setiap aturan penamaan IUPAC diterapkan.
          </p>
        </div>

        {/* PubChem Direct Link Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={currentMolecule.pubchemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101C3A] text-white hover:bg-[#182852] text-xs font-bold shadow-sm transition-all hover:shadow-md"
            title="Buka langsung di PubChem 3D Conformer Fullscreen"
          >
            <ExternalLink className="w-4 h-4 text-[#5DE0E6]" />
            <span>Buka di PubChem 3D (Fullscreen)</span>
          </a>
        </div>
      </div>

      {/* Molecule Selection Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Pilih Senyawa untuk Diamati dalam 3D:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CONFORMER_MOLECULES.map((mol) => {
            const isSelected = mol.id === currentMolecule.id
            return (
              <button
                key={mol.id}
                onClick={() => handleSelectMolecule(mol.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#101C3A] text-white border-[#101C3A] shadow-md ring-2 ring-teal-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Atom className={`w-3.5 h-3.5 ${isSelected ? 'text-[#5DE0E6]' : 'text-slate-400'}`} />
                <span>{mol.name}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-[#5DE0E6]' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {mol.formula}
                </span>
                {mol.id === '3-metil-1-pentena' && (
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold px-1.5 py-0.5 rounded">
                    ★ Request
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3D Viewer Box & Control Bar */}
      <div className="space-y-3">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900 text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#5DE0E6] text-sm">{currentMolecule.name}</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
              CID: {currentMolecule.cid}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400">
              • {currentMolecule.category}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Style mode toggles for MolView */}
            {engine === 'molview' && (
              <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                <button
                  onClick={() => setRenderMode('balls')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    renderMode === 'balls' ? 'bg-[#5DE0E6] text-[#101C3A]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ball & Stick
                </button>
                <button
                  onClick={() => setRenderMode('stick')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    renderMode === 'stick' ? 'bg-[#5DE0E6] text-[#101C3A]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Stick
                </button>
                <button
                  onClick={() => setRenderMode('vdw')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    renderMode === 'vdw' ? 'bg-[#5DE0E6] text-[#101C3A]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Spacefill
                </button>
              </div>
            )}

            {/* Engine Switcher */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => {
                  setEngine('molview')
                  setIsLoading(true)
                  setIframeKey((k) => k + 1)
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  engine === 'molview' ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="MolView 3D WebGL Viewer"
              >
                MolView
              </button>
              <button
                onClick={() => {
                  setEngine('icn3d')
                  setIsLoading(true)
                  setIframeKey((k) => k + 1)
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  engine === 'icn3d' ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="NCBI Official iCn3D Viewer"
              >
                NCBI iCn3D
              </button>
            </div>

            {/* Reload Button */}
            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Muat Ulang Viewer 3D"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Minimize Viewer Size */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors hidden sm:inline-flex"
              title={isExpanded ? 'Kecilkan Tampilan' : 'Perbesar Tampilan'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3D Frame */}
        <div
          className={`relative w-full rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-inner transition-all duration-300 ${
            isExpanded ? 'h-[540px]' : 'h-[360px] sm:h-[420px]'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-xs text-slate-600 gap-3">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-600">
                Memuat Konformer 3D ({currentMolecule.name})...
              </span>
            </div>
          )}

          <iframe
            key={`${currentMolecule.id}-${engine}-${renderMode}-${iframeKey}`}
            src={iframeSrc}
            title={`3D Conformer ${currentMolecule.name}`}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />

          {/* Tips Overlay */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-2 pointer-events-none border border-slate-700/60 shadow-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>🖱️ Klik & geser untuk memutar molekul 3D. Scroll roda mouse untuk memperbesar/memperkecil.</span>
          </div>
        </div>
      </div>

      {/* Chemical Identity Quick Card */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/90 text-teal-950 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            Rumus Molekul
          </span>
          <span className="font-mono text-sm font-black text-[#101C3A]">{currentMolecule.formula}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            Rumus Terkondensasi
          </span>
          <span className="font-mono text-xs font-black text-[#101C3A] break-all">
            {currentMolecule.condensedFormula}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            Massa Molar
          </span>
          <span className="font-mono text-sm font-black text-[#101C3A]">
            {currentMolecule.molecularWeight} g/mol
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            PubChem ID (CID)
          </span>
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${currentMolecule.cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-bold text-teal-700 hover:text-teal-900 underline inline-flex items-center gap-1 mt-0.5"
          >
            <span>CID {currentMolecule.cid}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Detailed IUPAC Nomenclature Analysis Cards */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-[#101C3A] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1DAA9A]" />
          Langkah Nomenklatur IUPAC untuk {currentMolecule.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Parent Chain */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#101C3A] text-[#5DE0E6] flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#101C3A]">
                Penentuan Rantai Induk Terpanjang
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-7">
              {currentMolecule.parentChainExplanation}
            </p>
          </div>

          {/* Step 2: Numbering */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#101C3A] text-[#5DE0E6] flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#101C3A]">
                Penomoran Atom Karbon & Prioritas
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-7">
              {currentMolecule.numberingExplanation}
            </p>
          </div>

          {/* Step 3: Branch / Substituents */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#101C3A] text-[#5DE0E6] flex items-center justify-center font-bold text-xs">
                3
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#101C3A]">
                Identifikasi Gugus Cabang (Substituen)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-7">
              {currentMolecule.branchExplanation}
            </p>
          </div>

          {/* Step 4: Assembly of IUPAC Name */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <span className="font-bold text-xs sm:text-sm text-teal-950">
                Perakitan Nama IUPAC Resmi
              </span>
            </div>
            <p className="text-xs text-teal-900 leading-relaxed pl-7">
              {currentMolecule.iupacRuleExplanation}
            </p>
          </div>
        </div>

        {/* Common Pitfall Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block text-amber-900">
              Perhatikan Jebakan Umum Siswa:
            </span>
            <p className="leading-relaxed text-amber-800">{currentMolecule.commonPitfall}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
