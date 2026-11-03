import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FlaskConical,
  Atom,
  Flame,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldAlert,
  Info,
  Scale,
} from 'lucide-react'

export default function CarbonLabPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as 'builder' | 'combustion' | 'unsaturation' | null
  const [internalTab, setInternalTab] = useState<'builder' | 'combustion' | 'unsaturation'>('builder')
  const activeTab =
    tabFromUrl && ['builder', 'combustion', 'unsaturation'].includes(tabFromUrl)
      ? tabFromUrl
      : internalTab

  const handleSwitchTab = (tab: 'builder' | 'combustion' | 'unsaturation') => {
    setInternalTab(tab)
    setSearchParams({ tab })
  }

  // State for Molecular Builder
  const [carbonCount, setCarbonCount] = useState<number>(1)
  const [hydrogenCount, setHydrogenCount] = useState<number>(4)
  const [oxygenCount, setOxygenCount] = useState<number>(0)
  const [builderFeedback, setBuilderFeedback] = useState<{
    valid: boolean
    name: string
    formula: string
    condensed: string
    msg: string
  }>({
    valid: true,
    name: 'Metana',
    formula: 'CH₄',
    condensed: 'CH₄',
    msg: 'Struktur stabil! 1 atom C mengikat 4 atom H dengan 4 ikatan kovalen tunggal sp³ memenuhi kaidah oktet.',
  })

  const checkStructure = (c: number, h: number, o: number) => {
    if (c === 1 && h === 4 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Metana',
        formula: 'CH₄',
        condensed: 'CH₄',
        msg: 'Struktur stabil! 1 atom C mengikat 4 atom H dengan 4 ikatan kovalen tunggal (tetrahedral sp³, sudut 109.5°).',
      })
    } else if (c === 2 && h === 6 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Etana',
        formula: 'C₂H₆',
        condensed: 'CH₃–CH₃',
        msg: 'Struktur stabil! Dua atom C dihubungkan oleh 1 ikatan kovalen tunggal C–C, masing-masing mengikat 3 atom H.',
      })
    } else if (c === 3 && h === 8 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Propana',
        formula: 'C₃H₈',
        condensed: 'CH₃–CH₂–CH₃',
        msg: 'Struktur stabil! Rantai alkana 3 atom karbon jenuh dengan 2 ikatan C–C dan 8 ikatan C–H.',
      })
    } else if (c === 4 && h === 10 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Butana / Isobutana',
        formula: 'C₄H₁₀',
        condensed: 'CH₃–CH₂–CH₂–CH₃',
        msg: 'Struktur stabil! Memiliki 2 isomer kerangka: n-butana (rantai lurus) dan 2-metilpropana (bercabang).',
      })
    } else if (c === 2 && h === 4 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Etena (Etilena)',
        formula: 'C₂H₄',
        condensed: 'CH₂=CH₂',
        msg: 'Struktur stabil! Dua atom C membentuk ikatan rangkap dua (C=C), masing-masing mengikat 2 atom H (geometri planar trigonal sp²).',
      })
    } else if (c === 2 && h === 2 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Etuna (Asetilena)',
        formula: 'C₂H₂',
        condensed: 'CH≡CH',
        msg: 'Struktur stabil! Dua atom C membentuk ikatan rangkap tiga linier (C≡C) dengan hibridisasi sp (sudut 180°).',
      })
    } else if (c === 2 && h === 6 && o === 1) {
      setBuilderFeedback({
        valid: true,
        name: 'Etanol / Dimetil Eter',
        formula: 'C₂H₆O',
        condensed: 'CH₃–CH₂–OH  /  CH₃–O–CH₃',
        msg: 'Struktur stabil! Memenuhi kaidah valensi (C=4, H=1, O=2). Pasangan isomer gugus fungsi antara alkohol dan eter.',
      })
    } else if (c === 2 && h === 4 && o === 2) {
      setBuilderFeedback({
        valid: true,
        name: 'Asam Etanoat (Asam Asetat)',
        formula: 'C₂H₄O₂',
        condensed: 'CH₃–COOH',
        msg: 'Struktur stabil! Mengandung gugus karboksil (–COOH) dengan 1 ikatan rangkap C=O dan 1 ikatan tunggal C–O–H.',
      })
    } else {
      setBuilderFeedback({
        valid: false,
        name: `Kombinasi C${c}H${h}${o > 0 ? `O${o}` : ''}`,
        formula: `C${c}H${h}${o > 0 ? `O${o}` : ''}`,
        condensed: '—',
        msg: `Valensi atom belum terpenuhi secara stoikiometris! Ingat kaidah dasar: Atom C wajib membentuk tepat 4 ikatan, H tepat 1 ikatan, dan O tepat 2 ikatan agar semua elektron valensi terpasangkan.`,
      })
    }
  }

  // State for Combustion Experiment
  const [combustionFuel, setCombustionFuel] = useState<'metana' | 'propana' | 'butana'>('metana')
  const [isComplete, setIsComplete] = useState<boolean>(true)

  const combustionData = {
    metana: {
      name: 'Metana (CH₄)',
      formula: 'CH₄',
      completeEq: 'CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g) + 890 kJ',
      incompleteEq: '2 CH₄(g) + 3 O₂(g) → 2 CO(g) + 4 H₂O(g) + Jelaga C',
      atomsComplete: {
        reaktan: { C: 1, H: 4, O: 4 },
        produk: { C: 1, H: 4, O: 4 },
      },
      atomsIncomplete: {
        reaktan: { C: 2, H: 8, O: 6 },
        produk: { C: 2, H: 8, O: 6 },
      },
      notes:
        'Komponen utama gas alam (LNG). Pembakaran sempurna menghasilkan nyala api biru yang efisien tanpa partikulat jelaga.',
    },
    propana: {
      name: 'Propana (C₃H₈)',
      formula: 'C₃H₈',
      completeEq: 'C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(g) + 2220 kJ',
      incompleteEq: '2 C₃H₈(g) + 7 O₂(g) → 6 CO(g) + 8 H₂O(g) + Jelaga C',
      atomsComplete: {
        reaktan: { C: 3, H: 8, O: 10 },
        produk: { C: 3, H: 8, O: 10 },
      },
      atomsIncomplete: {
        reaktan: { C: 6, H: 16, O: 14 },
        produk: { C: 6, H: 16, O: 14 },
      },
      notes:
        'Bahan bakar elpiji (LPG). Memerlukan 5 volume gas oksigen untuk membakar sempurna setiap 1 volume gas propana.',
    },
    butana: {
      name: 'Butana (C₄H₁₀)',
      formula: 'C₄H₁₀',
      completeEq: '2 C₄H₁₀(g) + 13 O₂(g) → 8 CO₂(g) + 10 H₂O(g) + 5750 kJ',
      incompleteEq: '2 C₄H₁₀(g) + 9 O₂(g) → 8 CO(g) + 10 H₂O(g) + Jelaga C',
      atomsComplete: {
        reaktan: { C: 8, H: 20, O: 26 },
        produk: { C: 8, H: 20, O: 26 },
      },
      atomsIncomplete: {
        reaktan: { C: 8, H: 20, O: 18 },
        produk: { C: 8, H: 20, O: 18 },
      },
      notes:
        'Bahan bakar korek gas portabel. Jika oksigen terbatas, nyala api berubah warna menjadi kuning kemerahan dan mengeluarkan asap jelaga hitam.',
    },
  }

  // State for Unsaturation Test
  const [unsaturationSample, setUnsaturationSample] = useState<'alkena' | 'alkana'>('alkena')
  const [isBromineAdded, setIsBromineAdded] = useState<boolean>(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <FlaskConical className="w-3.5 h-3.5" />
          Laboratorium Virtual Senyawa Karbon
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
          Carbon Lab: Eksperimen Virtual & Simulasi Kimia
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Eksplorasi hukum kimia organik secara digital: uji aturan valensi tetravalen karbon, amati
          kesetaraan stoikiometri pembakaran, dan pelajari reaksi adisi halogen pada ikatan tak jenuh.
        </p>
      </div>

      {/* Lab Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <button
          onClick={() => handleSwitchTab('builder')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'builder'
              ? 'bg-[#101C3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Atom className="w-4 h-4 text-[#5DE0E6]" />
          <span>Molecular Builder</span>
        </button>

        <button
          onClick={() => handleSwitchTab('combustion')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'combustion'
              ? 'bg-[#101C3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Simulasi Pembakaran</span>
        </button>

        <button
          onClick={() => handleSwitchTab('unsaturation')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'unsaturation'
              ? 'bg-[#101C3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-teal-400" />
          <span>Uji Ketidakjenuhan</span>
        </button>
      </div>

      {/* TAB 1: MOLECULAR BUILDER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm animate-in fade-in">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
                Eksperimen 1 — Model Valensi
              </span>
              <h3 className="text-xl font-bold text-[#101C3A]">Molecular Structure Builder</h3>
              <p className="text-xs text-slate-500 mt-1">
                Atur komposisi atom untuk membuktikan aturan valensi: C (4 ikatan), H (1 ikatan), O (2 ikatan).
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Pilih Preset Molekul:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Metana (CH₄)', c: 1, h: 4, o: 0 },
                  { name: 'Etana (C₂H₆)', c: 2, h: 6, o: 0 },
                  { name: 'Etena (C₂H₄)', c: 2, h: 4, o: 0 },
                  { name: 'Etuna (C₂H₂)', c: 2, h: 2, o: 0 },
                  { name: 'Etanol (C₂H₆O)', c: 2, h: 6, o: 1 },
                  { name: 'Asam Asetat (C₂H₄O₂)', c: 2, h: 4, o: 2 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCarbonCount(p.c)
                      setHydrogenCount(p.h)
                      setOxygenCount(p.o)
                      checkStructure(p.c, p.h, p.o)
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-2">
              {/* Carbon */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#101C3A] border-2 border-[#5DE0E6] flex items-center justify-center text-[10px] text-white font-bold">
                    C
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Atom Karbon (C)</span>
                    <span className="text-[10px] text-slate-500">Valensi 4 (Tetravalen)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(1, carbonCount - 1)
                      setCarbonCount(val)
                      checkStructure(val, hydrogenCount, oxygenCount)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm w-8 text-center">{carbonCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(6, carbonCount + 1)
                      setCarbonCount(val)
                      checkStructure(val, hydrogenCount, oxygenCount)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hydrogen */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center text-[10px] text-slate-800 font-bold">
                    H
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Atom Hidrogen (H)</span>
                    <span className="text-[10px] text-slate-500">Valensi 1 (Monovalen)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(0, hydrogenCount - 1)
                      setHydrogenCount(val)
                      checkStructure(carbonCount, val, oxygenCount)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm w-8 text-center">{hydrogenCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(14, hydrogenCount + 1)
                      setHydrogenCount(val)
                      checkStructure(carbonCount, val, oxygenCount)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Oxygen */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
                    O
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Atom Oksigen (O)</span>
                    <span className="text-[10px] text-slate-500">Valensi 2 (Divalen)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(0, oxygenCount - 1)
                      setOxygenCount(val)
                      checkStructure(carbonCount, hydrogenCount, val)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm w-8 text-center">{oxygenCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(3, oxygenCount + 1)
                      setOxygenCount(val)
                      checkStructure(carbonCount, hydrogenCount, val)
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Evaluation Panel */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Hasil Evaluasi Valensi
            </span>

            <div className="flex items-start gap-3">
              {builderFeedback.valid ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-lg text-[#101C3A]">{builderFeedback.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                      builderFeedback.valid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {builderFeedback.valid ? 'Molekul Valid & Stabil' : 'Struktur Belum Setimbang'}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {builderFeedback.formula}
                  </span>
                </div>
              </div>
            </div>

            {builderFeedback.valid && builderFeedback.condensed !== '—' && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rumus Struktur Terkondensasi:
                </span>
                <span className="font-mono text-sm font-bold text-[#101C3A]">
                  {builderFeedback.condensed}
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
              {builderFeedback.msg}
            </p>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
              <span className="font-bold block flex items-center gap-1.5 text-teal-900">
                <Info className="w-4 h-4 text-teal-700" />
                Prinsip Kestabilan Valensi:
              </span>
              <p className="leading-relaxed text-slate-700">
                Untuk membentuk molekul netral tanpa radikal bebas atau muatan formal, jumlah total ikatan kovalen yang terbentuk harus memenuhi aturan: (4 × C + 1 × H + 2 × O) / 2 = bilangan bulat pasangan elektron ikatan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMBUSTION SIMULATION */}
      {activeTab === 'combustion' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Eksperimen 2 — Stoikiometri Reaksi
              </span>
              <h3 className="text-xl font-bold text-[#101C3A]">Simulasi Pembakaran Hidrokarbon</h3>
              <p className="text-xs text-slate-500 mt-1">
                Amati persamaan reaksi stoikiometri setara antara pembakaran sempurna dan tidak sempurna.
              </p>
            </div>

            {/* Fuel Selector */}
            <div className="flex items-center gap-2">
              {(['metana', 'propana', 'butana'] as const).map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setCombustionFuel(fuel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    combustionFuel === fuel
                      ? 'bg-[#101C3A] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Sempurna vs Tidak Sempurna */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsComplete(true)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isComplete
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-4 h-4 text-cyan-300" />
              <span>Pembakaran Sempurna (O₂ Berlimpah)</span>
            </button>
            <button
              onClick={() => setIsComplete(false)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                !isComplete
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>Pembakaran Tak Sempurna (O₂ Terbatas)</span>
            </button>
          </div>

          {/* Balanced Reaction Box */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 font-mono shadow-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block font-sans uppercase tracking-wider">
              Persamaan Reaksi Kimia Setara:
            </span>
            <div className="text-sm sm:text-lg font-bold text-[#5DE0E6] overflow-x-auto py-2">
              {isComplete
                ? combustionData[combustionFuel].completeEq
                : combustionData[combustionFuel].incompleteEq}
            </div>
          </div>

          {/* Stoichiometric Atom Balance Grid */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101C3A]">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Neraca Kekekalan Atom (Stoikiometri Setara):</span>
            </div>

            {(() => {
              const currentCounts = isComplete
                ? combustionData[combustionFuel].atomsComplete
                : combustionData[combustionFuel].atomsIncomplete
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-600 block">Sisi Reaktan (Kiri):</span>
                    <div className="flex items-center justify-around font-mono">
                      <span className="font-bold text-slate-800">{currentCounts.reaktan.C} Atom C</span>
                      <span className="font-bold text-slate-800">{currentCounts.reaktan.H} Atom H</span>
                      <span className="font-bold text-slate-800">{currentCounts.reaktan.O} Atom O</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-800 block">Sisi Produk (Kanan):</span>
                    <div className="flex items-center justify-around font-mono">
                      <span className="font-bold text-emerald-800">{currentCounts.produk.C} Atom C</span>
                      <span className="font-bold text-emerald-800">{currentCounts.produk.H} Atom H</span>
                      <span className="font-bold text-emerald-800">{currentCounts.produk.O} Atom O</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Chemical Analysis & Safety Disclaimer */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#101C3A] block mb-1">Analisis Reaksi & Produk:</span>
              {combustionData[combustionFuel].notes}{' '}
              {!isComplete && (
                <span className="text-amber-800 font-medium">
                  Pada pembakaran tidak sempurna, pasokan oksigen yang kurang memadai menyebabkan
                  terbentuknya gas karbon monoksida (CO) yang berbahaya karena mengikat hemoglobin
                  darah 200–250x lebih kuat daripada oksigen.
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Keselamatan:</strong> Fitur ini adalah simulasi digital konseptual.
                Jangan melakukan pembakaran hidrokarbon tanpa peralatan keselamatan laboratorium dan pengawasan guru.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UNSATURATION TEST */}
      {activeTab === 'unsaturation' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Eksperimen 3 — Uji Adisi Bromin
            </span>
            <h3 className="text-xl font-bold text-[#101C3A]">Uji Ketidakjenuhan dengan Air Bromin</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bandingkan reaktivitas hidrokarbon jenuh (alkana) vs tak jenuh (alkena) terhadap reaksi adisi halogen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual Test Tube Simulation */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="w-24 h-48 rounded-b-3xl border-2 border-slate-500 relative flex flex-col justify-end p-2 overflow-hidden bg-slate-800/60 shadow-xl">
                <div
                  className={`w-full rounded-b-2xl transition-all duration-700 ${
                    !isBromineAdded
                      ? 'h-24 bg-cyan-200/30'
                      : unsaturationSample === 'alkena'
                        ? 'h-32 bg-cyan-100/30' // Decolorized / jernih
                        : 'h-32 bg-amber-600/90' // Tetap cokelat kemerahan
                  }`}
                />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-slate-200 block">
                  Sampel: {unsaturationSample === 'alkena' ? 'Heksena (C₆H₁₂, Ikatan C=C)' : 'Heksana (C₆H₁₄, Ikatan C–C)'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isBromineAdded
                    ? unsaturationSample === 'alkena'
                      ? 'Warna cokelat Br₂ cepat memudar (Reaksi Adisi C=C Berhasil)'
                      : 'Warna cokelat Br₂ tetap ada (Tidak Ada Reaksi pada Alkana)'
                    : 'Tabung reaksi berisi zat cair tak berwarna'}
                </span>
              </div>
            </div>

            {/* Controls & Observation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Pilih Sampel yang Diuji:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUnsaturationSample('alkena')
                      setIsBromineAdded(false)
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      unsaturationSample === 'alkena'
                        ? 'bg-[#101C3A] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Alkena (Heksena, Tak Jenuh)
                  </button>
                  <button
                    onClick={() => {
                      setUnsaturationSample('alkana')
                      setIsBromineAdded(false)
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      unsaturationSample === 'alkana'
                        ? 'bg-[#101C3A] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Alkana (Heksana, Jenuh)
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsBromineAdded(true)}
                disabled={isBromineAdded}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  !isBromineAdded
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isBromineAdded ? 'Bromin Telah Diteteskan' : 'Teteskan Air Bromin (Br₂ Cokelat)'}
              </button>

              {isBromineAdded && (
                <button
                  onClick={() => setIsBromineAdded(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Tabung Reaksi
                </button>
              )}

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                <span className="font-bold block text-teal-900">Penjelasan Ilmiah:</span>
                <p className="leading-relaxed text-slate-700">
                  {unsaturationSample === 'alkena'
                    ? 'Alkena memiliki ikatan rangkap dua (C=C) dengan ikatan pi (π) yang mudah diputus. Atom-atom bromin bereaksi adisi mengikat atom C ikatan rangkap, menghasilkan 1,2-dibromoheksana yang tidak berwarna, sehingga warna cokelat air bromin langsung memudar.'
                    : 'Alkana adalah hidrokarbon jenuh yang seluruh ikatannya merupakan ikatan kovalen tunggal sigma (σ) yang kokoh. Pada suhu kamar tanpa katalis atau sinar ultraviolet (UV), alkana tidak bereaksi dengan air bromin, sehingga warna cokelat bromin tetap bertahan.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Simulasi digital ini merupakan model pembelajaran. Data yang ditampilkan adalah hasil pengamatan teoretis sesuai literatur kimia organik.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
