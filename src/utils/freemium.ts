import { LESSON_MODULES } from '../data/lessons'
import type { LessonModule } from '../types/chemistry'

export const FREEMIUM_STORAGE_KEY = 'carbonova_freemium_access'

/**
 * Mendapatkan konfigurasi penyesuaian status gratis modul dari localStorage
 */
export function getFreemiumOverrides(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FREEMIUM_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch (e) {
    console.error('Gagal membaca status freemium dari localStorage:', e)
    return {}
  }
}

/**
 * Memeriksa apakah suatu modul bersifat gratis untuk diakses tamu tanpa login
 */
export function isModuleFree(
  moduleOrSlug: string | { slug: string; isFree?: boolean }
): boolean {
  const slug = typeof moduleOrSlug === 'string' ? moduleOrSlug : moduleOrSlug.slug
  const overrides = getFreemiumOverrides()

  // 1. Cek jika ada pengaturan dinamis dari Admin di localStorage
  if (typeof overrides[slug] === 'boolean') {
    return overrides[slug]
  }

  // 2. Cek properti isFree pada objek jika diteruskan
  if (typeof moduleOrSlug === 'object' && typeof moduleOrSlug.isFree === 'boolean') {
    return moduleOrSlug.isFree
  }

  // 3. Fallback ke data bawaan LESSON_MODULES
  const defaultModule = LESSON_MODULES.find((m) => m.slug === slug)
  if (defaultModule && typeof defaultModule.isFree === 'boolean') {
    return defaultModule.isFree
  }

  // Default: Modul 1 dan 2 gratis, modul lainnya berbayar/terkunci
  return slug === 'kekhasan-atom-karbon' || slug === 'hidrokarbon'
}

/**
 * Mengubah status gratis modul (digunakan oleh Admin / Guru)
 */
export function setModuleFree(slug: string, isFree: boolean): void {
  if (typeof window === 'undefined') return
  try {
    const overrides = getFreemiumOverrides()
    overrides[slug] = isFree
    localStorage.setItem(FREEMIUM_STORAGE_KEY, JSON.stringify(overrides))
    // Trigger event agar komponen React (seperti MaterialsPage dan Navbar) segera update
    window.dispatchEvent(
      new CustomEvent('carbonova:freemium_changed', { detail: { slug, isFree } })
    )
  } catch (e) {
    console.error('Gagal menyimpan status freemium ke localStorage:', e)
  }
}

/**
 * Mengembalikan seluruh daftar modul dengan status isFree terkini
 */
export function getModulesWithFreemiumStatus(): LessonModule[] {
  return LESSON_MODULES.map((m) => ({
    ...m,
    isFree: isModuleFree(m),
  }))
}
