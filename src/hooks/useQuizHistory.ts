import { useState, useCallback } from 'react'
import type { QuizResult, QuizStatistics } from '../types/quiz'
import {
  getQuizHistory,
  saveQuizResult as saveStorageResult,
  deleteQuizResult as deleteStorageResult,
  clearQuizHistory as clearStorageHistory,
  getQuizStatistics,
} from '../utils/quizStorage'

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizResult[]>(() => getQuizHistory())
  const [statistics, setStatistics] = useState<QuizStatistics>(() => getQuizStatistics())

  const refreshData = useCallback(() => {
    const storedHistory = getQuizHistory()
    const stats = getQuizStatistics()
    setHistory(storedHistory)
    setStatistics(stats)
  }, [])

  const saveResult = useCallback(
    (result: QuizResult) => {
      const saved = saveStorageResult(result)
      refreshData()
      return saved
    },
    [refreshData]
  )

  const deleteResult = useCallback(
    (id: string) => {
      const success = deleteStorageResult(id)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData]
  )

  const clearHistory = useCallback(() => {
    const success = clearStorageHistory()
    if (success) {
      refreshData()
    }
    return success
  }, [refreshData])

  return {
    history,
    statistics,
    saveResult,
    deleteResult,
    clearHistory,
    refreshData,
  }
}
