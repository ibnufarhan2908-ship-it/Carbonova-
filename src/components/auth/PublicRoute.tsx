import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Atom } from 'lucide-react'

interface PublicRouteProps {
  children?: React.ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FB]">
        <div className="w-12 h-12 rounded-2xl bg-[#101C3A] flex items-center justify-center shadow-lg animate-pulse mb-4">
          <Atom className="w-6 h-6 text-[#5DE0E6] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Memuat Carbonova...</p>
      </div>
    )
  }

  if (isAuthenticated && user) {
    if (user.role === 'teacher') {
      return <Navigate to="/guru/dashboard" replace />
    } else {
      return <Navigate to="/siswa/dashboard" replace />
    }
  }

  return children ? <>{children}</> : null
}

