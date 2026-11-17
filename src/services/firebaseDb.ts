import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase.ts'
import type {
  User,
  StudentQuizSubmission,
  StudentModuleProgress,
  TeacherSummaryStats,
  StudentSummaryStats,
} from '../types/auth.ts'
import { LESSON_MODULES } from '../data/lessons.ts'
import { QUIZ_QUESTIONS } from '../data/questions.ts'

const USERS_COLLECTION = 'users'
const SUBMISSIONS_COLLECTION = 'quiz_submissions'
const PROGRESS_COLLECTION = 'module_progress'

/**
 * Menyimpan hasil pengerjaan kuis siswa ke Firestore
 */
export async function saveSubmissionToFirestore(submission: StudentQuizSubmission): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false
  try {
    const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submission.id)
    await setDoc(submissionRef, submission)
    return true
  } catch (error) {
    console.error('Gagal menyimpan hasil kuis ke Firestore:', error)
    return false
  }
}

/**
 * Mengambil seluruh hasil kuis dari Firestore (untuk guru)
 */
export async function getAllSubmissionsFromFirestore(): Promise<StudentQuizSubmission[]> {
  if (!db || !isFirebaseConfigured) return []
  try {
    const q = query(collection(db, SUBMISSIONS_COLLECTION), orderBy('completedAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as StudentQuizSubmission)
  } catch (error) {
    console.error('Gagal mengambil submisi kuis dari Firestore:', error)
    return []
  }
}

/**
 * Mengambil seluruh hasil kuis siswa tertentu dari Firestore
 */
export async function getStudentSubmissionsFromFirestore(userId: string): Promise<StudentQuizSubmission[]> {
  if (!db || !isFirebaseConfigured) return []
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as StudentQuizSubmission)
  } catch (error) {
    console.error('Gagal mengambil submisi siswa dari Firestore:', error)
    return []
  }
}

/**
 * Menghapus submisi kuis dari Firestore
 */
export async function deleteSubmissionFromFirestore(submissionId: string): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false
  try {
    await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId))
    return true
  } catch (error) {
    console.error('Gagal menghapus submisi dari Firestore:', error)
    return false
  }
}

/**
 * Menyimpan progres materi yang telah dipelajari siswa ke Firestore
 */
export async function saveModuleProgressToFirestore(
  userId: string,
  moduleSlug: string
): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false
  try {
    const progressDocId = `${userId}_${moduleSlug}`
    const progressRef = doc(db, PROGRESS_COLLECTION, progressDocId)
    const data: StudentModuleProgress = {
      userId,
      moduleSlug,
      studiedAt: new Date().toISOString(),
    }
    await setDoc(progressRef, data)
    return true
  } catch (error) {
    console.error('Gagal menyimpan progres materi ke Firestore:', error)
    return false
  }
}

/**
 * Mengambil progres materi siswa dari Firestore
 */
export async function getStudentProgressFromFirestore(userId: string): Promise<StudentModuleProgress[]> {
  if (!db || !isFirebaseConfigured) return []
  try {
    const q = query(collection(db, PROGRESS_COLLECTION), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as StudentModuleProgress)
  } catch (error) {
    console.error('Gagal mengambil progres siswa dari Firestore:', error)
    return []
  }
}

/**
 * Mengambil daftar seluruh siswa dari Firestore
 */
export async function getFirestoreStudents(): Promise<User[]> {
  if (!db || !isFirebaseConfigured) return []
  try {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'student'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as User)
  } catch (error) {
    console.error('Gagal mengambil data siswa dari Firestore:', error)
    return []
  }
}

/**
 * Menghitung ringkasan statistik guru berdasarkan data Firestore
 */
export async function getTeacherStatsFromFirestore(): Promise<TeacherSummaryStats> {
  const students = await getFirestoreStudents()
  const submissions = await getAllSubmissionsFromFirestore()

  const totalStudents = students.length
  const totalMaterials = LESSON_MODULES.length
  const totalQuestions = QUIZ_QUESTIONS.length
  const totalSubmissions = submissions.length

  let averageScore = 0
  if (totalSubmissions > 0) {
    const sum = submissions.reduce((acc, curr) => acc + curr.score, 0)
    averageScore = Math.round(sum / totalSubmissions)
  }

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

/**
 * Menghitung ringkasan statistik siswa dari Firestore
 */
export async function getStudentStatsFromFirestore(userId: string): Promise<StudentSummaryStats> {
  const submissions = await getStudentSubmissionsFromFirestore(userId)
  const progress = await getStudentProgressFromFirestore(userId)

  const totalMaterials = LESSON_MODULES.length
  const studiedMaterialsCount = progress.length
  const totalQuestions = QUIZ_QUESTIONS.length

  const uniqueQuestionIds = new Set<string>()
  submissions.forEach((sub) => {
    sub.answers.forEach((ans) => {
      if (ans.selectedOptionIndex !== -1) {
        uniqueQuestionIds.add(ans.questionId)
      }
    })
  })

  const completedQuestionsCount = uniqueQuestionIds.size
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
