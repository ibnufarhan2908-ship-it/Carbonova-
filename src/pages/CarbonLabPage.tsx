import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FlaskConical,
  Atom,
  Flame,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'

export default function CarbonLabPage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'builder'
  const [activeTab, setActiveTab] = useState<'builder' | 'combustion' | 'unsaturation'>(
    initialTab as any
  )

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && ['builder', 'combustion', 'unsaturation'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as any)
    }
  }, [searchParams])

  // State for Molecular Builder
  const [carbonCount, setCarbonCount] = useState<number>(1)
  const [hydrogenCount, setHydrogenCount] = useState<number>(4)
  const [oxygenCount, setOxygenCount] = useState<number>(0)
  const [builderFeedback, setBuilderFeedback] = useState<{
    valid: boolean
    name: string
    msg: string
  }>({
    valid: true,
    name: 'Metana (CH₄)',
    msg: 'Struktur stabil! 1 atom C berikatan kovalen sempurna dengan 4 atom H memenuhi aturan oktet.',
  })

  const checkStructure = (c: number, h: number, o: number) => {
    if (c === 1 && h === 4 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Metana (CH₄)',
        msg: 'Struktur stabil! 1 atom C mengikat 4 atom H dengan 4 ikatan kovalen tunggal (sp³ tetrahedral).',
      })
    } else if (c === 2 && h === 4 && o === 0) {
      setBuilderFeedback({
        valid: true,
        name: 'Etena (C₂H₄)',
        msg: 'Struktur stabil! Dua atom C membentuk ikatan rangkap dua (C=C), masing-masing mengikat 2 atom H.',
      })
    } else if (c === 2 && h === 6 && o === 1) {
      setBuilderFeedback({
        valid: true,
        name: 'Etanol / Dimetil Eter (C₂H₆O)',
        msg: 'Struktur stabil! Memenuhi kaidah valensi: C (valensi 4), O (valensi 2), H (valensi 1).',
      })
    } else {
      setBuilderFeedback({
        valid: false,
        name: `Komposisi C${c}H${h}${o > 0 ? `O${o}` : ''}`,
        msg: 'Valensi belum terpenuhi! Ingat: Karbon harus membentuk tepat 4 ikatan, Hidrogen 1 ikatan, dan Oksigen 2 ikatan.',
      })
    }
  }

  // State for Combustion Experiment
  const [combustionFuel, setCombustionFuel] = useState<'metana' | 'propana' | 'butana'>('metana')
  const [isComplete, setIsComplete] = useState<boolean>(true)

  const combustionData = {
    metana: {
      name: 'Metana (CH₄)',
      completeEq: 'CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g) + Energi',
      incompleteEq: '2 CH₄(g) + 3 O₂(g) → 2 CO(g) + 4 H₂O(g) + Jelaga C',
      notes: 'Komponen gas alam. Pembakaran sempurna menghasilkan api biru bersih tanpa jelaga.',
    },
    propana: {
      name: 'Propana (C₃H₈)',
      completeEq: 'C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(g) + Energi',
      incompleteEq: '2 C₃H₈(g) + 7 O₂(g) → 6 CO(g) + 8 H₂O(g) + Jelaga C',
      notes: 'Bahan bakar LPG. Memerlukan 5 mol oksigen per mol propana untuk pembakaran sempurna.',
    },
    butana: {
      name: 'Butana (C₄H₁₀)',
      completeEq: '2 C₄H₁₀(g) + 13 O₂(g) → 8 CO₂(g) + 10 H₂O(g) + Energi',
      incompleteEq: '2 C₄H₁₀(g) + 9 O₂(g) → 8 CO(g) + 10 H₂O(g) + Jelaga C',
      notes: 'Bahan bakar korek gas. Jika oksigen terbatas, nyala api berwarna kuning kemerahan dan berasap.',
    },
  }

  // State for Unsaturation Test
  const [unsaturationSample, setUnsaturationSample] = useState<'alkana' | 'alkena'>('alkena')
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
          Carbon Lab: Simulasi Eksperimen Kimia
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Uji hipotesis kimia Anda melalui simulasi digital: rakit molekul dengan aturan valensi,
          simulasikan reaksi pembakaran stoikiometri, dan uji ikatan rangkap tak jenuh.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('builder')}
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
          onClick={() => setActiveTab('combustion')}
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
          onClick={() => setActiveTab('unsaturation')}
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

      {/* Tab 1: Structure Builder */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">
                Eksperimen 1
              </span>
              <h3 className="text-xl font-bold text-[#101C3A]">Molecular Structure Builder</h3>
              <p className="text-xs text-slate-500 mt-1">
                Atur jumlah atom penyusun molekul untuk memeriksa stabilitas ikatan kovalennya.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Pilih Preset Molekul:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCarbonCount(1)
                    setHydrogenCount(4)
                    setOxygenCount(0)
                    checkStructure(1, 4, 0)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  Metana (CH₄)
                </button>
                <button
                  onClick={() => {
                    setCarbonCount(2)
                    setHydrogenCount(4)
                    setOxygenCount(0)
                    checkStructure(2, 4, 0)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  Etena (C₂H₄)
                </button>
                <button
                  onClick={() => {
                    setCarbonCount(2)
                    setHydrogenCount(6)
                    setOxygenCount(1)
                    checkStructure(2, 6, 1)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  Etanol (C₂H₆O)
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#101C3A] border border-[#5DE0E6]" />
                  <span className="text-xs font-bold text-slate-800">Atom Karbon (C, Valensi 4):</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(1, carbonCount - 1)
                      setCarbonCount(val)
                      checkStructure(val, hydrogenCount, oxygenCount)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-6 text-center">{carbonCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(6, carbonCount + 1)
                      setCarbonCount(val)
                      checkStructure(val, hydrogenCount, oxygenCount)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-400" />
                  <span className="text-xs font-bold text-slate-800">Atom Hidrogen (H, Valensi 1):</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(0, hydrogenCount - 1)
                      setHydrogenCount(val)
                      checkStructure(carbonCount, val, oxygenCount)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-6 text-center">{hydrogenCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(14, hydrogenCount + 1)
                      setHydrogenCount(val)
                      checkStructure(carbonCount, val, oxygenCount)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-slate-800">Atom Oksigen (O, Valensi 2):</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(0, oxygenCount - 1)
                      setOxygenCount(val)
                      checkStructure(carbonCount, hydrogenCount, val)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-6 text-center">{oxygenCount}</span>
                  <button
                    onClick={() => {
                      const val = Math.min(3, oxygenCount + 1)
                      setOxygenCount(val)
                      checkStructure(carbonCount, hydrogenCount, val)
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evaluasi Kaidah Valensi
            </span>
            <div className="flex items-center gap-3">
              {builderFeedback.valid ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-base text-[#101C3A]">{builderFeedback.name}</h4>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    builderFeedback.valid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {builderFeedback.valid ? 'Molekul Valid & Stabil' : 'Struktur Belum Setimbang'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {builderFeedback.msg}
            </p>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
              <span className="font-bold block">💡 Aturan Dasar Valensi Kimia Organik:</span>
              <p>
                Atom Karbon (C) wajib membentuk 4 ikatan kovalen untuk mencapai konfigurasi oktet stabil seperti gas mulia Neon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Combustion Simulation */}
      {activeTab === 'combustion' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Eksperimen 2
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
                      ? 'bg-[#101C3A] text-white'
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
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isComplete
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pembakaran Sempurna (O₂ Cukup)
            </button>
            <button
              onClick={() => setIsComplete(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isComplete
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pembakaran Tak Sempurna (O₂ Terbatas)
            </button>
          </div>

          {/* Balanced Reaction Box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 font-mono">
            <span className="text-[11px] font-semibold text-slate-400 block font-sans">
              Persamaan Reaksi Setara:
            </span>
            <div className="text-sm sm:text-base font-bold text-[#5DE0E6] overflow-x-auto py-1">
              {isComplete
                ? combustionData[combustionFuel].completeEq
                : combustionData[combustionFuel].incompleteEq}
            </div>
          </div>

          {/* Chemical Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-[#101C3A] block mb-1">Analisis Reaksi:</span>
            {combustionData[combustionFuel].notes} Pada pembakaran tidak sempurna, pasokan oksigen yang kurang memadai menyebabkan terbentuknya gas karbon monoksida (CO) yang beracun karena mengikat hemoglobin darah 200x lebih kuat daripada oksigen.
          </div>
        </div>
      )}

      {/* Tab 3: Unsaturation Test */}
      {activeTab === 'unsaturation' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Eksperimen 3
            </span>
            <h3 className="text-xl font-bold text-[#101C3A]">Uji Ketidakjenuhan dengan Air Bromin</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bandingkan reaktivitas hidrokarbon jenuh (alkana) vs tak jenuh (alkena) terhadap reaksi adisi halogen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Test Tube Simulation */}
            <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-44 rounded-b-3xl border-2 border-slate-500 relative flex flex-col justify-end p-2 overflow-hidden bg-slate-800/50">
                <div
                  className={`w-full rounded-b-2xl transition-all duration-700 ${
                    !isBromineAdded
                      ? 'h-24 bg-cyan-200/30'
                      : unsaturationSample === 'alkena'
                        ? 'h-32 bg-cyan-100/40' // Decolorized / jernih
                        : 'h-32 bg-amber-600/80' // Tetap cokelat kemerahan
                  }`}
                />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-slate-300 block">
                  Sampel: {unsaturationSample === 'alkena' ? 'Heksena (C₆H₁₂)' : 'Heksana (C₆H₁₄)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isBromineAdded
                    ? unsaturationSample === 'alkena'
                      ? 'Warna cokelat Br₂ cepat pudar (Reaksi Adisi C=C)'
                      : 'Warna cokelat Br₂ tetap ada (Tidak Bereaksi)'
                    : 'Tabung berisi sampel zat cair tak berwarna'}
                </span>
              </div>
            </div>

            {/* Controls & Observation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Pilih Zat yang Diuji:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUnsaturationSample('alkena')
                      setIsBromineAdded(false)
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      unsaturationSample === 'alkena'
                        ? 'bg-[#101C3A] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Alkena (Heksena, Ikatan C=C)
                  </button>
                  <button
                    onClick={() => {
                      setUnsaturationSample('alkana')
                      setIsBromineAdded(false)
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      unsaturationSample === 'alkana'
                        ? 'bg-[#101C3A] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Alkana (Heksana, Ikatan C–C)
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsBromineAdded(true)}
                disabled={isBromineAdded}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  !isBromineAdded
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isBromineAdded ? 'Bromin Sudah Diteteskan' : 'Teteskan Air Bromin (Br₂ Cokelat)'}
              </button>

              {isBromineAdded && (
                <button
                  onClick={() => setIsBromineAdded(false)}
                  className="w-full py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Tabung Reaksi
                </button>
              )}

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                <span className="font-bold block">Kesimpulan Ilmiah:</span>
                <p className="leading-relaxed">
                  {unsaturationSample === 'alkena'
                    ? 'Alkena memiliki ikatan rangkap dua yang mudah mengalami reaksi adisi mengikat atom bromin, membentuk 1,2-dibromoheksana yang tidak berwarna.'
                    : 'Alkana adalah hidrokarbon jenuh dengan ikatan kovalen tunggal yang kuat, sehingga tidak bereaksi dengan air bromin pada suhu kamar.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
