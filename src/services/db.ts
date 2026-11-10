import type {
  StoredUser,
  User,
  StudentQuizSubmission,
  StudentModuleProgress,
  TeacherSummaryStats,
  StudentSummaryStats,
} from '../types/auth'
import { generateSalt, hashPassword } from './crypto.ts'
import { LESSON_MODULES } from '../data/lessons.ts'
import { QUIZ_QUESTIONS } from '../data/questions.ts'

const USERS_STORAGE_KEY = 'carbonova_db_users_v1'
const SUBMISSIONS_STORAGE_KEY = 'carbonova_db_submissions_v1'
const PROGRESS_STORAGE_KEY = 'carbonova_db_progress_v1'

// Helper for safe localStorage access
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error)
    return defaultValue
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error)
  }
}

let dbInitialized = false
let initPromise: Promise<void> | null = null

/**
 * Inisialisasi Database: Memastikan akun demo terdaftar dengan password ber-hash & salt
 */
export async function initDatabase(): Promise<void> {
  if (dbInitialized) return
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      const users = getStoredItem<StoredUser[]>(USERS_STORAGE_KEY, [])
      let updated = false

      // Cek Akun Guru Demo
      const teacherIndex = users.findIndex(
        (u) => u.email.toLowerCase() === 'guru.demo@carbonova.test'
      )
      if (teacherIndex === -1) {
        const salt = generateSalt()
        const passwordHash = await hashPassword('GuruDemo123!', salt)
        const demoTeacher: StoredUser = {
          id: 'usr-teacher-01',
          name: 'Guru Demo',
          email: 'guru.demo@carbonova.test',
          role: 'teacher',
          status: 'active',
          createdAt: '2026-10-01T08:00:00.000Z',
          passwordHash,
          salt,
        }
        users.push(demoTeacher)
        updated = true
      }

      // Cek Akun Siswa Demo
      const studentIndex = users.findIndex(
        (u) => u.email.toLowerCase() === 'siswa.demo@carbonova.test'
      )
      if (studentIndex === -1) {
        const salt = generateSalt()
        const passwordHash = await hashPassword('SiswaDemo123!', salt)
        const demoStudent: StoredUser = {
          id: 'usr-student-01',
          name: 'Siswa Demo',
          email: 'siswa.demo@carbonova.test',
          role: 'student',
          status: 'active',
          createdAt: '2026-10-05T09:30:00.000Z',
          passwordHash,
          salt,
        }
        users.push(demoStudent)
        updated = true
      }

      if (updated) {
        setStoredItem(USERS_STORAGE_KEY, users)
      }
      dbInitialized = true
    } catch (err) {
      console.error('Failed to initialize database:', err)
    } finally {
      initPromise = null
    }
  })()

  return initPromise
}

export function getAllUsers(): User[] {
  const storedUsers = getStoredItem<StoredUser[]>(USERS_STORAGE_KEY, [])
  return storedUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }))
}

export function getStoredUserByEmail(email: string): StoredUser | undefined {
  const storedUsers = getStoredItem<StoredUser[]>(USERS_STORAGE_KEY, [])
  return storedUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
}

export function getUserById(id: string): User | undefined {
  const storedUsers = getStoredItem<StoredUser[]>(USERS_STORAGE_KEY, [])
  const found = storedUsers.find((u) => u.id === id)
  if (!found) return undefined
  return {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    status: found.status,
    createdAt: found.createdAt,
    lastLoginAt: found.lastLoginAt,
  }
}

export function getStudents(): User[] {
  const users = getAllUsers()
  return users.filter((u) => u.role === 'student')
}

export function updateUserLastLogin(userId: string): void {
  const users = getStoredItem<StoredUser[]>(USERS_STORAGE_KEY, [])
  const index = users.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users[index].lastLoginAt = new Date().toISOString()
    setStoredItem(USERS_STORAGE_KEY, users)
  }
}

// -------------------------------------------------------------
// SUBMISI KUIS / HASIL PENGERJAAN
// -------------------------------------------------------------

