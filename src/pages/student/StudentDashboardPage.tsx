import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  History,
  LogOut,
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getStudentStats, getSubmissionsByStudent, syncFromFirestore } from '../../services/db'
import type { StudentQuizSubmission } from '../../types/auth'
import QuizResultDetailModal from '../../components/quiz/QuizResultDetailModal'
import type { QuizResult } from '../../types/quiz'

export default function StudentDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    syncFromFirestore().then(() => {
      setRefreshTick((prev) => prev + 1)
    })
  }, [])

  const stats = useMemo(() => {
    if (!user) {
      return {
        totalMaterials: 6,
        studiedMaterialsCount: 0,
        totalQuestions: 30,
        completedQuestionsCount: 0,
        remainingQuestionsCount: 30,
        averageScore: 0,
        totalAttempts: 0,
      }
    }
    // Sertakan refreshTick agar metrik diperbarui setelah sinkronisasi Firestore
    if (refreshTick < 0) return {} as any
    return getStudentStats(user.id)
  }, [user, refreshTick])

  const mySubmissions = useMemo(() => {
    if (!user) return []
    if (refreshTick < 0) return []
    return getSubmissionsByStudent(user.id)
  }, [user, refreshTick])

  const [selectedSubmission, setSelectedSubmission] = useState<StudentQuizSubmission | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Profile Siswa */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/60 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                Portal Pembelajaran Siswa
              </span>
              <span className="text-xs font-semibold text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Carbonova LMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight">
              Halo, {user?.name || 'Siswa'}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              Pantau progres materi kimia karbon dan evaluasi capaian latihan soalmu di sini.
            </p>
          </div>

          {/* Quick Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 pr-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#101C3A] to-[#1DAA9A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SD'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || 'Siswa Demo'}
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {user?.email || 'siswa.demo@carbonova.test'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              title="Keluar dari sesi siswa"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigasi Utama Siswa Sesuai Kriteria 6 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-4 py-2.5 rounded-2xl bg-[#101C3A] text-white text-xs sm:text-sm font-bold shadow-sm">
              Dashboard Siswa
            </span>
            <Link
              to="/materi"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-600 hover:text-[#101C3A] hover:bg-slate-100 border border-slate-200/80 text-xs sm:text-sm font-bold transition-all"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Materi Pembelajaran</span>
            </Link>
            <Link
              to="/latihan"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-600 hover:text-[#101C3A] hover:bg-slate-100 border border-slate-200/80 text-xs sm:text-sm font-bold transition-all"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Latihan Soal</span>
            </Link>
            <Link
              to="/riwayat"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-600 hover:text-[#101C3A] hover:bg-slate-100 border border-slate-200/80 text-xs sm:text-sm font-bold transition-all"
            >
              <History className="w-4 h-4 text-teal-600" />
              <span>Riwayat Pengerjaan</span>
            </Link>
          </div>
        </div>

        {/* 5 Metrik Ringkasan Siswa Sesuai Kriteria 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Jumlah Materi yang Tersedia */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Materi Tersedia
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#101C3A]">
              {stats.totalMaterials}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Modul pembelajaran</p>
          </div>

          {/* 2. Jumlah Materi yang Sudah Dipelajari */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Materi Dipelajari
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {stats.studiedMaterialsCount}
              <span className="text-xs font-semibold text-slate-400 ml-1">
                / {stats.totalMaterials}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {stats.studiedMaterialsCount > 0
                ? `${Math.round((stats.studiedMaterialsCount / stats.totalMaterials) * 100)}% materi telah dibuka`
                : 'Belum membuka materi'}
            </p>
          </div>

          {/* 3. Jumlah Latihan Soal yang Tersedia */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Latihan Tersedia
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <FileQuestion className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#101C3A]">
              {stats.totalQuestions}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Soal penalaran HOTS</p>
          </div>

          {/* 4. Jumlah Latihan yang Sudah Dikerjakan */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sudah Dikerjakan
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-blue-700">
              {stats.totalAttempts}
              <span className="text-xs font-semibold text-slate-400 ml-1">evaluasi</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {stats.completedQuestionsCount} butir soal diselesaikan
            </p>
          </div>

          {/* 5. Jumlah Latihan yang Belum Dikerjakan */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Belum Dikerjakan
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-600">
              {stats.remainingQuestionsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Soal belum dijawab</p>
          </div>
        </div>

        {/* Section Aksi Cepat Belajar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#101C3A] to-[#1a2d59] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-[#5DE0E6] text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                Eksplorasi Pembelajaran
              </div>
              <h2 className="text-xl font-bold">Lanjutkan Belajar Senyawa Karbon</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Pelajari 6 modul lengkap mengenai kekhasan atom karbon, hidrokarbon, tata nama IUPAC, gugus fungsi, keisomeran, dan reaksi kimia organik.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <Link
                to="/materi"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DAA9A] hover:bg-[#168a7d] text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Buka Materi Pembelajaran</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
                <Flame className="w-3.5 h-3.5 text-cyan-600" />
                Uji Kompetensi & HOTS
              </div>
              <h2 className="text-xl font-bold text-[#101C3A]">Latihan Soal & Evaluasi Mandiri</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Uji kemampuan analisismu melalui 30 bank soal penalaran HOTS dengan pembahasan lengkap dan skor instan yang tersimpan ke portofoliomu.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/latihan"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C3A] hover:bg-[#152a57] text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Mulai Latihan Soal</span>
                <ArrowRight className="w-4 h-4 text-[#5DE0E6]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Pengerjaan Pribadi Siswa */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#101C3A]">Riwayat Pengerjaan Saya</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar evaluasi dan kuis kimia yang telah kamu selesaikan
              </p>
            </div>
            <Link
              to="/riwayat"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
            >
              <span>Buka Menu Riwayat Kuis Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Pengerjaan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Kamu belum mengerjakan evaluasi latihan soal. Selesaikan soal latihan pertamamu untuk melihat skor dan pembahasan di sini.
              </p>
              <div className="mt-4">
                <Link
                  to="/latihan"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101C3A] text-white text-xs font-bold hover:bg-[#182852] transition-colors"
                >
                  <span>Mulai Kerjakan Soal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5DE0E6]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Nama Latihan</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Nilai</th>
                    <th className="py-3 px-4">Hasil Jawaban</th>
                    <th className="py-3 px-4">Tanggal Pengerjaan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {mySubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {sub.quizTitle}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 font-medium">
                        {sub.category}
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
                      <td className="py-3 px-4 text-xs font-medium text-slate-600">
                        {sub.correctAnswers} benar dari {sub.totalQuestions} soal
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(sub.completedAt)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold text-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pembahasan</span>
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

      {/* Modal Detail & Pembahasan Soal */}
      {selectedSubmission && (
        <QuizResultDetailModal
          result={selectedSubmission as unknown as QuizResult}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
}

