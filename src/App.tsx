import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import MaterialsPage from './pages/MaterialsPage'
import MoleculeExplorerPage from './pages/MoleculeExplorerPage'
import CarbonLabPage from './pages/CarbonLabPage'
import QuizPage from './pages/QuizPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import StudentDashboardPage from './pages/student/StudentDashboardPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Public Route Register */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Internal Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* 1. Akses Bebas Pengguna Umum (Beranda, Materi, Molekul, Lab, Tentang) */}
            <Route index element={<HomePage />} />
            <Route path="beranda" element={<HomePage />} />
            <Route path="materi" element={<MaterialsPage />} />
            <Route path="molekul" element={<MoleculeExplorerPage />} />
            <Route path="lab" element={<CarbonLabPage />} />
            <Route path="tentang" element={<AboutPage />} />

            {/* 2. Rute Terkunci Khusus Siswa/Guru Terautentikasi (Latihan Soal & Riwayat) */}
            <Route
              path="latihan"
              element={<QuizPage />}
            />
            <Route
              path="latihan-soal"
              element={<QuizPage />}
            />
            <Route
              path="riwayat"
              element={<QuizPage />}
            />

            {/* 3. Dashboard Guru (Akses Eksklusif Role Teacher) */}
            <Route
              path="guru/dashboard"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage initialView="overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="guru/siswa"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage initialView="students" />
                </ProtectedRoute>
              }
            />
            <Route
              path="guru/hasil"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage initialView="results" />
                </ProtectedRoute>
              }
            />
            <Route
              path="guru/materi"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage initialView="materials" />
                </ProtectedRoute>
              }
            />
            <Route path="guru" element={<Navigate to="/guru/dashboard" replace />} />

            {/* 4. Dashboard Siswa (Akses Khusus Role Student) */}
            <Route
              path="siswa/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="siswa" element={<Navigate to="/siswa/dashboard" replace />} />
          </Route>

          {/* Fallback rute tidak dikenal diarahkan kembali ke Beranda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
