import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Atom,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Autofill credential demo
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setValidationErrors({})
    setAuthError(null)
  }

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Format alamat email tidak valid.'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        // Cek tujuan redirect
        const stateFrom = (location.state as { from?: string })?.from
        if (stateFrom && !stateFrom.startsWith('/login')) {
          navigate(stateFrom, { replace: true })
        } else {
          // Redirect ke dashboard sesuai role yang baru login
          if (email.toLowerCase().includes('guru')) {
            navigate('/guru/dashboard', { replace: true })
          } else {
            navigate('/siswa/dashboard', { replace: true })
          }
        }
      } else {
        setAuthError(result.error || 'Email atau kata sandi tidak sesuai.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setAuthError('Terjadi kesalahan saat memproses login. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#101C3A] via-[#152a57] to-[#1DAA9A] p-[2.5px] shadow-lg shadow-teal-900/10 mb-1">
            <div className="w-full h-full bg-[#101C3A] rounded-[13px] flex items-center justify-center">
              <Atom className="w-8 h-8 text-[#5DE0E6] animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#101C3A] flex items-center justify-center gap-1.5">
              Carbonova
              <span className="w-2.5 h-2.5 rounded-full bg-[#1DAA9A] inline-block"></span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Portal Pembelajaran Kimia Karbon SMA & LMS
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#101C3A]">Masuk ke Akun</h2>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan email dan kata sandi terdaftar untuk mengakses materi dan dashboard pembelajaran.
            </p>
          </div>

          {/* Alert Error Box */}
          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-800">Autentikasi Gagal</p>
                <p className="text-xs text-rose-700 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: undefined }))
                    }
                  }}
                  placeholder="contoh: nama@carbonova.test"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="email"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1">
                  <span>•</span> {validationErrors.email}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi
                </label>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: undefined }))
                    }
                  }}
                  placeholder="Masukkan kata sandi akun"
                  className={`block w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1">
                  <span>•</span> {validationErrors.password}
                </p>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#101C3A] to-[#152a57] hover:from-[#152a57] hover:to-[#1a346e] text-white text-sm font-bold shadow-md shadow-slate-900/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#1DAA9A] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4 text-[#5DE0E6]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Section Akun Demo Sesuai Spesifikasi PRD / Permintaan */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1DAA9A]" />
                Akun Demo Terdaftar
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Klik untuk Isi Otomatis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Tombol Demo Guru */}
              <button
                type="button"
                onClick={() => fillCredentials('guru.demo@carbonova.test', 'GuruDemo123!')}
                className="p-3 text-left rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-teal-50/60 hover:border-teal-300 transition-all group focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#1DAA9A]" />
                    <span className="text-xs font-bold text-[#101C3A] group-hover:text-teal-900">
                      Guru Demo
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800">
                    Teacher
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  guru.demo@carbonova.test
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-teal-700 group-hover:underline">
                  Isi Formulir Guru →
                </span>
              </button>

              {/* Tombol Demo Siswa */}
              <button
                type="button"
                onClick={() => fillCredentials('siswa.demo@carbonova.test', 'SiswaDemo123!')}
                className="p-3 text-left rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-cyan-50/60 hover:border-cyan-300 transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#101C3A]" />
                    <span className="text-xs font-bold text-[#101C3A] group-hover:text-cyan-900">
                      Siswa Demo
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  siswa.demo@carbonova.test
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-cyan-700 group-hover:underline">
                  Isi Formulir Siswa →
                </span>
              </button>
            </div>

            {/* Catatan Keamanan */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DAA9A]" />
              <span>Autentikasi terenkripsi PBKDF2-HMAC-SHA256 & Salt unik</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

