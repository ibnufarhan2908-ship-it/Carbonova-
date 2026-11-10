export type UserRole = 'teacher' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  createdAt: string
  lastLoginAt?: string
}

export interface StoredUser extends User {
  passwordHash: string
  salt: string
}

export interface AuthSession {
  token: string
  user: User
  expiresAt: number
}

export interface StudentQuizSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  quizId: string
  quizTitle: string
  category: string
  completedAt: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  score: number
  answers: {
    questionId: string
    questionText: string
    selectedOptionIndex: number
    selectedAnswer: string
    correctOptionIndex: number
    correctAnswer: string
    isCorrect: boolean
    explanation: string
    category: string
    reasoningLevel?: string
  }[]
}

export interface StudentModuleProgress {
  userId: string
  moduleSlug: string
  studiedAt: string
}

export interface TeacherSummaryStats {
  totalStudents: number
  totalMaterials: number
  totalQuestions: number
  totalSubmissions: number
  averageScore: number
  uncompletedStudentsCount: number
}

export interface StudentSummaryStats {
  totalMaterials: number
  studiedMaterialsCount: number
  totalQuestions: number
  completedQuestionsCount: number
  remainingQuestionsCount: number
  averageScore: number
  totalAttempts: number
}

