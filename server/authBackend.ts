import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'

export interface StoredUser {
  id: string
  name: string
  email: string
  role: 'teacher' | 'student'
  status: 'active' | 'inactive'
  passwordHash: string
  salt: string
  createdAt: string
  lastLoginAt?: string
}

export interface SessionData {
  token: string
  userId: string
  role: 'teacher' | 'student'
  expiresAt: number
}

// Direktori penyimpanan permanen server
const DATA_DIR = path.resolve(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Kode Undangan Guru (dapat dikonfigurasi via environment variable)
export const TEACHER_INVITATION_CODE =
  process.env.TEACHER_INVITATION_CODE || 'GURU-CARBONOVA-2026'

// Utilitas Keamanan Password Server
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex')
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computed = hashPassword(password, salt)
    return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(storedHash, 'hex'))
  } catch {
    return false
  }
}

// Helper Baca & Tulis File JSON Aman
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readUsers(): StoredUser[] {
  ensureDataDir()
  if (!fs.existsSync(USERS_FILE)) {
    const initialUsers = createInitialUsers()
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8')
    return initialUsers
  }
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error('Error reading users file:', err)
    return []
  }
}

export function writeUsers(users: StoredUser[]): void {
  ensureDataDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

function createInitialUsers(): StoredUser[] {
  const teacherSalt = generateSalt()
  const teacherHash = hashPassword('GuruDemo123!', teacherSalt)

  const studentSalt = generateSalt()
  const studentHash = hashPassword('SiswaDemo123!', studentSalt)

  return [
    {
      id: 'usr-teacher-01',
      name: 'Guru Demo',
      email: 'guru.demo@carbonova.test',
      role: 'teacher',
      status: 'active',
      passwordHash: teacherHash,
      salt: teacherSalt,
      createdAt: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'usr-student-01',
      name: 'Siswa Demo',
      email: 'siswa.demo@carbonova.test',
      role: 'student',
      status: 'active',
      passwordHash: studentHash,
      salt: studentSalt,
      createdAt: '2026-10-05T09:30:00.000Z',
    },
  ]
}

// In-memory Sessions Map dengan persistensi token
const activeSessions = new Map<string, SessionData>()

export function createSession(user: StoredUser): { token: string; expiresAt: number } {
  const token = generateToken()
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 jam
  activeSessions.set(token, {
    token,
    userId: user.id,
    role: user.role,
    expiresAt,
  })
  return { token, expiresAt }
}

export function getSession(token: string): SessionData | null {
  const session = activeSessions.get(token)
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token)
    return null
  }
  return session
}

// Pembaca Request Body Helper
function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

/**
 * Middleware Handler untuk Endpoint REST API Autentikasi & Registrasi
 */
