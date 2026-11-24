import { useState, useCallback, useEffect } from 'react'
import type { QuizResult, QuizStatistics } from '../types/quiz'
import {
  getQuizHistory,
  saveQuizResult as saveStorageResult,
  deleteQuizResult as deleteStorageResult,
  clearQuizHistory as clearStorageHistory,
  getQuizStatistics,
  type SaveQuizResultResponse,
} from '../utils/quizStorage'

export function useQuizHistory(uid?: string | null) {
  const [history, setHistory] = useState<QuizResult[]>(() => (uid ? getQuizHistory(uid) : []))
  const [statistics, setStatistics] = useState<QuizStatistics>(() => getQuizStatistics(uid))

  const refreshData = useCallback(() => {
    if (!uid) {
      setHistory([])
      setStatistics(getQuizStatistics(null))
      return
    }
    const storedHistory = getQuizHistory(uid)
    const stats = getQuizStatistics(uid)
    setHistory(storedHistory)
    setStatistics(stats)
  }, [uid])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const saveResult = useCallback(
    (result: QuizResult): SaveQuizResultResponse => {
      const res = saveStorageResult(result, uid)
      if (res.success) {
        refreshData()
      }
      return res
    },
    [refreshData, uid]
  )

  const deleteResult = useCallback(
    (id: string) => {
      const success = deleteStorageResult(id, uid)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData, uid]
  )

  const clearHistory = useCallback(() => {
    const success = clearStorageHistory(uid)
    if (success) {
      refreshData()
    }
    return success
  }, [refreshData, uid])

  return {
    history,
    statistics,
    saveResult,
    deleteResult,
    clearHistory,
    refreshData,
    setHistory,
  }
}
