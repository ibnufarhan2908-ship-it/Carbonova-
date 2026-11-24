import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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
import { isTeacherAccount } from './config/authConfig'

function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="w-8 h-8 border-3 border-[#101C3A] border-t-[#1DAA9A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Determine dashboard based on role and whitelist
  const isTrustedTeacher = user?.role === 'teacher' && isTeacherAccount(user.email, user.id);
  const isDemoTeacher = user?.role === 'teacher_demo' && isTeacherEmail(user.email);
  if (isTrustedTeacher) {
    return <Navigate to="/guru/dashboard" replace />;
  }
  if (isDemoTeacher) {
    return <Navigate to="/guru/dashboard" replace />; // same page, UI will handle demo mode
  }
  return <Navigate to="/siswa/dashboard" replace />;

}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route Login - Halaman pertama ketika website dibuka jika belum login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Public Route Register - Pendaftaran akun baru Guru dan Siswa */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Internal Protected Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* Root Route: Redirects unauthenticated to /login, or authenticated to role dashboard */}
            <Route index element={<RootRedirect />} />

            {/* Dashboard Guru (Akses Terbatas: Hanya Role Teacher) */}
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
            <Route path="guru" element={<Navigate to="/guru/dashboard" replace />} />

            {/* Dashboard Siswa (Akses Terbatas: Hanya Role Student) */}
            <Route
              path="siswa/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="siswa" element={<Navigate to="/siswa/dashboard" replace />} />

            {/* Fitur Pembelajaran Internal Terproteksi (Guru & Siswa Terautentikasi) */}
            <Route
              path="beranda"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="materi"
              element={
                <ProtectedRoute>
                  <MaterialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="molekul"
              element={
                <ProtectedRoute>
                  <MoleculeExplorerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="lab"
              element={
                <ProtectedRoute>
                  <CarbonLabPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="latihan"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="riwayat"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tentang"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect to RootRedirect */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
