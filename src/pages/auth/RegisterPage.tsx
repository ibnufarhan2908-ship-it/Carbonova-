import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Atom,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  // State Form
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // State Validasi & Status
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    invitationCode?: string
  }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const errors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
      invitationCode?: string
    } = {}

    if (!name.trim()) {
      errors.name = 'Nama lengkap wajib diisi.'
    } else if (name.trim().length < 2) {
      errors.name = 'Nama lengkap minimal 2 karakter.'
    }

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Format alamat email tidak valid.'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter.'
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      errors.password = 'Kata sandi harus mengandung kombinasi huruf dan angka.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.'
    }

    if (selectedRole === 'teacher' && !invitationCode.trim()) {
      errors.invitationCode = 'Kode undangan guru wajib diisi untuk verifikasi pengajar.'
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
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role: selectedRole,
        invitationCode: selectedRole === 'teacher' ? invitationCode.trim() : undefined,
      })

      if (result.success) {
        // Redirect ke dashboard sesuai role yang baru terdaftar
        if (selectedRole === 'teacher') {
          navigate('/guru/dashboard', { replace: true })
        } else {
          navigate('/siswa/dashboard', { replace: true })
        }
      } else {
        setAuthError(result.error || 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setAuthError('Gagal memproses pendaftaran. Silakan coba kembali beberapa saat lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#101C3A] via-[#152a57] to-[#1DAA9A] p-[2px] shadow-lg shadow-teal-900/10 mb-1"
          >
            <div className="w-full h-full bg-[#101C3A] rounded-[13px] flex items-center justify-center">
              <Atom className="w-7 h-7 text-[#5DE0E6]" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101C3A] flex items-center justify-center gap-1.5">
            Carbonova
            <span className="w-2.5 h-2.5 rounded-full bg-[#1DAA9A] inline-block"></span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Pendaftaran Akun Baru LMS
          </p>
        </div>

        {/* Card Formulir Registrasi */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {/* Header Switcher Login / Register */}
          <div className="flex rounded-2xl bg-slate-100/80 p-1 mb-6 border border-slate-200/60">
            <Link
              to="/login"
              className="flex-1 py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors rounded-xl"
            >
              Masuk
            </Link>
            <div className="flex-1 py-2 text-center text-xs font-bold bg-white text-[#101C3A] rounded-xl shadow-xs">
              Daftar Akun Baru
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#101C3A]">Pilih Jenis Akun</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tentukan peran Anda di sistem pembelajaran Carbonova:
            </p>
          </div>

          {/* Role Selector Tabs (Siswa vs Guru) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student')
                setAuthError(null)
                setValidationErrors({})
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'border-[#1DAA9A] bg-teal-50/70 ring-2 ring-teal-200 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap
                  className={`w-4 h-4 ${
                    selectedRole === 'student' ? 'text-teal-700' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    selectedRole === 'student' ? 'text-teal-900' : 'text-slate-700'
                  }`}
                >
                  Siswa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Materi, lab virtual & latihan soal
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('teacher')
                setAuthError(null)
                setValidationErrors({})
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'border-[#101C3A] bg-slate-50 ring-2 ring-slate-300 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck
                  className={`w-4 h-4 ${
                    selectedRole === 'teacher' ? 'text-[#101C3A]' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    selectedRole === 'teacher' ? 'text-[#101C3A]' : 'text-slate-700'
                  }`}
                >
                  Guru
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Dashboard & pemantauan siswa
              </p>
            </button>
          </div>

          {/* Alert Error Box */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-800">Registrasi Gagal</p>
                <p className="text-xs text-rose-700 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* Form Registrasi */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Input Nama Lengkap */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (validationErrors.name) setValidationErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  placeholder="contoh: Ahmad Pratama"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.name
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="name"
                />
              </div>
              {validationErrors.name && (
                <p className="text-xs font-medium text-rose-600 mt-1">
                  • {validationErrors.name}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="nama@sekolah.sch.id"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="email"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs font-medium text-rose-600 mt-1">
                  • {validationErrors.email}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  placeholder="Minimal 8 karakter (huruf & angka)"
                  className={`block w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="new-password"
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
                <p className="text-xs font-medium text-rose-600 mt-1">
                  • {validationErrors.password}
                </p>
              )}
            </div>

            {/* Input Konfirmasi Password */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (validationErrors.confirmPassword) {
                      setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }
                  }}
                  placeholder="Ulangi kata sandi"
                  className={`block w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#1DAA9A] focus:ring-teal-100'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs font-medium text-rose-600 mt-1">
                  • {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Input Khusus Role Guru: Kode Undangan Guru */}
            {selectedRole === 'teacher' && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="reg-code" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kode Undangan Guru
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Wajib untuk Guru
                  </span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <input
                    id="reg-code"
                    type="text"
                    value={invitationCode}
                    onChange={(e) => {
                      setInvitationCode(e.target.value)
                      if (validationErrors.invitationCode) {
                        setValidationErrors((prev) => ({ ...prev, invitationCode: undefined }))
                      }
                    }}
                    placeholder="Masukkan kode undangan resmi guru"
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-amber-50/30 text-[#101C3A] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.invitationCode
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-amber-200 focus:border-amber-500 focus:ring-amber-100'
                    }`}
                  />
                </div>
                {validationErrors.invitationCode ? (
                  <p className="text-xs font-medium text-rose-600 mt-1">
                    • {validationErrors.invitationCode}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Dapatkan kode verifikasi resmi dari administrator sekolah / tim kurikulum.
                  </p>
                )}
              </div>
            )}

            {/* Tombol Submit Registrasi */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#101C3A] to-[#152a57] hover:from-[#152a57] hover:to-[#1a346e] text-white text-sm font-bold shadow-md shadow-slate-900/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#1DAA9A] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedRole === 'teacher' ? 'Daftar sebagai Guru' : 'Daftar sebagai Siswa'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#5DE0E6]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link ke Halaman Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Sudah memiliki akun terdaftar?{' '}
              <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 hover:underline">
                Masuk ke Akun Anda →
              </Link>
            </p>
          </div>

          {/* Keamanan Enkripsi Note */}
          <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1DAA9A]" />
            <span>Autentikasi terenkripsi PBKDF2-HMAC-SHA256 & Salt unik</span>
          </div>
        </div>
      </div>
    </div>
  )
}
