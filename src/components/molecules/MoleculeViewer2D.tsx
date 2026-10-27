import { useState } from 'react'
import type { Molecule, AtomType } from '../../types/chemistry'
import { Eye, Info } from 'lucide-react'

interface MoleculeViewer2DProps {
  molecule: Molecule
  showControls?: boolean
  className?: string
  height?: number
}

export default function MoleculeViewer2D({
  molecule,
  showControls = true,
  className = '',
  height = 320,
}: MoleculeViewer2DProps) {
  const [viewMode, setViewMode] = useState<'ball-and-stick' | 'structural'>('ball-and-stick')
  const [hoveredAtom, setHoveredAtom] = useState<string | null>(null)

  // Color mapping based on standard chemistry convention & Carbonova palette
  const getAtomColor = (element: AtomType) => {
    switch (element) {
      case 'C':
        return {
          fill: '#101C3A',
          stroke: '#5DE0E6',
          text: '#FFFFFF',
          label: 'Karbon (Valensi 4)',
        }
      case 'H':
        return {
          fill: '#FFFFFF',
          stroke: '#94A3B8',
          text: '#1E293B',
          label: 'Hidrogen (Valensi 1)',
        }
      case 'O':
        return {
          fill: '#EF4444',
          stroke: '#FCA5A5',
          text: '#FFFFFF',
          label: 'Oksigen (Valensi 2)',
        }
      case 'N':
        return {
          fill: '#3B82F6',
          stroke: '#93C5FD',
          text: '#FFFFFF',
          label: 'Nitrogen (Valensi 3)',
        }
      default:
        return {
          fill: '#64748B',
          stroke: '#CBD5E1',
          text: '#FFFFFF',
          label: element,
        }
    }
  }

  // Find atom by ID
  const atomMap = new Map(molecule.atoms.map((a) => [a.id, a]))

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden ${className}`}>
      {/* Top Header / Mode Switcher */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{molecule.name}</span>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
              {molecule.formula}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode(viewMode === 'ball-and-stick' ? 'structural' : 'ball-and-stick')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-medium transition-all shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>{viewMode === 'ball-and-stick' ? 'Model Bola-Tongkat' : 'Rumus Struktur'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative w-full flex items-center justify-center bg-radial from-slate-50 to-white" style={{ height }}>
        {/* Subtle grid pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#CBD5E1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Molecular Drawing */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full max-h-[300px] select-none transition-transform duration-300"
        >
          {/* Render Chemical Bonds */}
          {molecule.bonds.map((bond, idx) => {
            const from = atomMap.get(bond.from)
            const to = atomMap.get(bond.to)
            if (!from || !to) return null

            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len === 0) return null

            // Perpendicular unit vector for double/triple bonds
            const ux = -dy / len
            const uy = dx / len

            if (bond.order === 1) {
              return (
                <line
                  key={`bond-${idx}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#475569"
                  strokeWidth={viewMode === 'ball-and-stick' ? 4 : 2.5}
                  strokeLinecap="round"
                />
              )
            }

            if (bond.order === 2) {
              const offset = 4.5
              return (
                <g key={`bond-${idx}`}>
                  <line
                    x1={from.x + ux * offset}
                    y1={from.y + uy * offset}
                    x2={to.x + ux * offset}
                    y2={to.y + uy * offset}
                    stroke="#0F172A"
                    strokeWidth={viewMode === 'ball-and-stick' ? 3.5 : 2.5}
                    strokeLinecap="round"
                  />
                  <line
                    x1={from.x - ux * offset}
                    y1={from.y - uy * offset}
                    x2={to.x - ux * offset}
                    y2={to.y - uy * offset}
                    stroke="#0F172A"
                    strokeWidth={viewMode === 'ball-and-stick' ? 3.5 : 2.5}
                    strokeLinecap="round"
                  />
                </g>
              )
            }

            if (bond.order === 3) {
              const offset = 6
              return (
                <g key={`bond-${idx}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#0F172A"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <line
                    x1={from.x + ux * offset}
                    y1={from.y + uy * offset}
                    x2={to.x + ux * offset}
                    y2={to.y + uy * offset}
                    stroke="#0F172A"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <line
                    x1={from.x - ux * offset}
                    y1={from.y - uy * offset}
                    x2={to.x - ux * offset}
                    y2={to.y - uy * offset}
                    stroke="#0F172A"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </g>
              )
            }

            return null
          })}

          {/* Render Atoms */}
          {molecule.atoms.map((atom) => {
            const colors = getAtomColor(atom.element)
            const isCarbon = atom.element === 'C'
            const radius = viewMode === 'ball-and-stick' ? (isCarbon ? 20 : 15) : 17

            return (
              <g
                key={atom.id}
                transform={`translate(${atom.x}, ${atom.y})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-115"
                onMouseEnter={() => setHoveredAtom(colors.label)}
                onMouseLeave={() => setHoveredAtom(null)}
              >
                {/* Glow ring for hovered/carbon */}
                {isCarbon && (
                  <circle
                    r={radius + 4}
                    fill="none"
                    stroke="#5DE0E6"
                    strokeWidth={1.5}
                    opacity={0.7}
                    className="animate-pulse"
                  />
                )}

                {/* Main Atom Circle */}
                <circle
                  r={radius}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={2}
                  className="shadow-md"
                />

                {/* Chemical Symbol Text */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.text}
                  fontSize={viewMode === 'ball-and-stick' ? (isCarbon ? 13 : 11) : 13}
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {atom.element}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hovered Atom tooltip */}
        {hoveredAtom && (
          <div className="absolute top-3 left-4 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-1.5 animate-in fade-in">
            <Info className="w-3.5 h-3.5 text-[#5DE0E6]" />
            <span>{hoveredAtom}</span>
          </div>
        )}
      </div>

      {/* Atom Color Legend */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-600">Legenda Atom:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#101C3A] border border-[#5DE0E6] inline-block"></span>
            <span>C (Karbon)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block"></span>
            <span>H (Hidrogen)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block"></span>
            <span>O (Oksigen)</span>
          </div>
        </div>

        <span className="hidden sm:inline-block font-mono text-slate-400">
          Mr = {molecule.molecularWeight} g/mol
        </span>
      </div>
    </div>
  )
}
