import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Atom,
  BookOpen,
  GraduationCap,
  TrendingUp,
  X,
  LogIn,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap, Escape key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const timer = setTimeout(() => {
      const exploreBtn = modalRef.current?.querySelector<HTMLElement>('#btn-welcome-explore')
      exploreBtn?.focus()
    }, 50)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const handleLoginClick = () => {
    onClose()
    navigate('/login')
  }

  const features = [
    {
      title: 'Materi Interaktif',
      tag: 'Materi',
      description:
        'Modul pembelajaran terstruktur mencakup kekhasan atom karbon, hidrokarbon, isomer, hingga turunan alkana sesuai standar IUPAC.',
      icon: BookOpen,
      iconBg: 'bg-teal-50',
      iconColor: 'text-[#1DAA9A]',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/60',
    },
    {
      title: 'Latihan Soal & Evaluasi',
      tag: 'Kuis',
      description:
        'Bank soal penalaran kimia HOTS berbasis stimulus data lengkap dengan kunci jawaban, pembahasan konsep, dan penilaian langsung.',
      icon: GraduationCap,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    },
    {
      title: 'Pemantauan Hasil Belajar',
      tag: 'Progres Belajar',
      description:
        'Pelacakan modul yang telah dipelajari serta riwayat pengerjaan kuis tersimpan secara otomatis dan aman di browser Anda (localStorage).',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
  ]

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200/90 text-left space-y-6 animate-in zoom-in-95 duration-200"
        tabIndex={-1}
      >
        {/* Tombol X untuk menutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup popup perkenalan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Bagian Atas */}
        <div className="space-y-3 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
            <Atom className="w-4 h-4 text-[#1DAA9A]" />
            <span>Platform Pembelajaran Kimia Karbon SMA/MA</span>
          </div>
          <h2
            id="welcome-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight leading-tight"
          >
            Selamat Datang di Carbonova
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Carbonova adalah platform pembelajaran interaktif kimia senyawa karbon yang dirancang untuk membantu siswa memahami struktur tiga dimensi, kekhasan atom karbon, tata nama IUPAC, serta reaktivitas reaksi organik secara mendalam tanpa sekadar menghafal rumus.
          </p>
        </div>

        {/* 3 Fitur Utama */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#1DAA9A]" />
            <span>3 Fitur Utama</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {features.map((feat) => (
              <div
                key={feat.tag}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3.5 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#101C3A] truncate">{feat.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${feat.badgeColor}`}
                    >
                      {feat.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="pt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#1DAA9A]" />
            <span>Login / Daftar</span>
          </button>

          <button
            type="button"
            id="btn-welcome-explore"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Mulai Jelajahi</span>
            <ArrowRight className="w-4 h-4 text-[#5DE0E6]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
