import { useState } from 'react'
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Atom,
  Sparkles,
  ExternalLink,
  BookMarked,
  Rotate3d,
} from 'lucide-react'
import type { DetailedLesson, Molecule } from '../../types/chemistry'
import NameMoleculeWidget from './NameMoleculeWidget'
import ChainVisualizer from '../ChainVisualizer'
import Molecule3D from '../molecules/Molecule3D'
import ChemicalFormula, { formatChemicalText } from '../ChemicalFormula'
import { MOLECULES_DATA } from '../../data/molecules'

interface LessonDetailViewProps {
  lesson: DetailedLesson
  onBack: () => void
  onSelectModule: (slug: string) => void
  nextSlug?: string
  prevSlug?: string
}

// Map modules to related featured molecules in the 3D gallery
const MODULE_MOLECULE_MAP: Record<string, string[]> = {
  'kekhasan-atom-karbon': ['metana', 'etana', 'etena', 'etuna'],
  hidrokarbon: ['metana', 'etana', 'propana', 'butana', 'etena', 'etuna'],
  'tata-nama-senyawa-karbon': ['propana', 'butana', 'etena'],
  'gugus-fungsi': ['etanol', 'etanal', 'propanon', 'asam-etanoat', 'etil-etanoat'],
  'isomer-senyawa-karbon': ['butana', 'propana', 'etanol'],
  'sifat-dan-reaksi': ['metana', 'etena', 'etanol', 'asam-etanoat'],
}

export default function LessonDetailView({
  lesson,
  onBack,
  onSelectModule,
  nextSlug,
  prevSlug,
}: LessonDetailViewProps) {
  // Find related molecules for this module
  const relatedMoleculeIds = MODULE_MOLECULE_MAP[lesson.slug] || ['metana', 'etana', 'etanol']
  const relatedMolecules: Molecule[] = relatedMoleculeIds
    .map((id) => MOLECULES_DATA.find((m) => m.id === id))
    .filter((m): m is Molecule => Boolean(m))

  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(
    relatedMolecules[0]?.id || 'metana'
  )

  const activeMolecule =
    relatedMolecules.find((m) => m.id === selectedMoleculeId) || relatedMolecules[0]

  return (
    <article className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#101C3A] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Silabus Modul</span>
        </button>

        <div className="flex items-center gap-2">
          {prevSlug && (
            <button
              onClick={() => onSelectModule(prevSlug)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            >
              Modul Sebelumnya
            </button>
          )}
          {nextSlug && (
            <button
              onClick={() => onSelectModule(nextSlug)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#101C3A] text-white hover:bg-[#182852] flex items-center gap-1"
            >
              <span>Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 inline-flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5" />
            Modul {lesson.moduleNumber} — {lesson.category}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Kurikulum Kimia SMA
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight leading-tight">
          <ChemicalFormula>{lesson.title}</ChemicalFormula>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          <ChemicalFormula>{lesson.subtitle}</ChemicalFormula>
        </p>

        {/* Introduction Box with ChemicalFormula formatting */}
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 text-xs sm:text-sm leading-relaxed space-y-1">
          <span className="font-bold text-[#101C3A] flex items-center gap-2 text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1DAA9A]" />
            Pengantar Konseptual:
          </span>
          <div className="text-slate-700 leading-relaxed pt-1">
            {formatChemicalText(lesson.introduction)}
          </div>
        </div>
      </header>

      {/* Main Educational Content Sections */}
      <div className="space-y-8">
        {lesson.sections.map((sec, idx) => (
          <section
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-[#101C3A] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1DAA9A]" />
              {formatChemicalText(sec.title)}
            </h2>

            {/* Content text parsed with ChemicalFormula */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {formatChemicalText(sec.content)}
            </div>

            {/* Formula Block if present */}
            {sec.formula && (
              <div className="p-4 rounded-xl bg-slate-900 text-[#5DE0E6] font-mono text-xs sm:text-sm font-bold border border-slate-800 overflow-x-auto shadow-inner">
                <ChemicalFormula formula={sec.formula} />
              </div>
            )}

            {/* Table if present */}
            {sec.table && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 pt-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#101C3A] font-bold">
                      {sec.table.headers.map((h, i) => (
                        <th key={i} className="p-3">
                          {formatChemicalText(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {sec.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3">
                            {formatChemicalText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Highlight Callout if present */}
            {sec.highlight && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-[#101C3A] block mb-1">Catatan Penting:</span>
                <div>{formatChemicalText(sec.highlight)}</div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Embedded Interactive Widget: ChainVisualizer for Hydrocarbons & Chains */}
      {(lesson.interactiveWidgetType === 'chain-visualizer' || lesson.slug === 'hidrokarbon') && (
        <section className="space-y-3">
          <ChainVisualizer />
        </section>
      )}

      {/* Embedded Interactive Widget for Name This Molecule */}
      {lesson.interactiveWidgetType === 'name-molecule' && (
        <section className="space-y-3">
          <NameMoleculeWidget />
        </section>
      )}

      {/* Interactive 3D Molecule Viewer for this Module */}
      {activeMolecule && (
        <section className="space-y-4 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A] flex items-center gap-1.5">
                <Rotate3d className="w-4 h-4" />
                Visualisasi Struktur Molekul Terkait
              </span>
              <h3 className="text-lg font-bold text-[#101C3A]">
                Eksplorasi Molekul 3D
              </h3>
              <p className="text-xs text-slate-500">
                Putar bola dan batang untuk mengamati geometri ruang 3D.
              </p>
            </div>

            {/* Molecule Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {relatedMolecules.map((mol) => (
                <button
                  key={mol.id}
                  onClick={() => setSelectedMoleculeId(mol.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMoleculeId === mol.id
                      ? 'bg-[#101C3A] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {mol.name}
                </button>
              ))}
            </div>
          </div>

          <Molecule3D molecule={activeMolecule} height={340} />
        </section>
      )}

      {/* Kotak Sumber Belajar & Referensi Ilmiah */}
      {lesson.sources && lesson.sources.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5 text-[#1DAA9A]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#101C3A]">
                Sumber Belajar & Referensi Rujukan
              </h3>
              <p className="text-xs text-slate-500">
                Materi modul ini disusun mengacu pada literatur baku kimia universitas dan kurikulum nasional resmi:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {lesson.sources.map((src, sIdx) => (
              <a
                key={sIdx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAA9A] hover:shadow-sm transition-all flex items-start justify-between gap-3 text-left"
              >
                <div className="space-y-1 pr-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#101C3A] group-hover:text-[#1DAA9A] transition-colors leading-snug">
                    {src.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Penulis: {src.author} ({src.year})
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-[#1DAA9A] flex items-center justify-center shrink-0 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Summary Box */}
      <footer className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#101C3A] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1DAA9A]" />
          Ringkasan Intisari Pembelajaran:
        </h3>
        <ul className="space-y-2.5">
          {lesson.summaryPoints.map((point, pIdx) => (
            <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{formatChemicalText(point)}</span>
            </li>
          ))}
        </ul>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-600 hover:text-[#101C3A] transition-colors"
          >
            ← Kembali ke Katalog
          </button>
          {nextSlug && (
            <button
              onClick={() => onSelectModule(nextSlug)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] text-white text-xs font-bold hover:bg-[#182852] transition-colors shadow-2xs"
            >
              <span>Lanjut ke Modul Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}
