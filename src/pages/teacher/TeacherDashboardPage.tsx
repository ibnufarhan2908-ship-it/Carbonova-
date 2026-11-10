import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Users,
  BookOpen,
  FileQuestion,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  LogOut,
  Calendar,
  Eye,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getTeacherStats,
  getStudents,
  getAllSubmissions,
  getSubmissionsByStudent,
  syncFromFirestore,
} from '../../services/db'
import type { StudentQuizSubmission } from '../../types/auth'
import QuizResultDetailModal from '../../components/quiz/QuizResultDetailModal'
import type { QuizResult } from '../../types/quiz'

interface TeacherDashboardPageProps {
  initialView?: 'overview' | 'students' | 'results'
}

export default function TeacherDashboardPage({ initialView }: TeacherDashboardPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Tentukan tampilan aktif berdasarkan props atau pathname
  const activeView: 'overview' | 'students' | 'results' = useMemo(() => {
    if (initialView) return initialView
    if (location.pathname.includes('/guru/siswa')) return 'students'
    if (location.pathname.includes('/guru/hasil')) return 'results'
    return 'overview'
  }, [initialView, location.pathname])

  // Data dari database
  const stats = getTeacherStats()
  const students = getStudents()
  const submissions = getAllSubmissions()

  // State untuk pencarian & modal detail
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<StudentQuizSubmission | null>(null)
  const [, setRefreshTick] = useState(0)

  useEffect(() => {
    syncFromFirestore().then(() => {
      setRefreshTick((prev) => prev + 1)
    })
  }, [])

  // Filter hasil pengerjaan
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions
    const q = searchQuery.toLowerCase()
    return submissions.filter(
      (s) =>
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        s.quizTitle.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    )
  }, [submissions, searchQuery])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Format tanggal Indonesia
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  // Navigasi Menu Guru
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/guru/dashboard',
      active: activeView === 'overview',
    },
    {
      id: 'students',
      label: 'Daftar Siswa',
      icon: Users,
      path: '/guru/siswa',
      active: activeView === 'students',
    },
    {
      id: 'results',
      label: 'Hasil Pengerjaan',
      icon: ClipboardList,
      path: '/guru/hasil',
      active: activeView === 'results',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Dashboard Guru */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/60 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Portal Tenaga Pendidik
              </span>
              <span className="text-xs font-semibold text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Carbonova LMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Dashboard Guru & Pemantauan Siswa
            </h1>
            <p className="text-sm text-slate-500">
              Selamat datang kembali, <strong className="text-slate-700">{user?.name || 'Guru'}</strong>. Pantau aktivitas belajar dan hasil evaluasi siswa secara real-time.
            </p>
          </div>

          {/* Quick Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 pr-4">
              <div className="w-10 h-10 rounded-xl bg-[#101C3A] text-white flex items-center justify-center font-bold text-sm">
                GD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || 'Guru Demo'}
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {user?.email || 'guru.demo@carbonova.test'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              title="Keluar dari sesi guru"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigasi Utama Guru */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  item.active
                    ? 'bg-[#101C3A] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-[#101C3A] hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Shortcut Navigasi ke Materi & Latihan yang sudah ada (sesuai batasan PRD) */}
          <div className="flex items-center gap-2">
            <Link
              to="/materi"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#101C3A] hover:bg-slate-50 text-xs font-bold transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Materi Pembelajaran</span>
            </Link>
            <Link
              to="/latihan"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#101C3A] hover:bg-slate-50 text-xs font-bold transition-colors shadow-2xs"
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              <span>Latihan Soal</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* 6 Metrik Ringkasan Utama (Sesuai Kriteria 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Total Siswa Terdaftar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Siswa Terdaftar
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.totalStudents}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.totalStudents > 0
                    ? `${stats.totalStudents} siswa terverifikasi di database`
                    : 'Belum ada siswa terdaftar'}
                </p>
              </div>

              {/* 2. Total Materi yang Tersedia */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Materi Tersedia
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.totalMaterials}
                </div>
                <p className="text-xs text-slate-500">
                  Modul senyawa karbon terstruktur kurikulum SMA
                </p>
              </div>

              {/* 3. Total Latihan Soal */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Latihan Soal
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.totalQuestions}
                </div>
                <p className="text-xs text-slate-500">
                  Bank soal evaluasi penalaran HOTS aktif
                </p>
              </div>

              {/* 4. Jumlah Pengerjaan Latihan */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Jumlah Pengerjaan Latihan
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.totalSubmissions}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.totalSubmissions > 0
                    ? `Total akumulasi submission latihan yang dikumpulkan`
                    : 'Belum ada submission latihan'}
                </p>
              </div>

              {/* 5. Rata-rata Nilai Siswa */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Rata-rata Nilai Siswa
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.totalSubmissions > 0 ? `${stats.averageScore}` : '0'}
                  <span className="text-sm font-semibold text-slate-400 ml-1">/ 100</span>
                </div>
                <p className="text-xs text-slate-500">
                  {stats.totalSubmissions > 0
                    ? 'Dihitung murni dari data pengerjaan yang tersimpan'
                    : 'Belum ada data nilai pengerjaan'}
                </p>
              </div>

              {/* 6. Jumlah Siswa yang Belum Mengerjakan */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Siswa Belum Mengerjakan
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#101C3A] mb-1">
                  {stats.uncompletedStudentsCount}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.uncompletedStudentsCount > 0
                    ? 'Siswa belum pernah mengumpulkan evaluasi'
                    : 'Semua siswa telah mulai mengerjakan evaluasi'}
                </p>
              </div>
            </div>

            {/* Aktivitas Pengerjaan Terbaru */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#101C3A]">Aktivitas Pengerjaan Terbaru</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Catatan submission latihan soal terkini dari para siswa
                  </p>
                </div>
                <Link
                  to="/guru/hasil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  <span>Lihat Semua Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {submissions.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700">Belum Ada Pengerjaan Latihan</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Data statistik dan rekaman pengerjaan latihan akan otomatis muncul di sini setelah siswa login dan menyelesaikan evaluasi di halaman latihan soal.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Latihan / Topik</th>
                        <th className="py-3 px-4">Skor Nilai</th>
                        <th className="py-3 px-4">Waktu Pengerjaan</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {submissions.slice(0, 5).map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {sub.userName}
                            <span className="block text-[11px] font-normal text-slate-500">
                              {sub.userEmail}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {sub.quizTitle}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                sub.score >= 80
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : sub.score >= 60
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {sub.score} / 100
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {formatDate(sub.completedAt)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold text-slate-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: DAFTAR SISWA */}
        {/* ========================================================= */}
        {activeView === 'students' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#101C3A]">Daftar Siswa Terdaftar</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Seluruh akun siswa yang terdaftar di basis data Carbonova LMS
                </p>
              </div>
              <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                Total: {students.length} Siswa
              </div>
            </div>

            {students.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Belum Ada Siswa Terdaftar</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Akun siswa terdaftar akan ditampilkan secara otomatis di sini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Alamat Email</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4">Tanggal Pendaftaran</th>
                      <th className="py-3 px-4">Latihan Selesai</th>
                      <th className="py-3 px-4">Rata-rata Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {students.map((student) => {
                      const studentSubs = getSubmissionsByStudent(student.id)
                      const studentAvg =
                        studentSubs.length > 0
                          ? Math.round(
                              studentSubs.reduce((acc, cur) => acc + cur.score, 0) /
                                studentSubs.length
                            )
                          : '-'

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#101C3A] to-[#1DAA9A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span>{student.name}</span>
                              <span className="block text-[11px] font-normal text-slate-400">
                                ID: {student.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                            {student.email}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {student.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500">
                            {formatDate(student.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                            {studentSubs.length} Pengerjaan
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">
                            {studentAvg !== '-' ? (
                              <span
                                className={`px-2 py-0.5 rounded-md text-xs ${
                                  Number(studentAvg) >= 80
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : Number(studentAvg) >= 60
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {studentAvg} / 100
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Belum ada</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: HASIL PENGERJAAN & PEMANTAUAN */}
        {/* ========================================================= */}
        {activeView === 'results' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#101C3A]">
                  Pemantauan Hasil Pengerjaan Siswa
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Data rekaman pengerjaan latihan dan kuis seluruh siswa yang tersimpan di sistem
                </p>
              </div>

              {/* Pencarian */}
              {submissions.length > 0 && (
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari siswa atau topik..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Belum Ada Hasil Pengerjaan</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Sistem tidak membuat data statistik fiktif. Hasil pengerjaan kuis siswa akan otomatis muncul di sini setelah siswa menyelesaikan evaluasi.
                </p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Tidak ada data hasil pengerjaan yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Nama Latihan</th>
                      <th className="py-3 px-4">Nilai</th>
                      <th className="py-3 px-4">Skor Jawaban</th>
                      <th className="py-3 px-4">Tanggal Pengerjaan</th>
                      <th className="py-3 px-4 text-right">Riwayat / Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {sub.userName}
                          <span className="block text-[11px] font-normal text-slate-500">
                            {sub.userEmail}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 block">
                            {sub.quizTitle}
                          </span>
                          <span className="text-[11px] text-slate-400">{sub.category}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                              sub.score >= 80
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : sub.score >= 60
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {sub.score} / 100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          {sub.correctAnswers} benar dari {sub.totalQuestions} soal
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(sub.completedAt)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold text-slate-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Jawaban Siswa */}
      {selectedSubmission && (
        <QuizResultDetailModal
          result={selectedSubmission as unknown as QuizResult}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
}
