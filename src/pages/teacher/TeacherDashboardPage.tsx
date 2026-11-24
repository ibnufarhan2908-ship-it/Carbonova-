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
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { db, isFirebaseConfigured } from '../../services/firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import {
  getTeacherStats,
  getStudents as getLocalStudents,
  getAllSubmissions as getLocalSubmissions,
  syncFromFirestore,
} from '../../services/db'
import type { StudentQuizSubmission } from '../../types/auth'
import QuizResultDetailModal from '../../components/quiz/QuizResultDetailModal'
import type { QuizResult } from '../../types/quiz'
import { isTeacherAccount, getTrustedTeacherEmail } from '../../config/authConfig'

interface TeacherDashboardPageProps {
  initialView?: 'overview' | 'students' | 'results'
}

interface StudentItem {
  id: string
  name: string
  email: string
  role: string
  kelas: string
  createdAt: any
  status?: string
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

  // State Data Firestore Real-Time
  const [firestoreStudents, setFirestoreStudents] = useState<StudentItem[]>([])
  const [quizResultsList, setQuizResultsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State Pencarian pada Data Siswa
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  // State untuk pencarian pada tab Hasil Pengerjaan & modal detail
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<StudentQuizSubmission | null>(null)

  // Hak Akses AD11-01: Guard di level komponen agar role student tidak dapat mengakses dashboard guru
  useEffect(() => {
    if (user && (user.role !== 'teacher' || !isTeacherAccount(user.email, user.id))) {
      navigate('/siswa/dashboard', { replace: true })
    }
  }, [user, navigate])

  // 1. REAL-TIME LISTENER SISWA & QUIZ RESULTS DARI FIRESTORE
  useEffect(() => {
    // Hak Akses AD11-01: Cegah pembacaan data rekap siswa jika bukan guru tepercaya
    if (!user || user.role !== 'teacher' || !isTeacherAccount(user.email, user.id)) {
      setIsLoading(false)
      return
    }

    // Sinkronisasi data lokal jika ada
    syncFromFirestore().catch(() => {})

    if (!db || !isFirebaseConfigured) {
      // Fallback ke penyimpanan lokal jika Firebase belum aktif
      const local = getLocalStudents().map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: 'siswa',
        kelas: s.kelas || 'XI MIPA 1',
        createdAt: s.createdAt,
      }))
      setFirestoreStudents(local)
      const localSubs = getLocalSubmissions().map((s) => ({
        ...s,
        studentEmail: s.userEmail,
      }))
      setQuizResultsList(localSubs)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // QUERY DATA SISWA: collection "users" where "role" == "siswa"
    const qStudents = query(
      collection(db, 'users'),
      where('role', '==', 'siswa')
    )

    const unsubscribeStudents = onSnapshot(
      qStudents,
      (snapshot) => {
        const studentList: StudentItem[] = []
        snapshot.forEach((docSnap) => {
          const d = docSnap.data()
          studentList.push({
            id: docSnap.id,
            name: d.name || d.nama || 'Siswa',
            email: d.email || '',
            role: d.role || 'siswa',
            kelas: d.kelas || d.class || '-',
            createdAt: d.createdAt,
            status: d.status || 'active',
          })
        })

        setFirestoreStudents(studentList)
        setIsLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Firestore onSnapshot users error:', err)
        setError(err.message)
        setIsLoading(false)
        // Fallback ke data lokal
        const local = getLocalStudents().map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          role: 'siswa',
          kelas: s.kelas || 'XI MIPA 1',
          createdAt: s.createdAt,
        }))
        setFirestoreStudents(local)
      }
    )

    // LISTENER HASIL KUIS: collection "quiz_results"
    const qQuiz = collection(db, 'quiz_results')
    const unsubscribeQuiz = onSnapshot(
      qQuiz,
      (snapshot) => {
        const results: any[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() })
        })
        setQuizResultsList(results)
      },
      (err) => {
        console.warn('Firestore onSnapshot quiz_results:', err)
        // Fallback jika collection quiz_results belum ada
        const localSubs = getLocalSubmissions().map((s) => ({
          ...s,
          studentEmail: s.userEmail,
        }))
        setQuizResultsList(localSubs)
      }
    )

    return () => {
      unsubscribeStudents()
      unsubscribeQuiz()
    }
  }, [])

  // 2. HITUNG STATISTIK KUIS PER SISWA
  const getStudentQuizStats = (studentEmail: string, studentId: string) => {
    const emailLower = (studentEmail || '').toLowerCase().trim()
    const studentQuizzes = quizResultsList.filter((q) => {
      const qEmail = (q.studentEmail || q.userEmail || '').toLowerCase().trim()
      return (qEmail && qEmail === emailLower) || (q.userId && q.userId === studentId)
    })

    const totalQuizzes = studentQuizzes.length
    if (totalQuizzes === 0) {
      return {
        totalQuizzes: 0,
        lastScore: '-',
        avgScore: '-',
        quizzes: [],
      }
    }

    // Urutkan berdasarkan waktu pengerjaan terbaru
    studentQuizzes.sort((a, b) => {
      const getMs = (item: any) => {
        if (item.createdAt?.toDate) return item.createdAt.toDate().getTime()
        if (item.completedAt?.toDate) return item.completedAt.toDate().getTime()
        if (item.completedAt) return new Date(item.completedAt).getTime()
        if (item.createdAt) return new Date(item.createdAt).getTime()
        if (item.timestamp) return Number(item.timestamp)
        return 0
      }
      return getMs(b) - getMs(a)
    })

    const latestScoreRaw = studentQuizzes[0].score ?? studentQuizzes[0].nilai ?? 0
    const lastScore = `${latestScoreRaw} / 100`

    const totalScore = studentQuizzes.reduce((sum, q) => {
      const sc = q.score ?? q.nilai ?? 0
      return sum + Number(sc)
    }, 0)
    const avgScore = `${Math.round(totalScore / totalQuizzes)} / 100`

    return {
      totalQuizzes,
      lastScore,
      avgScore,
      quizzes: studentQuizzes,
    }
  }

  // 3. STATISTIK RINGKASAN TOTAL SISWA
  const totalStudents = firestoreStudents.length

  // 4. FILTER DAN PENCARIAN DATA SISWA
  const filteredStudents = useMemo(() => {
    return firestoreStudents.filter((student) => {
      // Input Pencarian (nama / email)
      if (studentSearchQuery.trim()) {
        const q = studentSearchQuery.toLowerCase().trim()
        const matchName = student.name.toLowerCase().includes(q)
        const matchEmail = student.email.toLowerCase().includes(q)
        if (!matchName && !matchEmail) return false
      }

      return true
    })
  }, [firestoreStudents, studentSearchQuery])

  // Data submisi keseluruhan untuk tab Hasil Pengerjaan
  const localStats = getTeacherStats()
  const allSubmissions = useMemo(() => {
    if (quizResultsList.length > 0) {
      return quizResultsList.map((q) => ({
        id: q.id,
        userId: q.userId || '',
        userName: q.studentName || q.userName || 'Siswa',
        userEmail: q.studentEmail || q.userEmail || '',
        quizId: q.quizId || 'quiz',
        quizTitle: q.quizTitle || 'Evaluasi Kuis',
        category: q.category || 'Kimia Karbon',
        completedAt: q.completedAt?.toDate ? q.completedAt.toDate().toISOString() : (q.completedAt || q.createdAt || new Date().toISOString()),
        totalQuestions: q.totalQuestions || 5,
        correctAnswers: q.correctAnswers || 0,
        incorrectAnswers: q.incorrectAnswers || 0,
        score: q.score ?? q.nilai ?? 0,
        answers: q.answers || [],
      })) as StudentQuizSubmission[]
    }
    return getLocalSubmissions()
  }, [quizResultsList])

  // Filter hasil pengerjaan (tab Results)
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return allSubmissions
    const q = searchQuery.toLowerCase()
    return allSubmissions.filter(
      (s) =>
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        s.quizTitle.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    )
  }, [allSubmissions, searchQuery])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Format tanggal Indonesia
  const formatDate = (dateVal: any) => {
    if (!dateVal) return '-'
    try {
      let date: Date
      if (dateVal.toDate && typeof dateVal.toDate === 'function') {
        date = dateVal.toDate()
      } else {
        date = new Date(dateVal)
      }
      if (isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return '-'
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

  // Komponen Tabel Data Siswa Lengkap
  const renderStudentsTable = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 min-w-0 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[#101C3A] truncate">Data Siswa Terdaftar</h2>
          <p className="text-xs text-slate-500 mt-1">
            Data real-time seluruh siswa dari collection Firestore <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-mono text-[11px]">users</code>
          </p>
        </div>

        {/* Informasi Total Siswa */}
        <div className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-2xl shadow-2xs self-start sm:self-auto shrink-0">
          Total Siswa Terdaftar:{' '}
          <span className="text-[#101C3A] font-extrabold">{totalStudents} siswa</span>
        </div>
      </div>

      {/* Kontrol Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 min-w-0">
        {/* Input Pencarian */}
        <div className="relative flex-1 w-full sm:max-w-md min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
            placeholder="Cari nama / email siswa..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-2xs min-w-0"
          />
        </div>
      </div>

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1DAA9A] animate-spin" />
          <p className="text-xs font-semibold">Memuat data siswa secara real-time dari Firestore...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-amber-900">Informasi Koneksi Cloud Firestore</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  {error.includes('permissions')
                    ? 'Aturan Firestore belum dipublikasikan di Firebase Console atau akun guru belum aktif di Firebase Authentication. Dashboard tetap berfungsi normal menampilkan data siswa dari penyimpanan lokal/cache.'
                    : `${error}. Menampilkan data siswa dari penyimpanan lokal/cache.`}
                </p>
              </div>
            </div>
          )}

          {filteredStudents.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Siswa Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {studentSearchQuery
              ? `Tidak ada siswa yang cocok dengan pencarian "${studentSearchQuery}".`
              : 'Belum ada akun siswa pada kategori ini.'}
          </p>
        </div>
      ) : (
        /* Tabel Data Siswa dengan 7 Kolom Sesuai Ketentuan */
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Tanggal Daftar</th>
                <th className="py-3 px-4">Jumlah Kuis Dikerjakan</th>
                <th className="py-3 px-4">Nilai Terakhir</th>
                <th className="py-3 px-4">Nilai Rata-rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => {
                const quizStats = getStudentQuizStats(student.email, student.id)

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Kolom 1: Nama */}
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#101C3A] to-[#1DAA9A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-slate-800 leading-snug truncate max-w-[160px]">
                            {student.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Email */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      <span className="truncate block max-w-[180px]" title={student.email}>
                        {student.email}
                      </span>
                    </td>

                    {/* Kolom 3: Kelas */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200/60 inline-block">
                        {student.kelas || '-'}
                      </span>
                    </td>

                    {/* Kolom 4: Tanggal Daftar */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(student.createdAt)}
                    </td>

                    {/* Kolom 5: Jumlah Kuis Dikerjakan */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {quizStats.totalQuizzes === 0 ? (
                        <span className="text-slate-400">0</span>
                      ) : (
                        <span className="text-[#101C3A] font-bold">
                          {quizStats.totalQuizzes} kuis
                        </span>
                      )}
                    </td>

                    {/* Kolom 6: Nilai Terakhir */}
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-800 whitespace-nowrap">
                      {quizStats.lastScore === '-' ? (
                        <span className="text-slate-400 font-normal italic">-</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                          {quizStats.lastScore}
                        </span>
                      )}
                    </td>

                    {/* Kolom 7: Nilai Rata-rata */}
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-800 whitespace-nowrap">
                      {quizStats.avgScore === '-' ? (
                        <span className="text-slate-400 font-normal italic">-</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          {quizStats.avgScore}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )}
</div>
  )

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#F5F7FB]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-w-0">
        {/* Header Dashboard Guru */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
          <div className="space-y-1.5 min-w-0">
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
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'GU'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || 'Guru'}
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {user?.email || getTrustedTeacherEmail()}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
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
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Shortcut Navigasi ke Materi & Latihan */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <Link
              to="/materi"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#101C3A] hover:bg-slate-50 text-xs font-bold transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Materi Pembelajaran</span>
            </Link>
            <Link
              to="/latihan"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#101C3A] hover:bg-slate-50 text-xs font-bold transition-colors shadow-2xs"
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Latihan Soal</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* 6 Metrik Ringkasan Utama */}
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
                  {totalStudents}
                </div>
                <p className="text-xs text-slate-500">
                  {totalStudents > 0
                    ? `${totalStudents} siswa terdaftar aktif`
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
                  {localStats.totalMaterials}
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
                  {localStats.totalQuestions}
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
                  {allSubmissions.length}
                </div>
                <p className="text-xs text-slate-500">
                  {allSubmissions.length > 0
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
                  {allSubmissions.length > 0
                    ? Math.round(
                        allSubmissions.reduce((acc, c) => acc + (c.score || 0), 0) /
                          allSubmissions.length
                      )
                    : 0}
                  <span className="text-sm font-semibold text-slate-400 ml-1">/ 100</span>
                </div>
                <p className="text-xs text-slate-500">
                  {allSubmissions.length > 0
                    ? 'Dihitung murni dari seluruh data pengerjaan kuis siswa'
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
                  {firestoreStudents.filter(
                    (s) => getStudentQuizStats(s.email, s.id).totalQuizzes === 0
                  ).length}
                </div>
                <p className="text-xs text-slate-500">
                  Siswa terdaftar yang belum memiliki riwayat kuis
                </p>
              </div>
            </div>

            {/* Tabel Data Siswa Terdaftar di Halaman Overview */}
            {renderStudentsTable()}

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

              {allSubmissions.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-6">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700">Belum Ada Pengerjaan Latihan</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Data statistik dan rekaman pengerjaan latihan akan otomatis muncul di sini setelah siswa login dan menyelesaikan evaluasi di halaman latihan soal.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Latihan / Topik</th>
                        <th className="py-3 px-4">Skor Nilai</th>
                        <th className="py-3 px-4">Waktu Pengerjaan</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {allSubmissions.slice(0, 5).map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">
                            <span className="block truncate max-w-[140px]">{sub.userName}</span>
                            <span className="block text-[11px] font-normal text-slate-500 truncate max-w-[160px]">
                              {sub.userEmail}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                            {sub.quizTitle}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
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
                          <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {formatDate(sub.completedAt)}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
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
        {activeView === 'students' && renderStudentsTable()}

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
              {allSubmissions.length > 0 && (
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari siswa atau topik..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                  />
                </div>
              )}
            </div>

            {allSubmissions.length === 0 ? (
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
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
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
                          <span className="block truncate max-w-[150px]">{sub.userName}</span>
                          <span className="block text-[11px] font-normal text-slate-500 truncate max-w-[170px]">
                            {sub.userEmail}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 block whitespace-nowrap">
                            {sub.quizTitle}
                          </span>
                          <span className="text-[11px] text-slate-400 block whitespace-nowrap">{sub.category}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
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
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          {sub.correctAnswers} benar dari {sub.totalQuestions} soal
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(sub.completedAt)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
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
