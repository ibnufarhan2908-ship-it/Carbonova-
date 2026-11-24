import type { QuizResult, QuizStatistics } from '../types/quiz'

export interface QuizDraft {
  userId: string
  quizId: string
  category: string
  questionsVersion: string
  answers: Record<string, any>
  updatedAt: string
  version: 2
}

export interface StoredQuizResult extends QuizResult {
  userId?: string
}

export interface SaveQuizResultResponse {
  success: boolean
  data?: StoredQuizResult
  error?: string
}

/**
 * Format key draf jawaban:
 * Jika uid bernilai falsy atau 'guest': `carbonova:draft:guest:{category}:{quizId}:{questionsVersion}`
 * User terautentikasi: `carbonova:draft:${uid}:{category}:{quizId}:{questionsVersion}`
 */
export function getDraftStorageKey(
  uid?: string | null,
  category = 'all',
  quizId = 'default',
  questionsVersion = 'v1'
): string {
  const cleanCategory = category.trim() || 'all'
  const cleanQuizId = quizId.trim() || 'default'
  const cleanVersion = questionsVersion.trim() || 'v1'

  if (!uid || uid === 'guest') {
    return `carbonova:draft:guest:${cleanCategory}:${cleanQuizId}:${cleanVersion}`
  }
  return `carbonova:draft:${uid}:${cleanCategory}:${cleanQuizId}:${cleanVersion}`
}

/**
 * Format key riwayat kuis pengguna: `carbonova:history:{uid}`
 */
export function getHistoryStorageKey(uid?: string | null): string {
  if (!uid || uid === 'guest') {
    return 'carbonova:history:guest'
  }
  return `carbonova:history:${uid}`
}

/**
 * Menyimpan draf jawaban kuis (versi 2).
 * Answers disimpan sebagai Record<questionId, answer>.
 */
export function saveQuizDraft(
  uid: string | null | undefined,
  params: {
    quizId: string
    category: string
    questionsVersion?: string
    answers: Record<string, any>
  }
): boolean {
  if (typeof window === 'undefined') return false
  try {
    const qVersion = params.questionsVersion || 'v1'
    const key = getDraftStorageKey(uid, params.category, params.quizId, qVersion)
    const draftData: QuizDraft = {
      userId: uid && uid !== 'guest' ? uid : 'guest',
      quizId: params.quizId,
      category: params.category,
      questionsVersion: qVersion,
      answers: params.answers,
      updatedAt: new Date().toISOString(),
      version: 2,
    }
    localStorage.setItem(key, JSON.stringify(draftData))
    return true
  } catch (error) {
    console.error('Gagal menyimpan draf kuis ke localStorage:', error)
    return false
  }
}

/**
 * Mengambil draf jawaban kuis.
 */
export function getQuizDraft(
  uid: string | null | undefined,
  category = 'all',
  quizId = 'default',
  questionsVersion = 'v1'
): QuizDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const key = getDraftStorageKey(uid, category, quizId, questionsVersion)
    const rawData = localStorage.getItem(key)
    if (!rawData) return null
    const parsed = JSON.parse(rawData)
    if (parsed && typeof parsed === 'object') {
      return parsed as QuizDraft
    }
  } catch (error) {
    console.error('Gagal membaca draf kuis dari localStorage:', error)
  }
  return null
}

/**
 * Menghapus draf jawaban kuis.
 */
export function clearQuizDraft(
  uid: string | null | undefined,
  category = 'all',
  quizId = 'default',
  questionsVersion = 'v1'
): void {
  if (typeof window === 'undefined') return
  try {
    const key = getDraftStorageKey(uid, category, quizId, questionsVersion)
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Gagal menghapus draf kuis dari localStorage:', error)
  }
}

/**
 * Mendapatkan seluruh riwayat kuis dari localStorage.
 * HARUS return [] jika uid kosong, dan HARUS filter item.userId === uid.
 */
export function getQuizHistory(uid?: string | null): StoredQuizResult[] {
  if (typeof window === 'undefined' || !uid) return []
  try {
    const rawData = localStorage.getItem(getHistoryStorageKey(uid))
    let parsed: any[] = []

    if (rawData) {
      try {
        const items = JSON.parse(rawData)
        if (Array.isArray(items)) parsed = items
      } catch (e) {
        console.error('Gagal parse user history:', e)
      }
    }

    if (!Array.isArray(parsed)) {
      return []
    }

    // Wajib filter item.userId === uid
    const filtered = parsed.filter((item) => (item as StoredQuizResult).userId === uid)

    return (filtered as StoredQuizResult[]).sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
  } catch (error) {
    console.error('Gagal membaca riwayat kuis dari localStorage:', error)
    return []
  }
}

/**
 * Mengambil satu attempt kuis dengan validasi kepemilikan.
 * HARUS return null jika attempt.userId !== uid.
 */
export function getQuizAttempt(uid: string, attemptId: string): StoredQuizResult | null {
  if (!uid || !attemptId || typeof window === 'undefined') return null
  try {
    const history = getQuizHistory(uid)
    const attempt = history.find((item) => item.id === attemptId)
    if (!attempt) return null
    if (attempt.userId !== uid) {
      return null
    }
    return attempt
  } catch (error) {
    console.error('Gagal membaca attempt kuis:', error)
    return null
  }
}

