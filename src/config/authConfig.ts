/**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan satu akun guru resmi
 * tepercaya. Hanya akun yang sesuai dengan konfigurasi email/UID ini yang dapat memperoleh
 * role 'teacher' dan mengakses dashboard atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

/**
 * Mendapatkan email guru resmi dari environment variable (Vite / Node.js) atau default whitelist
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
 * Memeriksa apakah suatu alamat email adalah email guru tepercaya tunggal
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya yang diakui
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  if (isTeacherEmail(email)) return true

  if (uid && typeof uid === 'string') {
    const cleanUid = uid.trim()
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
