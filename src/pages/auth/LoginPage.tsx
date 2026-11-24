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
  GraduationCap,
  User,
  UserPlus,
  Cloud,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'
import { isTeacherEmail } from '../../config/authConfig'

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, register, isFirebaseActive } = useAuth()

  // Tab mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [kelas, setKelas] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Hak Akses AD11-01: Pendaftaran publik selalu 'student' secara default
  const role: UserRole = 'student'
  const [showPassword, setShowPassword] = useState(false)

  // Status & feedback
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Notifikasi dari pengalihan akses fitur terkunci (misal: Latihan Soal / Riwayat Kuis)
  const stateNotice = (location.state as { message?: string })?.message
  const [authNotice] = useState<string | null>(stateNotice || null)

  const validateForm = (): boolean => {
    const errors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (mode === 'register') {
      if (!name.trim()) {
        errors.name = 'Nama lengkap wajib diisi.'
      } else if (name.trim().length < 2) {
        errors.name = 'Nama minimal 2 karakter.'
      }
    }

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Format alamat email tidak valid.'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.'
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        errors.confirmPassword = 'Ulangi kata sandi Anda.'
      } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Kata sandi dan konfirmasi tidak cocok.'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRedirect = (userRole?: UserRole, userEmail?: string) => {
    const stateFrom = (location.state as { from?: string })?.from
    if (stateFrom && !stateFrom.startsWith('/login')) {
      navigate(stateFrom, { replace: true })
      return
    }

    const checkEmail = userEmail || email
    // Hak Akses AD11-01: Akses guru hanya diberikan jika role teacher dan email terverifikasi whitelist guru
    if (userRole === 'teacher' || (!userRole && isTeacherEmail(checkEmail))) {
      navigate('/guru/dashboard', { replace: true })
    } else {
      navigate('/siswa/dashboard', { replace: true })
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthError(null)
    setAuthSuccess(null)
    setIsGoogleLoading(true)

    try {
      const result = await loginWithGoogle()
      if (result.success && result.user) {
        setAuthSuccess('Berhasil masuk dengan Google! Mengalihkan ke dashboard...')
        setTimeout(() => {
          handleRedirect(result.user?.role, result.user?.email)
        }, 500)
      } else if (result.error) {
        setAuthError(result.error)
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err)
      setAuthError(err?.message || 'Terjadi kesalahan saat masuk dengan Google.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthSuccess(null)

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (result.success) {
          handleRedirect()
        } else {
          setAuthError(result.error || 'Email atau kata sandi tidak sesuai.')
        }
      } else {
        // Mode Register (AD11-01: Dipaksa selalu student)
        const result = await register(name, email, password, 'student', kelas || 'XI MIPA 1')
        if (result.success) {
          setAuthSuccess('Pendaftaran berhasil! Mengalihkan ke dashboard...')
          setTimeout(() => {
            handleRedirect('student')
          }, 600)
        } else {
          setAuthError(result.error || 'Gagal mendaftar akun. Silakan periksa kembali data Anda.')
        }
      }
    } catch (err) {
      console.error('Auth submit error:', err)
      setAuthError('Terjadi kesalahan saat memproses permintaan. Silakan coba kembali.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <div className="mt-7 bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {/* Status Indikator Firebase / Lokal */}
          <div className="mb-5">
            {isFirebaseActive ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-medium">
                <Cloud className="w-4 h-4 text-[#1DAA9A] shrink-0" />
                <span className="truncate">
                  <strong className="font-semibold">Firebase Cloud Aktif:</strong> Auth & Firestore terhubung
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">
                  <strong className="font-semibold">Mode Lokal Aktif:</strong> Terenkripsi PBKDF2 & penyimpanan lokal
                </span>
              </div>
            )}
          </div>

          {/* Mode Switcher Tabs (Masuk vs Daftar) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setAuthError(null)
                setAuthSuccess(null)
                setValidationErrors({})
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setAuthError(null)
                setAuthSuccess(null)
                setValidationErrors({})
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#101C3A]">
              {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Pembelajaran'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'Gunakan email dan kata sandi terdaftar untuk masuk ke portal.'
                : 'Daftarkan diri Anda sebagai Siswa atau Guru untuk mulai menggunakan platform.'}
            </p>
          </div>

          {/* Alert Error Box */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-800">
                  {mode === 'login' ? 'Autentikasi Gagal' : 'Pendaftaran Gagal'}
                </p>
                <p className="text-xs text-rose-700 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* Banner Peringatan: Akses Fitur Terkunci (Latihan Soal / Riwayat) */}
          {authNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-2xs animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-900">Akses Masuk Diperlukan</p>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{authNotice}</p>
              </div>
            </div>
          )}

          {/* Alert Success Box */}
          {authSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-teal-800">Berhasil</p>
                <p className="text-xs text-teal-700 mt-0.5">{authSuccess}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Field Nama (Mode Register) */}
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Nama Lengkap
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (validationErrors.name) {
                        setValidationErrors((prev) => ({ ...prev, name: undefined }))
                      }
                    }}
                    placeholder="Contoh: Budi Santoso atau Ibu Siti, M.Pd."
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                    }`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1">
                    <span>•</span> {validationErrors.name}
                  </p>
                )}
              </div>
            )}

            {/* Field Kelas (Mode Register untuk Siswa) */}
            {mode === 'register' && role === 'student' && (
              <div>
                <label
                  htmlFor="kelas"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Kelas
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="kelas"
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XI MIPA 1 atau XI-B"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100 transition-all"
                  />
                </div>
              </div>
            )}


            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
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
                  placeholder="contoh: nama@sekolah.sch.id"
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
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Kata Sandi
              </label>
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
                  placeholder="Minimal 6 karakter"
                  className={`block w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
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

            {/* Input Confirm Password (Mode Register) */}
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (validationErrors.confirmPassword) {
                        setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                      }
                    }}
                    placeholder="Ulangi kata sandi di atas"
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.confirmPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                    }`}
                    autoComplete="new-password"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1">
                    <span>•</span> {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

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
                    <span>
                      {mode === 'login' ? 'Memverifikasi Akun...' : 'Mendaftarkan Akun...'}
                    </span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4 text-[#5DE0E6]" />
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#5DE0E6]" />
                    <span>Daftar Akun Sekarang</span>
                  </>
                )}
              </button>
            </div>

            {/* Pemisah Visual "atau" */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-semibold text-slate-400">
                  atau
                </span>
              </div>
            </div>

            {/* Tombol Masuk dengan Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4.5 h-4.5 shrink-0" />
                  <span>
                    {mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}
                  </span>
                </>
              )}
            </button>

            {/* Navigasi ganti tab bawah */}
            <div className="text-center pt-1">
              {mode === 'login' ? (
                <p className="text-xs text-slate-500">
                  Belum memiliki akun terdaftar?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className="font-bold text-[#1DAA9A] hover:underline cursor-pointer"
                  >
                    Daftar Akun Baru
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className="font-bold text-[#1DAA9A] hover:underline cursor-pointer"
                  >
                    Masuk ke Akun
                  </button>
                </p>
              )}
            </div>
          </form>

          {/* Catatan Keamanan */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1DAA9A]" />
            <span>Autentikasi terenkripsi & Cloud Firestore</span>
          </div>
        </div>
      </div>
    </div>
  )
}
