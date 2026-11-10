import { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Layers,
  Activity,
} from 'lucide-react'
import ChemicalFormula from './ChemicalFormula'

type HydrocarbonSeries = 'alkana' | 'alkena' | 'alkuna' | 'isomer'

interface AlkaneData {
  n: number
  name: string
  alkeneName: string
  alkyneName: string
  formulaAlkane: string
  formulaAlkene: string
  formulaAlkyne: string
  condensedAlkane: string
  condensedAlkene: string
  condensedAlkyne: string
  boilingPointAlkane: string
  stateAlkane: 'Gas' | 'Cair'
  mrAlkane: number
  description: string
}

const HYDROCARBON_DATA: AlkaneData[] = [
  {
    n: 1,
    name: 'Metana',
    alkeneName: '— (Minimal 2C)',
    alkyneName: '— (Minimal 2C)',
    formulaAlkane: 'CH₄',
    formulaAlkene: '—',
    formulaAlkyne: '—',
    condensedAlkane: 'CH₄',
    condensedAlkene: '—',
    condensedAlkyne: '—',
    boilingPointAlkane: '-161.5 °C',
    stateAlkane: 'Gas',
    mrAlkane: 16.04,
    description: 'Molekul hidrokarbon paling sederhana. Komponen utama gas alam (LNG).',
  },
  {
    n: 2,
    name: 'Etana',
    alkeneName: 'Etena',
    alkyneName: 'Etuna',
    formulaAlkane: 'C₂H₆',
    formulaAlkene: 'C₂H₄',
    formulaAlkyne: 'C₂H₂',
    condensedAlkane: 'CH₃–CH₃',
    condensedAlkene: 'CH₂=CH₂',
    condensedAlkyne: 'CH≡CH',
    boilingPointAlkane: '-88.6 °C',
    stateAlkane: 'Gas',
    mrAlkane: 30.07,
    description: 'Etana memiliki ikatan C–C tunggal. Etena dipakai mematangkan buah; Etuna untuk las karbit.',
  },
  {
    n: 3,
    name: 'Propana',
    alkeneName: 'Propena',
    alkyneName: 'Propuna',
    formulaAlkane: 'C₃H₈',
    formulaAlkene: 'C₃H₆',
    formulaAlkyne: 'C₃H₄',
    condensedAlkane: 'CH₃–CH₂–CH₃',
    condensedAlkene: 'CH₂=CH–CH₃',
    condensedAlkyne: 'CH≡C–CH₃',
    boilingPointAlkane: '-42.0 °C',
    stateAlkane: 'Gas',
    mrAlkane: 44.1,
    description: 'Bahan bakar gas elpiji (LPG). Propena merupakan bahan baku pembuatan plastik polipropilena.',
  },
  {
    n: 4,
    name: 'Butana',
    alkeneName: '1-Butena',
    alkyneName: '1-Butuna',
    formulaAlkane: 'C₄H₁₀',
    formulaAlkene: 'C₄H₈',
    formulaAlkyne: 'C₄H₆',
    condensedAlkane: 'CH₃–CH₂–CH₂–CH₃',
    condensedAlkene: 'CH₂=CH–CH₂–CH₃',
    condensedAlkyne: 'CH≡C–CH₂–CH₃',
    boilingPointAlkane: '-0.5 °C',
    stateAlkane: 'Gas',
    mrAlkane: 58.12,
    description: 'Bahan bakar korek gas pemantik. Memiliki isomer kerangka 2-metilpropana (isobutana).',
  },
  {
    n: 5,
    name: 'Pentana',
    alkeneName: '1-Pentena',
    alkyneName: '1-Pentuna',
    formulaAlkane: 'C₅H₁₂',
    formulaAlkene: 'C₅H₁₀',
    formulaAlkyne: 'C₅H₈',
    condensedAlkane: 'CH₃–(CH₂)₃–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₂–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₂–CH₃',
    boilingPointAlkane: '36.1 °C',
    stateAlkane: 'Cair',
    mrAlkane: 72.15,
    description: 'Anggota pertama alkana yang berwujud cair pada suhu ruang. Pelarut laboratorium nonpolar.',
  },
  {
    n: 6,
    name: 'Heksana',
    alkeneName: '1-Heksena',
    alkyneName: '1-Heksuna',
    formulaAlkane: 'C₆H₁₄',
    formulaAlkene: 'C₆H₁₂',
    formulaAlkyne: 'C₆H₁₀',
    condensedAlkane: 'CH₃–(CH₂)₄–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₃–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₃–CH₃',
    boilingPointAlkane: '68.7 °C',
    stateAlkane: 'Cair',
    mrAlkane: 86.18,
    description: 'Pelarut umum ekstraksi minyak nabati dan lemak dari biji-bijian.',
  },
  {
    n: 7,
    name: 'Heptana',
    alkeneName: '1-Heptena',
    alkyneName: '1-Heptuna',
    formulaAlkane: 'C₇H₁₆',
    formulaAlkene: 'C₇H₁₄',
    formulaAlkyne: 'C₇H₁₂',
    condensedAlkane: 'CH₃–(CH₂)₅–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₄–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₄–CH₃',
    boilingPointAlkane: '98.4 °C',
    stateAlkane: 'Cair',
    mrAlkane: 100.21,
    description: 'Standar angka oktan bensin (nilai oktan 0 untuk n-heptana karena mudah memicu knocking mesin).',
  },
  {
    n: 8,
    name: 'Oktana',
    alkeneName: '1-Oktena',
    alkyneName: '1-Oktuna',
    formulaAlkane: 'C₈H₁₈',
    formulaAlkene: 'C₈H₁₆',
    formulaAlkyne: 'C₈H₁₄',
    condensedAlkane: 'CH₃–(CH₂)₆–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₅–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₅–CH₃',
    boilingPointAlkane: '125.7 °C',
    stateAlkane: 'Cair',
    mrAlkane: 114.23,
    description: 'Komponen utama bahan bakar bensin kendaraan bermotor (RON / Research Octane Number).',
  },
  {
    n: 9,
    name: 'Nonana',
    alkeneName: '1-Nonena',
    alkyneName: '1-Nonuna',
    formulaAlkane: 'CₙH₂₀',
    formulaAlkene: 'C₉H₁₈',
    formulaAlkyne: 'C₉H₁₆',
    condensedAlkane: 'CH₃–(CH₂)₇–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₆–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₆–CH₃',
    boilingPointAlkane: '150.8 °C',
    stateAlkane: 'Cair',
    mrAlkane: 128.26,
    description: 'Komponen fraksi minyak bumi minyak tanah (kerosin) dan solar.',
  },
  {
    n: 10,
    name: 'Dekana',
    alkeneName: '1-Dekena',
    alkyneName: '1-Dekuna',
    formulaAlkane: 'C₁₀H₂₂',
    formulaAlkene: 'C₁₀H₂₀',
    formulaAlkyne: 'C₁₀H₁₈',
    condensedAlkane: 'CH₃–(CH₂)₈–CH₃',
    condensedAlkene: 'CH₂=CH–(CH₂)₇–CH₃',
    condensedAlkyne: 'CH≡C–(CH₂)₇–CH₃',
    boilingPointAlkane: '174.1 °C',
    stateAlkane: 'Cair',
    mrAlkane: 142.29,
    description: 'Komponen bahan bakar jet / avtur dan pelarut industri berat.',
  },
]

