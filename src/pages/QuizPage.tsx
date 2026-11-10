import { useState, useRef } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import {
  GraduationCap,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
  History,
  BookOpen,
  Filter,
} from 'lucide-react'
import { QUIZ_QUESTIONS } from '../data/questions'
import { useQuizHistory } from '../hooks/useQuizHistory'
import { useAuth } from '../context/AuthContext'
import { saveQuizSubmission } from '../services/db'
import QuizHistoryView from '../components/quiz/QuizHistoryView'
import type { QuizResult, QuizAnswerRecord } from '../types/quiz'
import {
  getSavedQuizAnswers,
  saveQuizAnswers,
  clearSavedQuizAnswers,
} from '../utils/quizStorage'
import { formatChemicalText } from '../components/ChemicalFormula'

export default function QuizPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const isHistoryRoute = location.pathname === '/riwayat' || searchParams.get('tab') === 'riwayat'
  const activeTab: 'kuis' | 'riwayat' = isHistoryRoute ? 'riwayat' : 'kuis'

  const { history, statistics, saveResult, deleteResult, clearHistory } = useQuizHistory()
  const { user } = useAuth()

  // Quiz state
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Topik')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // Ambil jawaban tersimpan langsung dari localStorage key 'quiz-answers' saat pertama kali dimuat / refresh
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() =>
    getSavedQuizAnswers()
  )
  const [isSubmitted, setIsSubmitted] = useState(false)
  const hasSavedRef = useRef(false)

  // Categories list
  const categories = [
    'Semua Topik',
    'Konsep Dasar Atom Karbon',
    'Identifikasi Hidrokarbon',
    'Tata Nama Senyawa',
    'Identifikasi Gugus Fungsi',
    'Isomer',
    'Analisis Sifat & Reaksi',
    'Penalaran Kimia',
  ]

  // Filtered questions
  const activeQuestions =
    selectedCategory === 'Semua Topik'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory)

  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0]
  const totalQuestions = activeQuestions.length

  const handleSelectOption = (optionIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => {
        const nextAnswers = {
          ...prev,
          [currentQuestionIndex]: optionIndex,
        }
        // Simpan langsung ke localStorage dengan key quiz-answers setiap kali user memilih jawaban
        saveQuizAnswers(nextAnswers)
        return nextAnswers
      })
    }
  }

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => activeQuestions[Number(qIdx)] && activeQuestions[Number(qIdx)].correctIndex === ans
  ).length
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  // Submit quiz and automatically save to localStorage history
  const handleSubmitQuiz = () => {
    if (hasSavedRef.current) return
    setIsSubmitted(true)
    hasSavedRef.current = true

    const attemptId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const answerRecords: QuizAnswerRecord[] = activeQuestions.map((q, idx) => {
      const chosenIdx = selectedAnswers[idx]
      const isCorrect = chosenIdx === q.correctIndex
      return {
        questionId: q.id,
        selectedOptionIndex: chosenIdx ?? -1,
        selectedAnswer: chosenIdx !== undefined ? q.options[chosenIdx] : '(Tidak dijawab)',
        correctOptionIndex: q.correctIndex,
        correctAnswer: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation,
        questionText: q.question,
        category: q.category,
        reasoningLevel: q.reasoningLevel,
      }
    })

    const newResult: QuizResult = {
      id: attemptId,
      quizId: selectedCategory.toLowerCase().replace(/\s+/g, '-'),
      quizTitle: `Evaluasi ${selectedCategory}`,
      category: selectedCategory,
      completedAt: new Date().toISOString(),
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: totalQuestions - correctCount,
      score: scorePercent,
      answers: answerRecords,
    }

    saveResult(newResult)

    if (user) {
      saveQuizSubmission({
        ...newResult,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      })
    }
  }

  // Hapus jawaban dari localStorage dan reset status kuis
  const handleResetQuiz = () => {
    clearSavedQuizAnswers()
    setSelectedAnswers({})
    setIsSubmitted(false)
    setCurrentQuestionIndex(0)
    hasSavedRef.current = false
  }

  const handleSwitchCategory = (cat: string) => {
    if (cat === selectedCategory) return
    setSelectedCategory(cat)
    handleResetQuiz()
  }

  const switchTab = (tab: 'kuis' | 'riwayat') => {
    setSearchParams(tab === 'riwayat' ? { tab: 'riwayat' } : {})
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          Evaluasi & Riwayat Belajar Kimia
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
          Latihan Soal & Evaluasi Penalaran
        </h1>
        <p className="text-sm text-slate-600">
          Uji pemahaman Anda melalui bank soal HOTS berbasis stimulus data, analisis ikatan kimia, dan evaluasi ilmiah.
        </p>
      </div>

      {/* Main Tabs: Kuis vs Riwayat */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <button
          onClick={() => switchTab('kuis')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'kuis'
              ? 'bg-[#101C3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#5DE0E6]" />
          <span>Pengerjaan Kuis</span>
        </button>

        <button
          onClick={() => switchTab('riwayat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'riwayat'
              ? 'bg-[#101C3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4 text-[#1DAA9A]" />
          <span>Riwayat & Progres Belajar</span>
          {history.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-700 text-[10px] font-black flex items-center justify-center ml-1">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PENGERJAAN KUIS */}
      {activeTab === 'kuis' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Category Filter Pills (hidden during active quiz if already answering, but switchable) */}
          {!isSubmitted && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  Pilih Topik Soal:
                </span>
                <span className="text-[11px] text-teal-700 font-bold">
                  {activeQuestions.length} Soal Tersedia
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSwitchCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#101C3A] text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Score Summary Banner if submitted */}
          {isSubmitted && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101C3A] via-[#16274e] to-[#1DAA9A] text-white space-y-5 shadow-xl animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Trophy className="w-7 h-7 text-[#5DE0E6]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5DE0E6] block">
                      Hasil Pengerjaan Kuis
                    </span>
                    <h3 className="font-extrabold text-2xl text-white">
                      Skor Anda: {scorePercent}%
                    </h3>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Benar {correctCount} dari {totalQuestions} Soal ({scorePercent >= 70 ? 'Lulus Kompeten 🎉' : 'Perlu Belajar Lagi 📚'})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="px-4 py-2.5 rounded-xl bg-white text-[#101C3A] text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset / Ulangi Kuis
                  </button>

                  <button
                    onClick={() => switchTab('riwayat')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                  >
                    <History className="w-3.5 h-3.5" />
                    Buka Riwayat
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5DE0E6]" />
                  Hasil pengerjaan otomatis tersimpan di localStorage browser Anda.
                </span>
                <Link
                  to="/materi"
                  className="font-bold underline hover:text-[#5DE0E6] inline-flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Pelajari Materi Terkait
                </Link>
              </div>
            </div>
          )}

          {/* Progress Bar & Question Counter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <span>
                  Soal {currentQuestionIndex + 1} dari {totalQuestions}
                </span>
                <span className="text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                  {Object.keys(selectedAnswers).length}/{totalQuestions} Terjawab
                </span>
              </div>

              {/* Tombol Reset / Ulangi Kuis di atas */}
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors border border-slate-200 hover:border-rose-200"
                title="Hapus jawaban di localStorage dan ulangi kuis dari awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset / Ulangi Kuis
              </button>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1DAA9A] h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
                    {currentQuestion.category}
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    Level: {currentQuestion.reasoningLevel}
                  </span>
                </div>
                <span className="font-mono text-slate-400 font-semibold">
                  Tingkat: {currentQuestion.difficulty}
                </span>
              </div>

              {/* Stimulus with ChemicalFormula formatting */}
              {currentQuestion.stimulus && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  <span className="font-bold text-teal-800 block mb-1">Stimulus Data Ilmiah:</span>
                  <div>{formatChemicalText(currentQuestion.stimulus)}</div>
                </div>
              )}

              {/* Question Text with ChemicalFormula formatting */}
              <h3 className="text-base sm:text-lg font-bold text-[#101C3A] leading-snug">
                {formatChemicalText(currentQuestion.question)}
              </h3>

              {/* Options with ChemicalFormula formatting */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx
                  const isCorrect = isSubmitted && idx === currentQuestion.correctIndex
                  const isWrong = isSubmitted && isSelected && idx !== currentQuestion.correctIndex

                  let optionClasses = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  if (isSelected && !isSubmitted) {
                    optionClasses =
                      'border-[#1DAA9A] bg-teal-50/50 text-[#101C3A] ring-1 ring-[#1DAA9A]'
                  } else if (isCorrect) {
                    optionClasses =
                      'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                  } else if (isWrong) {
                    optionClasses =
                      'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400'
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${optionClasses}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isWrong
                              ? 'bg-rose-600 text-white'
                              : isSelected
                                ? 'bg-[#1DAA9A] text-white'
                                : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{formatChemicalText(option)}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation shown after submission with ChemicalFormula formatting */}
              {isSubmitted && (
                <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-2 animate-in fade-in">
                  <div className="font-bold flex items-center gap-2 text-teal-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pembahasan Ilmiah:</span>
                  </div>
                  <div className="leading-relaxed text-slate-700">
                    {formatChemicalText(currentQuestion.explanation)}
                  </div>
                </div>
              )}

              {/* Pagination Navigation */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border ${
                    currentQuestionIndex === 0
                      ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title="Reset / Ulangi Kuis"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset / Ulangi Kuis
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] text-white text-xs font-bold hover:bg-[#182852] transition-colors"
                    >
                      Selanjutnya
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    !isSubmitted && (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1DAA9A] text-white text-xs font-bold hover:bg-[#15887B] transition-colors shadow-sm"
                      >
                        Kumpulkan Jawaban
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RIWAYAT KUIS & PROGRES BELAJAR */}
      {activeTab === 'riwayat' && (
        <QuizHistoryView
          history={history}
          statistics={statistics}
          onDeleteAttempt={deleteResult}
          onClearAll={clearHistory}
          onStartNewQuiz={() => switchTab('kuis')}
        />
      )}
    </div>
  )
}
