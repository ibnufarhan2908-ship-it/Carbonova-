import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, X, LogIn, ArrowRight } from 'lucide-react'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
  message?: string
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  redirectPath = '/latihan',
  message = 'Silakan masuk (login) terlebih dahulu menggunakan akun siswa untuk mengerjakan dan mengirimkan jawaban latihan soal.',
}: LoginRequiredModalProps) {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap, Escape key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement

    // Prevent background scroll when modal is active
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

    // Initial focus on primary action button
    const timer = setTimeout(() => {
      const loginBtn = modalRef.current?.querySelector<HTMLElement>('#btn-modal-login')
      loginBtn?.focus()
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
    navigate('/login', {
      state: {
        from: redirectPath,
        message,
      },
    })
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/90 text-center space-y-5 animate-in zoom-in-95 duration-200"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <GraduationCap className="w-7 h-7 text-[#101C3A]" />
        </div>

        {/* Modal Header */}
        <div className="space-y-2">
          <h3
            id="login-required-title"
            className="text-lg sm:text-xl font-extrabold text-[#101C3A] tracking-tight"
          >
            Akses Masuk Diperlukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 text-left space-y-2">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Dengan Masuk Menggunakan Akun Siswa:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Mengerjakan seluruh bank latihan soal evaluasi HOTS</li>
            <li>Menyimpan skor & riwayat pengerjaan otomatis</li>
            <li>Melihat pembahasan dan umpan balik konsep mendalam</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            id="btn-modal-login"
            onClick={handleLoginClick}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#5DE0E6]" />
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
