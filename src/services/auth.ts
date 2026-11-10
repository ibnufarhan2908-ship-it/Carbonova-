import type { AuthSession, User, UserRole, StoredUser } from '../types/auth.ts'
import { verifyPassword, generateSessionToken, generateSalt, hashPassword } from './crypto.ts'
import {
  initDatabase,
  getStoredUserByEmail,
  getUserById,
  updateUserLastLogin,
  createLocalUser,
} from './db.ts'

const SESSION_STORAGE_KEY = 'carbonova_auth_session_v1'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 jam

export async function login(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await initDatabase()

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !pass) {
    return { success: false, error: 'Email dan password wajib diisi.' }
  }

  const storedUser = getStoredUserByEmail(cleanEmail)
  if (!storedUser) {
    return { success: false, error: 'Email atau password tidak sesuai.' }
  }

  const isPasswordValid = await verifyPassword(pass, storedUser.salt, storedUser.passwordHash)
  if (!isPasswordValid) {
    return { success: false, error: 'Email atau password tidak sesuai.' }
  }

  if (storedUser.status !== 'active') {
    return { success: false, error: 'Akun Anda dinonaktifkan. Silakan hubungi pengelola.' }
  }

  // Update last login
  updateUserLastLogin(storedUser.id)

  const token = generateSessionToken()
  const { passwordHash: _, salt: __, ...safeUser } = storedUser
  const safeUserWithLogin: User = {
    ...safeUser,
    lastLoginAt: new Date().toISOString(),
  }

  const session: AuthSession = {
    token,
    user: safeUserWithLogin,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  return { success: true, user: safeUserWithLogin }
}

export async function register(
  name: string,
  email: string,
  pass: string,
  role: UserRole = 'student'
): Promise<{ success: boolean; user?: User; error?: string }> {
  await initDatabase()

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !pass || !name.trim()) {
    return { success: false, error: 'Nama lengkap, email, dan kata sandi wajib diisi.' }
  }

  const existing = getStoredUserByEmail(cleanEmail)
  if (existing) {
    return { success: false, error: 'Alamat email ini sudah terdaftar. Silakan langsung masuk.' }
  }

  if (pass.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' }
  }

  const salt = generateSalt()
  const passwordHash = await hashPassword(pass, salt)
  const now = new Date().toISOString()
  const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

  const newStoredUser: StoredUser = {
    id,
    name: name.trim(),
    email: cleanEmail,
    role,
    status: 'active',
    createdAt: now,
    lastLoginAt: now,
    passwordHash,
    salt,
  }

  createLocalUser(newStoredUser)

  const token = generateSessionToken()
  const safeUser: User = {
    id,
    name: name.trim(),
    email: cleanEmail,
    role,
    status: 'active',
    createdAt: now,
    lastLoginAt: now,
  }

  const session: AuthSession = {
    token,
    user: safeUser,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  return { success: true, user: safeUser }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession

    if (!session || !session.token || !session.expiresAt) {
      logout()
      return null
    }

    if (Date.now() > session.expiresAt) {
      logout()
      return null
    }

    // Pastikan user masih valid di database
    const freshUser = getUserById(session.user.id)
    if (!freshUser || freshUser.status !== 'active') {
      logout()
      return null
    }

    return {
      ...session,
      user: freshUser,
    }
  } catch (error) {
    console.error('Error parsing auth session:', error)
    logout()
    return null
  }
}

export function getCurrentUser(): User | null {
  const session = getSession()
  return session ? session.user : null
}