export function getAllSubmissions(): StudentQuizSubmission[] {
  return getStoredItem<StudentQuizSubmission[]>(SUBMISSIONS_STORAGE_KEY, [])
}

export function getSubmissionsByStudent(userId: string): StudentQuizSubmission[] {
  const all = getAllSubmissions()
  return all.filter((s) => s.userId === userId)
}

export function saveQuizSubmission(submission: StudentQuizSubmission): void {
  const all = getAllSubmissions()
  // Cegah duplikasi berdasarkan id attempt
  const existingIdx = all.findIndex((s) => s.id === submission.id)
  if (existingIdx !== -1) {
    all[existingIdx] = submission
  } else {
    all.unshift(submission)
  }
  setStoredItem(SUBMISSIONS_STORAGE_KEY, all)
}

export function deleteSubmission(id: string): boolean {
  const all = getAllSubmissions()
  const filtered = all.filter((s) => s.id !== id)
  setStoredItem(SUBMISSIONS_STORAGE_KEY, filtered)
  return true
}

// -------------------------------------------------------------
// PROGRESS MATERI SISWA
// -------------------------------------------------------------

export function getStudentProgress(userId: string): StudentModuleProgress[] {
  const all = getStoredItem<StudentModuleProgress[]>(PROGRESS_STORAGE_KEY, [])
  return all.filter((p) => p.userId === userId)
}

export function markModuleStudied(userId: string, moduleSlug: string): void {
  const all = getStoredItem<StudentModuleProgress[]>(PROGRESS_STORAGE_KEY, [])
  const exists = all.some((p) => p.userId === userId && p.moduleSlug === moduleSlug)
  if (!exists) {
    all.push({
      userId,
      moduleSlug,
      studiedAt: new Date().toISOString(),
    })
    setStoredItem(PROGRESS_STORAGE_KEY, all)
  }
}

// -------------------------------------------------------------
// STATISTIK GURU & SISWA
// -------------------------------------------------------------

export function getTeacherStats(): TeacherSummaryStats {
  const students = getStudents()
  const submissions = getAllSubmissions()
  const totalStudents = students.length
  const totalMaterials = LESSON_MODULES.length // 6 modul
  const totalQuestions = QUIZ_QUESTIONS.length // 30 soal
  const totalSubmissions = submissions.length

  let averageScore = 0
  if (totalSubmissions > 0) {
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0)
    averageScore = Math.round(totalScore / totalSubmissions)
  }

  // Hitung siswa yang belum mengerjakan kuis sama sekali
  const studentIdsWithSubmissions = new Set(submissions.map((s) => s.userId))
  const uncompletedStudentsCount = students.filter(
    (s) => !studentIdsWithSubmissions.has(s.id)
  ).length

  return {
    totalStudents,
    totalMaterials,
    totalQuestions,
    totalSubmissions,
    averageScore,
    uncompletedStudentsCount,
  }
}

export function getStudentStats(userId: string): StudentSummaryStats {
  const submissions = getSubmissionsByStudent(userId)
  const progress = getStudentProgress(userId)
  const totalMaterials = LESSON_MODULES.length
  const studiedMaterialsCount = progress.length
  const totalQuestions = QUIZ_QUESTIONS.length

  // Hitung jumlah soal yang telah dikerjakan oleh siswa ini (unik atau total)
  let completedQuestionsCount = 0
  const uniqueQuestionIds = new Set<string>()
  submissions.forEach((sub) => {
    sub.answers.forEach((ans) => {
      if (ans.selectedOptionIndex !== -1) {
        uniqueQuestionIds.add(ans.questionId)
      }
    })
  })
  completedQuestionsCount = uniqueQuestionIds.size
  const remainingQuestionsCount = Math.max(0, totalQuestions - completedQuestionsCount)

  let averageScore = 0
  if (submissions.length > 0) {
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0)
    averageScore = Math.round(totalScore / submissions.length)
  }

  return {
    totalMaterials,
    studiedMaterialsCount,
    totalQuestions,
    completedQuestionsCount,
    remainingQuestionsCount,
    averageScore,
    totalAttempts: submissions.length,
  }
}
