import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, UserRole, RegisterPayload } from '../types/auth.ts'
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getSession,
} from '../services/auth.ts'
import { initDatabase } from '../services/db.ts'

interface AuthContextType {
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshUser = useCallback(() => {
    const session = getSession()
    if (session && session.user) {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initialize() {
      try {
        await initDatabase()
        if (isMounted) {
          refreshUser()
        }
      } catch (err) {
        console.error('Initialization error in AuthProvider:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
    }
  }, [refreshUser])

  const handleLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const res = await authLogin(email, pass)
      if (res.success && res.user) {
        setUser(res.user)
        return { success: true }
      }
      return { success: false, error: res.error || 'Autentikasi gagal.' }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const res = await authRegister(payload)
      if (res.success && res.user) {
        setUser(res.user)
        return { success: true }
      }
      return { success: false, error: res.error || 'Registrasi gagal.' }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authLogout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
