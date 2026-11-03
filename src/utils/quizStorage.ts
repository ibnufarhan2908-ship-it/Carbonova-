import type { QuizResult, QuizStatistics } from '../types/quiz'

const STORAGE_KEY = 'carbonova_quiz_history_v1'

/**
 * Mendapatkan seluruh riwayat kuis dari localStorage
 * Diurutkan berdasarkan tanggal terbaru (descending)
 */
export function getQuizHistory(): QuizResult[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY)
    if (!rawData) {
      return []
    }
    const parsed = JSON.parse(rawData)
    if (!Array.isArray(parsed)) {
      console.warn('Format data riwayat kuis di localStorage tidak valid, mereset...')
      return []
    }
    // Urutkan attempt terbaru di urutan pertama
    return parsed.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
  } catch (error) {
    console.error('Gagal membaca riwayat kuis dari localStorage:', error)
    return []
  }
}

/**
 * Menyimpan hasil kuis baru ke localStorage
 * Menjamin attempt lama tidak tertimpa dan ID unik tercipta
 */
export function saveQuizResult(result: QuizResult): QuizResult {
  try {
    const currentHistory = getQuizHistory()
    
    // Cek apakah ID pengerjaan ini sudah pernah disimpan (mencegah duplikasi akibat re-render)
    const existingIndex = currentHistory.findIndex((item) => item.id === result.id)
    if (existingIndex !== -1) {
      return currentHistory[existingIndex]
    }

    const updatedHistory = [result, ...currentHistory]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    return result
  } catch (error) {
    console.error('Gagal menyimpan hasil kuis ke localStorage:', error)
    return result
  }
}

/**
 * Mendapatkan satu hasil pengerjaan kuis berdasarkan ID pengerjaan
 */
export function getQuizResultById(id: string): QuizResult | undefined {
  const history = getQuizHistory()
  return history.find((item) => item.id === id)
}

/**
 * Menghapus satu entri riwayat kuis berdasarkan ID
 */
export function deleteQuizResult(id: string): boolean {
  try {
    const currentHistory = getQuizHistory()
    const updatedHistory = currentHistory.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    return true
  } catch (error) {
    console.error('Gagal menghapus riwayat kuis:', error)
    return false
  }
}

/**
 * Menghapus seluruh riwayat pengerjaan kuis
 */
export function clearQuizHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Gagal mengosongkan riwayat kuis:', error)
    return false
  }
}

/**
 * Menghitung metrik statistik dari seluruh data kuis yang tersimpan
 */
export function getQuizStatistics(): QuizStatistics {
  const history = getQuizHistory()

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

