/**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan satu akun guru resmi
 * tepercaya. Hanya akun yang sesuai dengan konfigurasi email/UID ini yang dapat memperoleh
 * role 'teacher' dan mengakses dashboard atau rekap data siswa.
 */

// Email guru demo default untuk Carbonova
export const DEFAULT_TEACHER_EMAIL = 'guru.demo@carbonova.test'
// Email guru demo yang diberikan akses read‑only
export const DEMO_TEACHER_EMAIL = 'guru.demo@carbonova.test'


// UID guru demo (lokal demo & Firebase demo)
export const TRUSTED_TEACHER_UIDS = ['usr-teacher-01', 'demo-guru-carbonova']

/**
 * Mendapatkan email guru resmi / demo dari environment variable (Vite / Node.js) atau default whitelist
 */
export function getTrustedTeacherEmail(): string {
  // Vite client-side environment (import.meta.env)
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
    if (metaEnv?.VITE_TEACHER_EMAIL && metaEnv.VITE_TEACHER_EMAIL.trim()) {
      return metaEnv.VITE_TEACHER_EMAIL.trim().toLowerCase()
    }
  } catch {
    // Abaikan jika import.meta tidak tersedia
  }

  // Node.js test environment (process.env)
  try {
    const globalObj = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }
    if (globalObj.process?.env?.VITE_TEACHER_EMAIL && globalObj.process.env.VITE_TEACHER_EMAIL.trim()) {
      return globalObj.process.env.VITE_TEACHER_EMAIL.trim().toLowerCase()
    }
    if (globalObj.process?.env?.TEACHER_EMAIL && globalObj.process.env.TEACHER_EMAIL.trim()) {
      return globalObj.process.env.TEACHER_EMAIL.trim().toLowerCase()
    }
  } catch {
    // Abaikan jika process tidak tersedia
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (read-only)
 */
export function isTeacherDemoAccount(email?: string | null, uid?: string | null): boolean {
  if (!email && !uid) return false
  const cleanEmail = email ? email.trim().toLowerCase() : ''
  if (cleanEmail === DEFAULT_TEACHER_EMAIL.toLowerCase()) return true
  if (uid && TRUSTED_TEACHER_UIDS.includes(uid.trim())) return true
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru (demo atau terotorisasi)
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas akses guru ('teacher' atau 'teacher_demo')
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Hanya akun dengan UID yang ada dalam whitelist dianggap guru asli
  if (uid && typeof uid === 'string') {
    const cleanUid = uid.trim()
    if (TRUSTED_TEACHER_UIDS.includes(cleanUid)) return true
    try {
      const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
      if (metaEnv?.VITE_TEACHER_UID && cleanUid === metaEnv.VITE_TEACHER_UID.trim()) {
        return true
      }
    } catch {}
  }
  // Email saja tidak cukup untuk menjadi guru; hanya untuk demo read‑only
  return false
}
  if (isTeacherEmail(email)) return true

  if (uid && typeof uid === 'string') {
    const cleanUid = uid.trim()
    if (TRUSTED_TEACHER_UIDS.includes(cleanUid)) return true

    try {
      const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
      if (metaEnv?.VITE_TEACHER_UID && cleanUid === metaEnv.VITE_TEACHER_UID.trim()) {
        return true
      }
    } catch {
      // Abaikan
    }
  }

  return false
}

/**
 * Menentukan role spesifik guru: 'teacher_demo' untuk guru demo (read-only), atau 'teacher' untuk guru asli
 */
export function resolveTeacherRole(email?: string | null, uid?: string | null, firestoreRole?: string | null): 'teacher' | 'teacher_demo' {
  // Jika akun adalah akun guru demo default
  if (isTeacherDemoAccount(email, uid)) {
    return 'teacher_demo'
  }
  // Jika akun memiliki role teacher/guru di Firestore dan telah diverifikasi admin
  if (firestoreRole === 'teacher_demo') {
    return 'teacher_demo'
  }
  return 'teacher'
}
