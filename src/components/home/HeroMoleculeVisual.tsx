import { useState } from 'react'
import { Zap, Info } from 'lucide-react'

export default function HeroMoleculeVisual() {
  const [selectedAtom, setSelectedAtom] = useState<string>('carbon')
  const [activeModel, setActiveModel] = useState<'tetrahedral' | 'planar'>('tetrahedral')

  const getAtomDetail = () => {
    if (selectedAtom === 'carbon') {
      return 'Atom Karbon (C, Z=6): Memiliki 4 elektron valensi yang berpasangan membentuk 4 ikatan kovalen stabil.'
    }
    return 'Atom Hidrogen (H, Z=1): Memiliki 1 elektron valensi yang berpasangan tunggal dengan elektron karbon (duplet stabil).'
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient Science Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-[#101C3A] text-white p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Top Header Card */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#5DE0E6] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
              Model Struktur Atom Karbon
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/70 text-[11px]">
            <button
              onClick={() => {
                setActiveModel('tetrahedral')
                setSelectedAtom('carbon')
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeModel === 'tetrahedral'
                  ? 'bg-[#1DAA9A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              sp³ Tetrahedral
            </button>
            <button
              onClick={() => {
                setActiveModel('planar')
                setSelectedAtom('carbon')
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeModel === 'planar'
                  ? 'bg-[#1DAA9A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              sp² Planar
            </button>
          </div>
        </div>

        {/* SVG Interactive Molecular Canvas */}
        <div className="relative w-full h-[280px] flex items-center justify-center">
          {/* Orbital rings */}
          <div className="absolute w-56 h-56 rounded-full border border-teal-500/20 animate-orbit-slow pointer-events-none" />
          <div className="absolute w-44 h-44 rounded-full border border-cyan-400/25 border-dashed animate-orbit-reverse pointer-events-none" />

          <svg viewBox="0 0 340 260" className="w-full h-full select-none">
            {activeModel === 'tetrahedral' ? (
              /* Tetrahedral Model (Metana, CH4) */
              <g>
                {/* Bonds */}
                <line x1="170" y1="130" x2="170" y2="40" stroke="#5DE0E6" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="130" x2="260" y2="175" stroke="#5DE0E6" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="130" x2="80" y2="175" stroke="#5DE0E6" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="130" x2="170" y2="220" stroke="#5DE0E6" strokeWidth="3" strokeDasharray="5,4" strokeLinecap="round" />

                {/* Hydrogen 1 (Top) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedAtom('h1')}
                >
                  <circle cx="170" cy="40" r="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
                  <text x="170" y="44" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="bold">H</text>
                </g>

                {/* Hydrogen 2 (Right) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedAtom('h2')}
                >
                  <circle cx="260" cy="175" r="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
                  <text x="260" y="179" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="bold">H</text>
                </g>

                {/* Hydrogen 3 (Left) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedAtom('h3')}
                >
                  <circle cx="80" cy="175" r="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
                  <text x="80" y="179" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="bold">H</text>
                </g>

                {/* Hydrogen 4 (Front-wedge projection) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedAtom('h4')}
                >
                  <circle cx="170" cy="220" r="17" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" opacity="0.9" />
                  <text x="170" y="224" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">H</text>
                </g>

                {/* Central Carbon Atom */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedAtom('carbon')}
                >
                  <circle cx="170" cy="130" r="30" fill="#0A1124" stroke="#5DE0E6" strokeWidth="3" />
                  <circle cx="170" cy="130" r="38" fill="none" stroke="#1DAA9A" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <text x="170" y="135" textAnchor="middle" fill="#5DE0E6" fontSize="16" fontWeight="bold">C</text>
                </g>
              </g>
            ) : (
              /* Planar Model (Etena, C2H4) */
              <g>
                {/* Double Bond between C1 and C2 */}
                <line x1="125" y1="124" x2="215" y2="124" stroke="#5DE0E6" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="125" y1="136" x2="215" y2="136" stroke="#5DE0E6" strokeWidth="3.5" strokeLinecap="round" />

                {/* C1 bonds */}
                <line x1="125" y1="130" x2="60" y2="70" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="125" y1="130" x2="60" y2="190" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                {/* C2 bonds */}
                <line x1="215" y1="130" x2="280" y2="70" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="215" y1="130" x2="280" y2="190" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                {/* H atoms */}
                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('h1')}>
                  <circle cx="60" cy="70" r="16" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <text x="60" y="74" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">H</text>
                </g>

                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('h2')}>
                  <circle cx="60" cy="190" r="16" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <text x="60" y="194" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">H</text>
                </g>

                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('h3')}>
                  <circle cx="280" cy="70" r="16" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <text x="280" y="74" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">H</text>
                </g>

                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('h4')}>
                  <circle cx="280" cy="190" r="16" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <text x="280" y="194" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">H</text>
                </g>

                {/* Carbon 1 */}
                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('carbon')}>
                  <circle cx="125" cy="130" r="26" fill="#0A1124" stroke="#5DE0E6" strokeWidth="3" />
                  <text x="125" y="135" textAnchor="middle" fill="#5DE0E6" fontSize="15" fontWeight="bold">C</text>
                </g>

                {/* Carbon 2 */}
                <g className="cursor-pointer hover:scale-110" onClick={() => setSelectedAtom('carbon')}>
                  <circle cx="215" cy="130" r="26" fill="#0A1124" stroke="#5DE0E6" strokeWidth="3" />
                  <text x="215" y="135" textAnchor="middle" fill="#5DE0E6" fontSize="15" fontWeight="bold">C</text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Dynamic Concept Info Footer */}
        <div className="mt-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold flex items-center gap-1.5 text-[#5DE0E6]">
              <Zap className="w-3.5 h-3.5" />
              {activeModel === 'tetrahedral' ? 'Kekhasan Tetravalensi (CH₄)' : 'Ikatan Rangkap Dua (C₂H₄)'}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 text-[#24c6b4] border border-teal-500/20">
              {activeModel === 'tetrahedral' ? 'Sudut: 109.5°' : 'Sudut: 120° Planar'}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1DAA9A] shrink-0 mt-0.5" />
            <span>{getAtomDetail()}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
