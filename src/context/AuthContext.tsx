import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, UserRole, RegisterPayload } from '../types/auth.ts'
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getSession,
} from '../services/auth.ts'
import { initDatabase } from '../services/db.ts'
import { isFirebaseConfigured } from '../services/firebase.ts'
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  subscribeToFirebaseAuthState,
} from '../services/firebaseAuth.ts'

export interface AuthContextType {
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  isFirebaseActive: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  register: (
    payloadOrName: RegisterPayload | string,
    email?: string,
    pass?: string,
    role?: UserRole
  ) => Promise<{ success: boolean; error?: string }>
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
    } else if (!isFirebaseConfigured) {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    let unsubscribeFirebase: (() => void) | null = null

    async function initialize() {
      try {
        await initDatabase()

        if (isFirebaseConfigured) {
          unsubscribeFirebase = subscribeToFirebaseAuthState((fbUser) => {
            if (!isMounted) return
            if (fbUser) {
              setUser(fbUser)
              setIsLoading(false)
            } else {
              // Jika tidak ada user Firebase, cek apakah terdapat sesi demo/lokal
              const session = getSession()
              if (session && session.user) {
                setUser(session.user)
              } else {
                setUser(null)
              }
              setIsLoading(false)
            }
          })
        } else {
          if (isMounted) {
            refreshUser()
            setIsLoading(false)
          }
        }
      } catch (err) {
        console.error('Initialization error in AuthProvider:', err)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      if (unsubscribeFirebase) {
        unsubscribeFirebase()
      }
    }
  }, [refreshUser])

  const handleLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const cleanEmail = email.trim().toLowerCase()

      // 1. Akun demo Carbonova diproses langsung melalui database lokal
      if (cleanEmail.includes('.demo@carbonova.test')) {
        const localRes = await authLogin(cleanEmail, pass)
        if (localRes.success && localRes.user) {
          setUser(localRes.user)
          return { success: true }
        }
      }

      // 2. Jika konfigurasi Firebase aktif, gunakan Firebase Authentication
      if (isFirebaseConfigured) {
        const fbRes = await firebaseSignIn(cleanEmail, pass)
        if (fbRes.success && fbRes.user) {
          setUser(fbRes.user)
          return { success: true }
        }

        // Fallback ke penyimpanan lokal jika akun terdaftar di lokal
        const localRes = await authLogin(cleanEmail, pass)
        if (localRes.success && localRes.user) {
          setUser(localRes.user)
          return { success: true }
        }

        return { success: false, error: fbRes.error || localRes.error || 'Autentikasi gagal.' }
      }

      // 3. Autentikasi lokal biasa
      const res = await authLogin(cleanEmail, pass)
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
    payloadOrName: RegisterPayload | string,
    email?: string,
    pass?: string,
    role: UserRole = 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const payload: RegisterPayload =
        typeof payloadOrName === 'string'
          ? {
              name: payloadOrName,
              email: email || '',
              password: pass || '',
              role,
            }
          : payloadOrName

      const cleanEmail = payload.email.trim().toLowerCase()

      if (isFirebaseConfigured) {
        const fbRes = await firebaseSignUp(payload.name, cleanEmail, payload.password, payload.role)
        if (fbRes.success && fbRes.user) {
          setUser(fbRes.user)
          return { success: true }
        }
        return { success: false, error: fbRes.error || 'Gagal mendaftar akun di Firebase.' }
      }

      // Pendaftaran lokal jika Firebase belum dikonfigurasi
      const localRes = await authRegister(payload)
      if (localRes.success && localRes.user) {
        setUser(localRes.user)
        return { success: true }
      }
      return { success: false, error: localRes.error || 'Gagal mendaftar akun lokal.' }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (isFirebaseConfigured) {
      firebaseSignOut().catch((err) => {
        console.warn('Firebase signOut warning:', err)
      })
    }
    authLogout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseActive: isFirebaseConfigured,
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
