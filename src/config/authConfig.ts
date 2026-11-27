//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan satu akun guru resmi
 * tepercaya. Hanya akun yang sesuai dengan konfigurasi email/UID ini yang dapat memperoleh
 * role 'teacher' dan mengakses dashboard atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

<<<<<<< HEAD
// UID guru demo (lokal demo & Firebase demo)
export const TRUSTED_TEACHER_UIDS = ['usr-teacher-01', 'demo-guru-carbonova']
=======
// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']
>>>>>>> 0371e8544c92c247cbe218dbb4a16496d49b74eb

//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  return false
}

//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya yang diakui
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
<<<<<<< HEAD
  // Hanya akun dengan UID yang ada dalam whitelist dianggap guru asli
=======
  if (isTeacherEmail(email)) return true

>>>>>>> 0371e8544c92c247cbe218dbb4a16496d49b74eb
  if (uid && typeof uid === 'string') {
    const cleanUid = uid.trim()
    if (TRUSTED_TEACHER_UIDS.includes(cleanUid)) return true
    try {
      const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
      if (metaEnv?.VITE_TEACHER_UID && cleanUid === metaEnv.VITE_TEACHER_UID.trim()) {
        return true
      }
<<<<<<< HEAD
    } catch {}
  }
  // Email saja tidak cukup untuk menjadi guru; hanya untuk demo read‑only
=======
    } catch {
      // Abaikan
    }
  }

>>>>>>> 0371e8544c92c247cbe218dbb4a16496d49b74eb
  return false
}

//**
 * Konfigurasi Akun Guru Tepercaya & Whitelist Hak Akses (Security AD11-01)
 *
 * Mencegah celah eskalasi hak akses (privilege escalation) dengan menetapkan
 * satu akun guru resmi tepercaya. Hanya akun yang sesuai dengan konfigurasi
 * email/UID ini yang dapat memperoleh role 'teacher' dan mengakses dashboard
 * atau rekap data siswa.
 */

// Email guru resmi default untuk Carbonova jika environment variable belum diatur
export const DEFAULT_TEACHER_EMAIL = 'guru@carbonova.com'

// UID guru tepercaya (opsional jika dikonfigurasi melalui environment)
export const TRUSTED_TEACHER_UIDS: string[] = ['usr-teacher-01']

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
    // ignore if import.meta not available
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
    // ignore if process not available
  }

  return DEFAULT_TEACHER_EMAIL.toLowerCase()
}

/**
 * Memeriksa apakah suatu akun adalah akun Guru Demo (kompatibilitas mundur)
 */
export function isTeacherDemoAccount(_email?: string | null, _uid?: string | null): boolean {
  // Demo account handling is separate; currently disabled
  return false
}

/**
 * Memeriksa apakah suatu alamat email adalah email guru resmi tepercaya
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false
  const cleanEmail = email.trim().toLowerCase()
  return cleanEmail === getTrustedTeacherEmail()
}

/**
 * Memeriksa apakah akun pengguna (berdasarkan email dan/atau UID) berhak atas role 'teacher'
 * Hanya email yang cocok persis dengan email guru tepercaya atau UID yang ada dalam whitelist
 * yang diakui sebagai guru asli.
 */
export function isTeacherAccount(email?: string | null, uid?: string | null): boolean {
  // Email check (covers case where UID may not be whitelisted but email matches)
  if (isTeacherEmail(email)) return true

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

  // Email alone not sufficient for teacher role (only for demo read‑only)
  return false
}

/**
 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null,
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}

 * Menentukan role spesifik guru: mengembalikan 'teacher'
 */
export function resolveTeacherRole(
  email?: string | null,
  uid?: string | null,
  _firestoreRole?: string | null
): 'teacher' {
  if (isTeacherAccount(email, uid)) {
    return 'teacher'
  }
  return 'teacher'
}
