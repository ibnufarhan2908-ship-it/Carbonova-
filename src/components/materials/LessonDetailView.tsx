import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Atom, Sparkles } from 'lucide-react'
import type { DetailedLesson } from '../../types/chemistry'
import NameMoleculeWidget from './NameMoleculeWidget'

interface LessonDetailViewProps {
  lesson: DetailedLesson
  onBack: () => void
  onSelectModule: (slug: string) => void
  nextSlug?: string
  prevSlug?: string
}

export default function LessonDetailView({
  lesson,
  onBack,
  onSelectModule,
  nextSlug,
  prevSlug,
}: LessonDetailViewProps) {
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
          {lesson.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">{lesson.subtitle}</p>

        {/* Introduction Box */}
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 text-xs sm:text-sm leading-relaxed space-y-1">
          <span className="font-bold text-[#101C3A] flex items-center gap-2 text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1DAA9A]" />
            Pengantar Konseptual:
          </span>
          <p className="text-slate-700 leading-relaxed pt-1">{lesson.introduction}</p>
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
              {sec.title}
            </h2>

            {/* Content text */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {sec.content}
            </div>

            {/* Formula Block if present */}
            {sec.formula && (
              <div className="p-4 rounded-xl bg-slate-900 text-[#5DE0E6] font-mono text-xs sm:text-sm font-bold border border-slate-800 overflow-x-auto shadow-inner">
                {sec.formula}
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
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {sec.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3">
                            {cell}
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
                {sec.highlight}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Embedded Interactive Widget for Name This Molecule */}
      {lesson.interactiveWidgetType === 'name-molecule' && (
        <section className="space-y-3">
          <NameMoleculeWidget />
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
              <span>{point}</span>
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