export default function ChainVisualizer() {
  const [carbonCount, setCarbonCount] = useState<number>(5)
  const [series, setSeries] = useState<HydrocarbonSeries>('alkana')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [viewStyle, setViewStyle] = useState<'lewis' | 'skeletal'>('lewis')

  // Auto-play interval for growing chain animation
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCarbonCount((prev) => (prev >= 10 ? 1 : prev + 1))
    }, 1400)

    return () => clearInterval(timer)
  }, [isPlaying])

  // Enforce min 2 carbons for alkene / alkyne
  const effectiveN = (series === 'alkena' || series === 'alkuna') && carbonCount < 2 ? 2 : carbonCount
  const displayItem = HYDROCARBON_DATA[effectiveN - 1]

  const activeName =
    series === 'alkana'
      ? displayItem.name
      : series === 'alkena'
        ? displayItem.alkeneName
        : series === 'alkuna'
          ? displayItem.alkyneName
          : `Isomer Rantai ${displayItem.name}`

  const activeFormula =
    series === 'alkana'
      ? displayItem.formulaAlkane
      : series === 'alkena'
        ? displayItem.formulaAlkene
        : series === 'alkuna'
          ? displayItem.formulaAlkyne
          : displayItem.formulaAlkane

  const activeCondensed =
    series === 'alkana'
      ? displayItem.condensedAlkane
      : series === 'alkena'
        ? displayItem.condensedAlkene
        : series === 'alkuna'
          ? displayItem.condensedAlkyne
          : displayItem.n === 4
            ? 'CH₃–CH(CH₃)–CH₃ (Isobutana)'
            : displayItem.n === 5
              ? 'CH₃–CH(CH₃)–CH₂–CH₃ (Isopentana)'
              : displayItem.condensedAlkane

  // Layout calculations for SVG
  const svgWidth = Math.max(760, effectiveN * 85 + 100)
  const svgHeight = 220
  const startX = 60
  const spacingX = Math.min(80, (svgWidth - 120) / Math.max(1, effectiveN - 1))
  const centerY = 110

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#101C3A] text-white border border-slate-700/80 shadow-xl space-y-6 animate-in fade-in">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1DAA9A]/20 text-[#5DE0E6] text-xs font-bold border border-[#1DAA9A]/40">
            <Sparkles className="w-3.5 h-3.5" />
            Visualisator Interaktif Rantai Karbon
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Rantai Hidrokarbon Dinamis</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-[#5DE0E6] border border-teal-400/30">
              1 sampai 10 Atom C
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Geser slider untuk melihat rantai karbon memanjang secara real-time, perubahan rumus molekul, tata nama, dan sifat fisiknya.
          </p>
        </div>

        {/* Series Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setSeries('alkana')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              series === 'alkana'
                ? 'bg-[#1DAA9A] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alkana (C–C)
          </button>
          <button
            onClick={() => {
              setSeries('alkena')
              if (carbonCount < 2) setCarbonCount(2)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              series === 'alkena'
                ? 'bg-[#1DAA9A] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alkena (C=C)
          </button>
          <button
            onClick={() => {
              setSeries('alkuna')
              if (carbonCount < 2) setCarbonCount(2)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              series === 'alkuna'
                ? 'bg-[#1DAA9A] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alkuna (C≡C)
          </button>
          <button
            onClick={() => setSeries('isomer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              series === 'isomer'
                ? 'bg-[#1DAA9A] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Isomer Rantai
          </button>
        </div>
      </div>

      {/* Main Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Nama IUPAC</span>
          <span className="text-lg sm:text-xl font-extrabold text-[#5DE0E6]">{activeName}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Rumus Molekul</span>
          <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
            <ChemicalFormula formula={activeFormula} />
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Wujud (25°C)</span>
          <span className="text-sm sm:text-base font-bold text-slate-200">
            {displayItem.stateAlkane} (Td {displayItem.boilingPointAlkane})
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Massa Molar (Mr)</span>
          <span className="text-sm sm:text-base font-mono font-bold text-teal-300">
            {displayItem.mrAlkane} g/mol
          </span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative bg-slate-950/80 rounded-2xl border border-slate-700/80 p-4 overflow-x-auto shadow-inner">
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setViewStyle(viewStyle === 'lewis' ? 'skeletal' : 'lewis')}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/10 transition-colors"
          >
            Mode: {viewStyle === 'lewis' ? 'Struktur Lengkap' : 'Garis Skeletal'}
          </button>
        </div>

        <svg
          width={svgWidth}
          height={svgHeight}
          className="mx-auto block select-none transition-all duration-300"
          style={{ minWidth: `${svgWidth}px` }}
        >
          <defs>
            <linearGradient id="carbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1DAA9A" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <linearGradient id="hydrogenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* SKELETAL VIEW */}
          {viewStyle === 'skeletal' && (
            <g className="transition-all duration-300">
              {Array.from({ length: effectiveN }).map((_, i) => {
                const x = startX + i * spacingX
                const y = centerY + (i % 2 === 0 ? -25 : 25)
                const nextX = startX + (i + 1) * spacingX
                const nextY = centerY + ((i + 1) % 2 === 0 ? -25 : 25)

                return (
                  <g key={i}>
                    {i < effectiveN - 1 && (
                      <>
                        {/* If Alkene and bond is 0-1 */}
                        {series === 'alkena' && i === 0 ? (
                          <>
                            <line
                              x1={x}
                              y1={y - 4}
                              x2={nextX}
                              y2={nextY - 4}
                              stroke="#5DE0E6"
                              strokeWidth={3}
                            />
                            <line
                              x1={x}
                              y1={y + 4}
                              x2={nextX}
                              y2={nextY + 4}
                              stroke="#5DE0E6"
                              strokeWidth={3}
                            />
                          </>
                        ) : series === 'alkuna' && i === 0 ? (
                          <>
                            <line
                              x1={x}
                              y1={y - 6}
                              x2={nextX}
                              y2={nextY - 6}
                              stroke="#5DE0E6"
                              strokeWidth={2.5}
                            />
                            <line
                              x1={x}
                              y1={y}
                              x2={nextX}
                              y2={nextY}
                              stroke="#5DE0E6"
                              strokeWidth={3}
                            />
                            <line
                              x1={x}
                              y1={y + 6}
                              x2={nextX}
                              y2={nextY + 6}
                              stroke="#5DE0E6"
                              strokeWidth={2.5}
                            />
                          </>
                        ) : (
                          <line
                            x1={x}
                            y1={y}
                            x2={nextX}
                            y2={nextY}
                            stroke="#5DE0E6"
                            strokeWidth={3}
                          />
                        )}
                      </>
                    )}

                    {/* Node Dot & Carbon Number */}
                    <circle cx={x} cy={y} r={6} fill="#5DE0E6" filter="url(#glow)" />
                    <text
                      x={x}
                      y={y + (i % 2 === 0 ? -14 : 22)}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      C{i + 1}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* LEWIS FULL STRUCTURE VIEW */}
          {viewStyle === 'lewis' && (
            <g className="transition-all duration-300">
              {/* Bonds between Carbons */}
              {Array.from({ length: effectiveN - 1 }).map((_, i) => {
                const x1 = startX + i * spacingX
                const x2 = startX + (i + 1) * spacingX

                if (series === 'alkena' && i === 0) {
                  return (
                    <g key={`cbond-${i}`}>
                      <line
                        x1={x1 + 18}
                        y1={centerY - 4}
                        x2={x2 - 18}
                        y2={centerY - 4}
                        stroke="#5DE0E6"
                        strokeWidth={3.5}
                      />
                      <line
                        x1={x1 + 18}
                        y1={centerY + 4}
                        x2={x2 - 18}
                        y2={centerY + 4}
                        stroke="#5DE0E6"
                        strokeWidth={3.5}
                      />
                    </g>
                  )
                }

                if (series === 'alkuna' && i === 0) {
                  return (
                    <g key={`cbond-${i}`}>
                      <line
                        x1={x1 + 18}
                        y1={centerY - 6}
                        x2={x2 - 18}
                        y2={centerY - 6}
                        stroke="#5DE0E6"
                        strokeWidth={2.5}
                      />
                      <line
                        x1={x1 + 18}
                        y1={centerY}
                        x2={x2 - 18}
                        y2={centerY}
                        stroke="#5DE0E6"
                        strokeWidth={3.5}
                      />
                      <line
                        x1={x1 + 18}
                        y1={centerY + 6}
                        x2={x2 - 18}
                        y2={centerY + 6}
                        stroke="#5DE0E6"
                        strokeWidth={2.5}
                      />
                    </g>
                  )
                }

                return (
                  <line
                    key={`cbond-${i}`}
                    x1={x1 + 18}
                    y1={centerY}
                    x2={x2 - 18}
                    y2={centerY}
                    stroke="#94A3B8"
                    strokeWidth={3}
                  />
                )
              })}

              {/* Carbon and Attached Hydrogen Atoms */}
              {Array.from({ length: effectiveN }).map((_, i) => {
                const cx = startX + i * spacingX
                const cy = centerY

                const isFirst = i === 0
                const isLast = i === effectiveN - 1

                // Determine H counts on this carbon based on series
                let topH = true
                let botH = true
                let leftH = isFirst
                let rightH = isLast

                if (series === 'alkena') {
                  if (i === 0) {
                    leftH = true
                    topH = true
                    botH = false
                  } else if (i === 1) {
                    topH = true
                    botH = false
                  }
                } else if (series === 'alkuna') {
                  if (i === 0) {
                    leftH = true
                    topH = false
                    botH = false
                  } else if (i === 1) {
                    leftH = false
                    topH = false
                    botH = false
                  }
                }

                // If Isomer mode on n=4 or 5: branch on carbon #2
                const isBranchedC2 = series === 'isomer' && i === 1 && effectiveN >= 4

                return (
                  <g key={`c-group-${i}`}>
                    {/* Top H */}
                    {topH && !isBranchedC2 && (
                      <g>
                        <line x1={cx} y1={cy - 18} x2={cx} y2={cy - 45} stroke="#64748B" strokeWidth={2} />
                        <circle cx={cx} cy={cy - 52} r={12} fill="url(#hydrogenGradient)" stroke="#94A3B8" strokeWidth={1.5} />
                        <text x={cx} y={cy - 48} textAnchor="middle" fill="#0F172A" fontSize={11} fontWeight="bold">H</text>
                      </g>
                    )}

                    {/* Bottom H */}
                    {botH && (
                      <g>
                        <line x1={cx} y1={cy + 18} x2={cx} y2={cy + 45} stroke="#64748B" strokeWidth={2} />
                        <circle cx={cx} cy={cy + 52} r={12} fill="url(#hydrogenGradient)" stroke="#94A3B8" strokeWidth={1.5} />
                        <text x={cx} y={cy + 56} textAnchor="middle" fill="#0F172A" fontSize={11} fontWeight="bold">H</text>
                      </g>
                    )}

                    {/* Left H */}
                    {leftH && (
                      <g>
                        <line x1={cx - 18} y1={cy} x2={cx - 45} y2={cy} stroke="#64748B" strokeWidth={2} />
                        <circle cx={cx - 52} cy={cy} r={12} fill="url(#hydrogenGradient)" stroke="#94A3B8" strokeWidth={1.5} />
                        <text x={cx - 52} y={cy + 4} textAnchor="middle" fill="#0F172A" fontSize={11} fontWeight="bold">H</text>
                      </g>
                    )}

                    {/* Right H */}
                    {rightH && (
                      <g>
                        <line x1={cx + 18} y1={cy} x2={cx + 45} y2={cy} stroke="#64748B" strokeWidth={2} />
                        <circle cx={cx + 52} cy={cy} r={12} fill="url(#hydrogenGradient)" stroke="#94A3B8" strokeWidth={1.5} />
                        <text x={cx + 52} y={cy + 4} textAnchor="middle" fill="#0F172A" fontSize={11} fontWeight="bold">H</text>
                      </g>
                    )}

                    {/* Isomer Branch (Methyl -CH3 on top of C2) */}
                    {isBranchedC2 && (
                      <g>
                        <line x1={cx} y1={cy - 18} x2={cx} y2={cy - 45} stroke="#5DE0E6" strokeWidth={3} />
                        <circle cx={cx} cy={cy - 55} r={18} fill="url(#carbonGradient)" stroke="#5DE0E6" strokeWidth={2} />
                        <text x={cx} y={cy - 50} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontWeight="900">C</text>
                        <text x={cx + 25} y={cy - 52} fill="#5DE0E6" fontSize={10} fontWeight="bold">CH₃</text>
                      </g>
                    )}

                    {/* Main Carbon Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill="url(#carbonGradient)"
                      stroke="#5DE0E6"
                      strokeWidth={2}
                      filter="url(#glow)"
                    />
                    <text
                      x={cx}
                      y={cy + 5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={14}
                      fontWeight="900"
                    >
                      C
                    </text>

                    {/* IUPAC Carbon Number Badge */}
                    <rect
                      x={cx - 9}
                      y={cy + 18}
                      width={18}
                      height={13}
                      rx={4}
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth={1}
                    />
                    <text
                      x={cx}
                      y={cy + 28}
                      textAnchor="middle"
                      fill="#38BDF8"
                      fontSize={9}
                      fontWeight="bold"
                    >
                      {i + 1}
                    </text>
                  </g>
                )
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Condensed Formula Display */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-bold text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5DE0E6]" />
          Rumus Struktur Terkondensasi:
        </span>
        <span className="font-mono font-bold text-teal-300 text-sm sm:text-base">
          {activeCondensed}
        </span>
      </div>

      {/* Interactive Controls & Slider */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5DE0E6]" />
            Atur Panjang Rantai Karbon (n = 1 s/d 10):
          </span>
          <span className="text-sm font-extrabold text-[#5DE0E6] bg-slate-900 px-3 py-1 rounded-xl border border-slate-700">
            {carbonCount} Atom Karbon (C)
          </span>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCarbonCount((prev) => Math.max(series === 'alkena' || series === 'alkuna' ? 2 : 1, prev - 1))}
            disabled={carbonCount <= (series === 'alkena' || series === 'alkuna' ? 2 : 1)}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <input
            type="range"
            min={series === 'alkena' || series === 'alkuna' ? 2 : 1}
            max={10}
            value={carbonCount}
            onChange={(e) => setCarbonCount(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1DAA9A]"
          />

          <button
            onClick={() => setCarbonCount((prev) => Math.min(10, prev + 1))}
            disabled={carbonCount >= 10}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-white transition-colors shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Number Pills & Play Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: 10 }).map((_, idx) => {
              const val = idx + 1
              const disabled = (series === 'alkena' || series === 'alkuna') && val < 2
              return (
                <button
                  key={val}
                  onClick={() => setCarbonCount(val)}
                  disabled={disabled}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    carbonCount === val
                      ? 'bg-[#1DAA9A] text-white ring-2 ring-[#5DE0E6]'
                      : disabled
                        ? 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1DAA9A] hover:bg-[#168a7d] text-white text-xs font-bold transition-colors shadow-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Jeda Animasi' : 'Animasi Rantai'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false)
                setCarbonCount(1)
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              title="Reset ke Metana"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Description Callout */}
      <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-[#5DE0E6] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Catatan Kimiawi Seri Homolog:</span>
          {displayItem.description}
        </div>
      </div>
    </div>
  )
}
