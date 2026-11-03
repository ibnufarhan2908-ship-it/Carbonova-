export interface QuizAnswerRecord {
  questionId: string
  selectedOptionIndex: number
  selectedAnswer: string
  correctOptionIndex: number
  correctAnswer: string
  isCorrect: boolean
  explanation: string
  questionText: string
  category: string
  reasoningLevel: string
}

export interface QuizResult {
  id: string
  quizId: string
  quizTitle: string
  category: string
  completedAt: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  score: number
  answers: QuizAnswerRecord[]
}

export interface QuizStatistics {
  totalQuizzesCompleted: number
  averageScore: number
  highestScore: number
  lowestScore: number
  latestQuizTitle: string | null
  latestQuizDate: string | null
}