/**
 * Menyimpan hasil kuis baru ke localStorage dengan userId dan key terisolasi.
 * Mengembalikan objek SaveQuizResultResponse untuk menghentikan klaim sukses palsu (AD11-03).
 */
export function saveQuizResult(
  result: QuizResult,
  uid?: string | null
): SaveQuizResultResponse {
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'Lingkungan eksekusi tidak memiliki akses ke window localStorage.',
    }
  }

  try {
    const itemUserId = uid || (result as StoredQuizResult).userId
    const resultToSave: StoredQuizResult = {
      ...result,
      userId: itemUserId,
    }

    if (itemUserId) {
      const userKey = getHistoryStorageKey(itemUserId)
      const userRaw = localStorage.getItem(userKey)
      let userHistory: StoredQuizResult[] = []
      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw)
          if (Array.isArray(parsed)) userHistory = parsed
        } catch {
          userHistory = []
        }
      }

      const existingIndex = userHistory.findIndex((item) => item.id === resultToSave.id)
      if (existingIndex === -1) {
        userHistory = [resultToSave, ...userHistory]
      } else {
        // Pembaruan attempt yang sama jika terjadi coba ulang (retry)
        userHistory[existingIndex] = resultToSave
      }

      localStorage.setItem(userKey, JSON.stringify(userHistory))
    }

    return {
      success: true,
      data: resultToSave,
    }
  } catch (error: any) {
    console.error('Gagal menyimpan hasil kuis ke localStorage:', error)
    const errorMsg =
      error?.name === 'QuotaExceededError' || error?.code === 22 || error?.code === 1014
        ? 'Kapasitas penyimpanan lokal browser telah penuh (QuotaExceededError).'
        : error?.message || 'Akses penyimpanan lokal ditolak oleh browser.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Mendapatkan satu hasil pengerjaan kuis berdasarkan ID pengerjaan
 */
export function getQuizResultById(id: string, uid?: string | null): StoredQuizResult | undefined {
  if (!uid) return undefined
  const history = getQuizHistory(uid)
  return history.find((item) => item.id === id)
}

/**
 * Menghapus satu entri riwayat kuis berdasarkan ID
 */
export function deleteQuizResult(id: string, uid?: string | null): boolean {
  if (typeof window === 'undefined' || !uid) return false
  try {
    const userKey = getHistoryStorageKey(uid)
    const userRaw = localStorage.getItem(userKey)
    if (userRaw) {
      const parsed: StoredQuizResult[] = JSON.parse(userRaw)
      const updated = parsed.filter((item) => item.id !== id)
      localStorage.setItem(userKey, JSON.stringify(updated))
    }
    return true
  } catch (error) {
    console.error('Gagal menghapus riwayat kuis:', error)
    return false
  }
}

/**
 * Menghapus seluruh riwayat pengerjaan kuis
 */
export function clearQuizHistory(uid?: string | null): boolean {
  if (typeof window === 'undefined' || !uid) return false
  try {
    localStorage.removeItem(getHistoryStorageKey(uid))
    return true
  } catch (error) {
    console.error('Gagal mengosongkan riwayat kuis:', error)
    return false
  }
}

/**
 * Menghapus seluruh state user tertentu (draf & history) saat logout.
 * Jika uid tidak disertakan atau bernilai 'guest', hanya menghapus state guest.
 */
export function clearUserState(uid?: string | null): void {
  if (typeof window === 'undefined') return
  try {
    const targetUid = uid && uid !== 'guest' ? uid : 'guest'
    const draftPrefix = targetUid === 'guest'
      ? 'carbonova:draft:guest:'
      : `carbonova:draft:${targetUid}:`
    const historyKey = getHistoryStorageKey(targetUid)

    localStorage.removeItem(historyKey)

    // Cari dan hapus semua key draf milik user ini
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(draftPrefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error('Gagal membersihkan state user dari localStorage:', error)
  }
}

/**
 * Menghitung metrik statistik dari data kuis yang tersimpan
 */
export function getQuizStatistics(uid?: string | null): QuizStatistics {
  if (!uid) {
    return {
      totalQuizzesCompleted: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      latestQuizTitle: null,
      latestQuizDate: null,
    }
  }

  const history = getQuizHistory(uid)

  if (history.length === 0) {
    return {
      totalQuizzesCompleted: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      latestQuizTitle: null,
      latestQuizDate: null,
    }
  }

  const scores = history.map((item) => item.score)
  const totalScore = scores.reduce((sum, current) => sum + current, 0)
  const averageScore = Math.round(totalScore / history.length)
  const highestScore = Math.max(...scores)
  const lowestScore = Math.min(...scores)

  const latest = history[0]

  return {
    totalQuizzesCompleted: history.length,
    averageScore,
    highestScore,
    lowestScore,
    latestQuizTitle: latest ? latest.quizTitle : null,
    latestQuizDate: latest ? latest.completedAt : null,
  }
}
