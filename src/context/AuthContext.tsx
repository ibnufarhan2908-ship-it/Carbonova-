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
  firebaseSignInWithGoogle,
  firebaseSignUp,
  firebaseSignOut,
  subscribeToFirebaseAuthState,
} from '../services/firebaseAuth.ts'
import { isTeacherAccount } from '../config/authConfig.ts'

export interface AuthContextType {
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  isFirebaseActive: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>
  register: (
    payloadOrName: RegisterPayload | string,
    email?: string,
    pass?: string,
    role?: UserRole,
    kelas?: string
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

      // 1. Jika konfigurasi Firebase aktif, gunakan Firebase Authentication
      if (isFirebaseConfigured) {
        const fbRes = await firebaseSignIn(cleanEmail, pass)
        if (fbRes.success && fbRes.user) {
          setUser(fbRes.user)
          return { success: true }
        }

        // Fallback ke penyimpanan lokal jika akun terdaftar di lokal / offline
        const localRes = await authLogin(cleanEmail, pass)
        if (localRes.success && localRes.user) {
          // Jika akun guru resmi berhasil login lokal namun belum terdaftar di Firebase Auth,
          // sinkronkan ke Firebase Auth agar sesi Firestore Cloud aktif dengan kredensial sah
          if (isTeacherAccount(cleanEmail, localRes.user.id)) {
            try {
              const fbRegisterRes = await firebaseSignUp(
                localRes.user.name,
                cleanEmail,
                pass,
                'teacher'
              )
              if (fbRegisterRes.success && fbRegisterRes.user) {
                setUser(fbRegisterRes.user)
                return { success: true }
              }
            } catch (syncErr) {
              console.warn('Gagal mendaftarkan akun guru ke Firebase Auth secara otomatis:', syncErr)
            }
          }

          setUser(localRes.user)
          return { success: true }
        }

        return { success: false, error: fbRes.error || localRes.error || 'Autentikasi gagal.' }
      }

      // 2. Mode lokal biasa jika Firebase belum dikonfigurasi
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

  const handleLoginWithGoogle = async (): Promise<{
    success: boolean
    user?: User
    error?: string
  }> => {
    setIsLoading(true)
    try {
      if (isFirebaseConfigured) {
        const res = await firebaseSignInWithGoogle()
        if (res.success && res.user) {
          setUser(res.user)
          return { success: true, user: res.user }
        }
        return { success: false, error: res.error || 'Gagal masuk dengan Google.' }
      }

      return {
        success: false,
        error:
          'Fitur Masuk dengan Google memerlukan konfigurasi Firebase aktif. Pastikan VITE_FIREBASE_API_KEY dan konfigurasi Firebase lainnya sudah diisi di file .env.',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (
    payloadOrName: RegisterPayload | string,
    email?: string,
    pass?: string,
    _role: UserRole = 'student',
    kelas: string = '-'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      // Keamanan AD11-01: Selalu paksa role 'student' untuk pendaftaran mandiri publik
      const forcedRole: UserRole = 'student'
      const payload: RegisterPayload =
        typeof payloadOrName === 'string'
          ? {
              name: payloadOrName,
              email: email || '',
              password: pass || '',
              role: forcedRole,
              kelas: kelas || '-',
            }
          : {
              ...payloadOrName,
              role: forcedRole,
              kelas: payloadOrName.kelas || kelas || '-',
            }

      const cleanEmail = payload.email.trim().toLowerCase()

      if (isFirebaseConfigured) {
        const fbRes = await firebaseSignUp(
          payload.name,
          cleanEmail,
          payload.password,
          forcedRole,
          payload.kelas || '-'
        )
        if (fbRes.success && fbRes.user) {
          setUser({
            ...fbRes.user,
            role: 'student',
          })
          return { success: true }
        }
        return { success: false, error: fbRes.error || 'Gagal mendaftar akun di Firebase.' }
      }

      // Pendaftaran lokal jika Firebase belum dikonfigurasi
      const localRes = await authRegister({
        ...payload,
        role: forcedRole,
      })
      if (localRes.success && localRes.user) {
        setUser({
          ...localRes.user,
          role: 'student',
        })
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

  // Hak Akses AD11-01: Verifikasi integritas role sebelum diekspos ke konteks aplikasi
  const verifiedRole: UserRole | null = user
    ? user.role === 'teacher' && isTeacherAccount(user.email, user.id)
      ? 'teacher'
      : 'student'
    : null

  const value: AuthContextType = {
    user: user
      ? {
          ...user,
          role: verifiedRole || 'student',
        }
      : null,
    role: verifiedRole,
    isAuthenticated: !!user,
    isLoading,
    isFirebaseActive: isFirebaseConfigured,
    login: handleLogin,
    loginWithGoogle: handleLoginWithGoogle,
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
