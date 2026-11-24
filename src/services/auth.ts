import type { AuthSession, User, UserRole, RegisterPayload, AuthResponse, StoredUser } from '../types/auth.ts'
import { verifyPassword, generateSessionToken, generateSalt, hashPassword } from './crypto.ts'
import { isTeacherAccount } from '../config/authConfig.ts'
import {
  initDatabase,
  getStoredUserByEmail,
  getUserById,
  updateUserLastLogin,
  isEmailRegistered,
  saveNewUser,
} from './db.ts'

const SESSION_STORAGE_KEY = 'carbonova_auth_session_v1'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 jam

/**
 * Registrasi Pengguna Baru (Guru atau Siswa)
 * Menjalankan validasi server-grade terhadap format data, kekuatan kata sandi,
 * keunikan email, dan keabsahan kode undangan guru.
 */
export async function register(
  payloadOrName: RegisterPayload | string,
  emailParam?: string,
  passParam?: string,
  roleParam?: UserRole
): Promise<AuthResponse> {
  await initDatabase()

  const payload: RegisterPayload =
    typeof payloadOrName === 'string'
      ? {
          name: payloadOrName,
          email: emailParam || '',
          password: passParam || '',
          role: roleParam || 'student',
        }
      : payloadOrName

  const { name, email, password, confirmPassword } = payload

  // 1. Validasi Kelengkapan Field
  if (!name || !name.trim()) {
    return { success: false, error: 'Nama lengkap wajib diisi.' }
  }
  if (!email || !email.trim()) {
    return { success: false, error: 'Alamat email wajib diisi.' }
  }
  if (!password) {
    return { success: false, error: 'Kata sandi wajib diisi.' }
  }

  // 2. Validasi Format Email
  const cleanEmail = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Format alamat email tidak valid.' }
  }

  // 3. Validasi Kecocokan Kata Sandi
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { success: false, error: 'Konfirmasi kata sandi tidak cocok dengan kata sandi.' }
  }

  // 4. Standar Keamanan Kata Sandi (Minimal 8 karakter, kombinasi huruf dan angka)
  if (password.length < 8) {
    return { success: false, error: 'Kata sandi minimal 8 karakter.' }
  }
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return { success: false, error: 'Kata sandi harus mengandung kombinasi huruf dan angka.' }
  }

  // 5. Coba daftarkan melalui Backend REST API jika endpoint aktif
  let apiSucceeded = false
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    try {
      const sanitizedRole: UserRole = isTeacherAccount(cleanEmail) ? 'teacher' : 'student'
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          role: sanitizedRole,
        }),
      })
      const data = await response.json()
      if (response.ok && data.success && data.user) {
        apiSucceeded = true
        // Sinkronisasi data user dan sesi ke client (memastikan role terverifikasi)
        const safeUser: User = {
          ...data.user,
          role: sanitizedRole,
        }
        const session: AuthSession = {
          token: data.token || generateSessionToken(),
          user: safeUser,
          expiresAt: data.expiresAt || Date.now() + SESSION_DURATION_MS,
        }
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))

        // Simpan juga ke cache lokal agar langsung terbaca di halaman internal
        const salt = generateSalt()
        const passwordHash = await hashPassword(password, salt)
        saveNewUser({
          ...safeUser,
          passwordHash,
          salt,
        })

        return { success: true, user: safeUser, token: session.token }
      } else if (!response.ok && data.error) {
        // Jika backend menolak (misal email duplikat atau kode undangan salah), langsung return error dari backend
        return { success: false, error: data.error }
      }
    } catch {
      // Backend mungkin tidak merespons (misal saat testing unit), lanjutkan ke validasi local engine
    }
  }

  if (apiSucceeded) {
    return { success: true }
  }

  // 6. Validasi Keunikan Email (Lokal Engine / Fallback)
  if (isEmailRegistered(cleanEmail)) {
    return {
      success: false,
      error: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.',
    }
  }

  // 7. Penegakan Hak Akses AD11-01: Pendaftaran umum SELALU mendapatkan role 'student'.
  // Role 'teacher' hanya bisa didapatkan jika email cocok dengan konfigurasi whitelist guru resmi tepercaya.
  const assignedRole: UserRole = isTeacherAccount(cleanEmail) ? 'teacher' : 'student'

  // 8. Hashing Kata Sandi Menggunakan PBKDF2 & Salt Kriptografis Unik
  const salt = generateSalt()
  const passwordHash = await hashPassword(password, salt)
  const newId = `usr-${assignedRole}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

  const newUser: StoredUser = {
    id: newId,
    name: name.trim(),
    email: cleanEmail,
    role: assignedRole,
    kelas: payload.kelas || '-',
    status: 'active',
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  }

  saveNewUser(newUser)

  // 9. Buat Sesi Baru Otomatis Setelah Registrasi
  const token = generateSessionToken()
  const safeUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    kelas: newUser.kelas,
    status: newUser.status,
    createdAt: newUser.createdAt,
    lastLoginAt: new Date().toISOString(),
  }

  const session: AuthSession = {
    token,
    user: safeUser,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  return { success: true, user: safeUser, token }
}

export async function login(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await initDatabase()

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !pass) {
    return { success: false, error: 'Email dan password wajib diisi.' }
  }

  // Coba autentikasi via Backend API terlebih dahulu
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      })
      const data = await response.json()
      if (response.ok && data.success && data.user) {
        const safeUser: User = data.user
        const session: AuthSession = {
          token: data.token || generateSessionToken(),
          user: safeUser,
          expiresAt: data.expiresAt || Date.now() + SESSION_DURATION_MS,
        }
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
        return { success: true, user: safeUser }
      }
    } catch {
      // Backend offline, fallback ke database lokal
    }
  }

  const storedUser = getStoredUserByEmail(cleanEmail)
  if (!storedUser) {
    return { success: false, error: 'Email atau kata sandi tidak sesuai.' }
  }

  const isPasswordValid = await verifyPassword(pass, storedUser.salt, storedUser.passwordHash)
  if (!isPasswordValid) {
    return { success: false, error: 'Email atau kata sandi tidak sesuai.' }
  }

  if (storedUser.status !== 'active') {
    return { success: false, error: 'Akun Anda dinonaktifkan. Silakan hubungi pengelola.' }
  }

  // Update last login
  updateUserLastLogin(storedUser.id)

  const token = generateSessionToken()
  const { passwordHash: _, salt: __, ...safeUser } = storedUser
  const verifiedRole: UserRole =
    safeUser.role === 'teacher' && isTeacherAccount(safeUser.email, safeUser.id)
      ? 'teacher'
      : 'student'

  const safeUserWithLogin: User = {
    ...safeUser,
    role: verifiedRole,
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

    // Hak Akses AD11-01: Validasi whitelist akun guru tepercaya
    const verifiedRole: UserRole =
      freshUser.role === 'teacher' && isTeacherAccount(freshUser.email, freshUser.id)
        ? 'teacher'
        : 'student'

    return {
      ...session,
      user: {
        ...freshUser,
        role: verifiedRole,
      },
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