export async function handleAuthApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url?.split('?')[0] || ''
  if (!url.startsWith('/api/')) return false

  // CORS Headers untuk pengujian lokal
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return true
  }

  // 1. ENDPOINT: REGISTRASI AKUN BARU (GURU / SISWA)
  // POST /api/auth/register
  if (url === '/api/auth/register' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req)
      const { name, email, password, confirmPassword, role, invitationCode } = body

      // Validasi kelengkapan field
      if (!name || !email || !password || !role) {
        sendJson(res, 400, {
          success: false,
          error: 'Nama lengkap, email, password, dan role wajib diisi.',
        })
        return true
      }

      // Validasi format email
      const cleanEmail = String(email).trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        sendJson(res, 400, {
          success: false,
          error: 'Format alamat email tidak valid.',
        })
        return true
      }

      // Validasi kecocokan password
      if (confirmPassword !== undefined && password !== confirmPassword) {
        sendJson(res, 400, {
          success: false,
          error: 'Konfirmasi password tidak cocok dengan password yang dimasukkan.',
        })
        return true
      }

      // Validasi kekuatan password (minimal 8 karakter, kombinasi huruf dan angka)
      if (String(password).length < 8) {
        sendJson(res, 400, {
          success: false,
          error: 'Kata sandi minimal 8 karakter.',
        })
        return true
      }
      if (!/(?=.*[A-Za-z])(?=.*\d)/.test(String(password))) {
        sendJson(res, 400, {
          success: false,
          error: 'Kata sandi harus mengandung kombinasi huruf dan angka.',
        })
        return true
      }

      // Cek apakah email sudah terdaftar
      const users = readUsers()
      const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail)
      if (existingUser) {
        sendJson(res, 409, {
          success: false,
          error: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau login ke akun Anda.',
        })
        return true
      }

      // Validasi khusus Role Guru (Teacher) dengan Kode Undangan
      let assignedRole: 'teacher' | 'student' = 'student'
      if (role === 'teacher') {
        const expectedCode = TEACHER_INVITATION_CODE
        const submittedCode = String(invitationCode || '').trim()

        if (!submittedCode) {
          sendJson(res, 403, {
            success: false,
            error: 'Kode undangan guru wajib diisi untuk registrasi akun tenaga pendidik.',
          })
          return true
        }

        if (submittedCode !== expectedCode) {
          sendJson(res, 403, {
            success: false,
            error: 'Kode undangan guru tidak valid. Silakan hubungi administrator sekolah untuk memperoleh kode resmi.',
          })
          return true
        }

        assignedRole = 'teacher'
      } else {
        assignedRole = 'student'
      }

      // Hashing password dengan PBKDF2 & Salt unik
      const salt = generateSalt()
      const passwordHash = hashPassword(password, salt)
      const newUserId = `usr-${assignedRole}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`

      const newUser: StoredUser = {
        id: newUserId,
        name: String(name).trim(),
        email: cleanEmail,
        role: assignedRole,
        status: 'active',
        passwordHash,
        salt,
        createdAt: new Date().toISOString(),
      }

      // Simpan permanen ke file database
      users.push(newUser)
      writeUsers(users)

      // Buat sesi autentikasi
      const { token, expiresAt } = createSession(newUser)

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      }

      sendJson(res, 201, {
        success: true,
        message: `Akun ${assignedRole === 'teacher' ? 'Guru' : 'Siswa'} berhasil didaftarkan.`,
        user: safeUser,
        token,
        expiresAt,
      })
      return true
    } catch (err: any) {
      console.error('API Register Error:', err)
      sendJson(res, 500, { success: false, error: 'Terjadi kesalahan internal server saat registrasi.' })
      return true
    }
  }

  // 2. ENDPOINT: LOGIN AKUN
  // POST /api/auth/login
  if (url === '/api/auth/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req)
      const { email, password } = body

      if (!email || !password) {
        sendJson(res, 400, { success: false, error: 'Email dan password wajib diisi.' })
        return true
      }

      const cleanEmail = String(email).trim().toLowerCase()
      const users = readUsers()
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail)

      if (!user) {
        sendJson(res, 401, { success: false, error: 'Email atau kata sandi tidak sesuai.' })
        return true
      }

      const isValid = verifyPassword(String(password), user.salt, user.passwordHash)
      if (!isValid) {
        sendJson(res, 401, { success: false, error: 'Email atau kata sandi tidak sesuai.' })
        return true
      }

      if (user.status !== 'active') {
        sendJson(res, 403, { success: false, error: 'Akun ini dinonaktifkan oleh pengelola.' })
        return true
      }

      // Update last login time
      user.lastLoginAt = new Date().toISOString()
      writeUsers(users)

      const { token, expiresAt } = createSession(user)
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      }

      sendJson(res, 200, {
        success: true,
        user: safeUser,
        token,
        expiresAt,
      })
      return true
    } catch (err: any) {
      console.error('API Login Error:', err)
      sendJson(res, 500, { success: false, error: 'Terjadi kesalahan internal server saat login.' })
      return true
    }
  }

  // 3. ENDPOINT: AMBIL SEMUA PENGGUNA SISWA (KHUSUS GURU)
  // GET /api/users/students
  if (url === '/api/users/students' && req.method === 'GET') {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')
    const session = token ? getSession(token) : null

    if (!session || session.role !== 'teacher') {
      sendJson(res, 403, { success: false, error: 'Hanya tenaga pengajar yang memiliki akses daftar siswa.' })
      return true
    }

    const users = readUsers()
    const students = users
      .filter((u) => u.role === 'student')
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      }))

    sendJson(res, 200, { success: true, students })
    return true
  }

  return false
}
