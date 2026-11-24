import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, XCircle, Trophy, Calendar, Award } from 'lucide-react'
import type { QuizResult } from '../../types/quiz'
import { formatChemicalText } from '../ChemicalFormula'

interface QuizResultDetailModalProps {
  result: QuizResult | null
  onClose: () => void
}

export default function QuizResultDetailModal({
  result,
  onClose,
}: QuizResultDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!result) return

    // 1. Simpan elemen yang sedang aktif/fokus sebelum modal terbuka (Focus Restoration)
    previousActiveElementRef.current = document.activeElement as HTMLElement | null

    // 2. Kunci scroll body dan buat elemen latar belakang non-interaktif
    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const rootEl = document.getElementById('root')
    const originalAriaHidden = rootEl?.getAttribute('aria-hidden')
    const originalInert = rootEl?.hasAttribute('inert')

    if (rootEl) {
      rootEl.setAttribute('aria-hidden', 'true')
      rootEl.setAttribute('inert', '')
    }

    // 3. Pindahkan fokus awal ke elemen interaktif pertama (tombol tutup) atau kontainer modal
    const focusTimer = window.setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      } else if (modalRef.current) {
        modalRef.current.focus()
      }
    }, 0)

    // 4. Keyboard Listener: Escape untuk menutup modal & Focus Trap untuk Tab / Shift+Tab
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return

        const focusableSelector =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0)

        if (focusableElements.length === 0) {
          e.preventDefault()
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift + Tab: jika di elemen pertama, putar ke elemen terakhir
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab: jika di elemen terakhir, putar ke elemen pertama
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)

      // Pulihkan style scroll body
      document.body.style.overflow = originalBodyOverflow

      // Pulihkan atribut pada root latar belakang
      if (rootEl) {
        if (originalAriaHidden !== null && originalAriaHidden !== undefined) {
          rootEl.setAttribute('aria-hidden', originalAriaHidden)
        } else {
          rootEl.removeAttribute('aria-hidden')
        }

        if (originalInert) {
          rootEl.setAttribute('inert', '')
        } else {
          rootEl.removeAttribute('inert')
        }
      }

      // Kembalikan fokus ke elemen pemicu sebelumnya
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus()
      }
    }
  }, [result, onClose])

  if (!result) return null

  const formattedDate = new Date(result.completedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Penanganan klik backdrop luar untuk menutup modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-detail-title"
      aria-label="Detail Hasil Kuis"
      tabIndex={-1}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in outline-none"
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#101C3A] to-[#152852] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-[#5DE0E6] text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              Detail Riwayat Pengerjaan
            </div>
            <h2 id="quiz-detail-title" className="text-xl font-extrabold tracking-tight">
              {result.quizTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClose()
              }
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup detail kuis"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Summary Banner */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Skor Akhir</span>
            <span
              className={`text-2xl font-black ${
                result.score >= 70 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {result.score}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Jawaban Benar</span>
            <span className="text-2xl font-black text-emerald-600">
              {result.correctAnswers} <span className="text-xs text-slate-400 font-normal">/ {result.totalQuestions}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Jawaban Salah</span>
            <span className="text-2xl font-black text-rose-500">
              {result.incorrectAnswers}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Status</span>
            <span
              className={`text-xs font-extrabold px-2 py-1 rounded-full inline-block mt-1 ${
                result.score >= 70
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {result.score >= 70 ? 'Lulus Kompeten' : 'Perlu Remedial'}
            </span>
          </div>
        </div>

        {/* Scrollable Questions List with Selected & Correct Answers */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Rincian Jawaban Soal"
          className="p-6 overflow-y-auto space-y-6 focus:outline-hidden focus:ring-1 focus:ring-teal-400"
        >
          <h3 className="font-bold text-sm text-[#101C3A] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#1DAA9A]" />
            Rincian Jawaban Soal:
          </h3>

          <div className="space-y-4">
            {result.answers.map((ans, idx) => (
              <div
                key={ans.questionId || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  ans.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-rose-200 bg-rose-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      Soal #{idx + 1}
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {ans.category}
                    </span>
                  </div>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      ans.isCorrect ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {ans.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Salah
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-bold text-[#101C3A] my-3 leading-relaxed">
                  {formatChemicalText(ans.questionText)}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-slate-500 shrink-0">Jawaban Anda:</span>
                    <span
                      className={`font-semibold ${
                        ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatChemicalText(ans.selectedAnswer || '(Tidak dijawab)')}
                    </span>
                  </div>

                  {!ans.isCorrect && (
                    <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-start gap-2">
                      <span className="font-bold text-emerald-800 shrink-0">Kunci Jawaban:</span>
                      <span className="font-bold text-emerald-800">
                        {formatChemicalText(ans.correctAnswer)}
                      </span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                    <span className="font-bold text-[#101C3A] block">Pembahasan Ilmiah:</span>
                    <div className="leading-relaxed text-slate-700">
                      {formatChemicalText(ans.explanation)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer with Close Button & Keyboard Hint */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold">Esc</kbd> untuk menutup
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}
