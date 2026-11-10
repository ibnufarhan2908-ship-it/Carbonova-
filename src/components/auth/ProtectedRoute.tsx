import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'
import { Atom } from 'lucide-react'

interface ProtectedRouteProps {
  children?: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FB]">
        <div className="w-12 h-12 rounded-2xl bg-[#101C3A] flex items-center justify-center shadow-lg animate-pulse mb-4">
          <Atom className="w-6 h-6 text-[#5DE0E6] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Memverifikasi sesi Carbonova...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    // Arahkan ke login dan simpan URL asal untuk redirect kembali setelah login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Pengguna tidak memiliki izin hak akses untuk halaman ini
    if (user.role === 'teacher') {
      return <Navigate to="/guru/dashboard" replace />
    } else {
      return <Navigate to="/siswa/dashboard" replace />
    }
  }

  return children ? <>{children}</> : null
}

