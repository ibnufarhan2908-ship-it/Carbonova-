import { useState } from 'react'
import {
  GraduationCap,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
} from 'lucide-react'
import { QUIZ_QUESTIONS } from '../data/questions'

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUIZ_QUESTIONS.length

  const handleSelectOption = (optionIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: optionIndex,
      }))
    }
  }

  // Calculate final score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => QUIZ_QUESTIONS[Number(qIdx)].correctIndex === ans
  ).length
  const scorePercent = Math.round((correctCount / totalQuestions) * 100)

  const handleResetQuiz = () => {
    setSelectedAnswers({})
    setIsSubmitted(false)
    setCurrentQuestionIndex(0)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          Evaluasi & Latihan Soal Kimia
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
          Latihan Soal Penalaran Kimia Organik
        </h1>
        <p className="text-sm text-slate-600">
          Uji pemahaman Anda melalui soal berbasis analisis data, evaluasi klaim, dan penalaran ilmiah.
        </p>
      </div>

      {/* Score Summary Banner if submitted */}
      {isSubmitted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101C3A] to-[#1DAA9A] text-white space-y-4 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#5DE0E6]" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">Hasil Evaluasi Anda</h3>
                <p className="text-xs text-slate-200">
                  Benar {correctCount} dari {totalQuestions} Soal ({scorePercent}%)
                </p>
              </div>
            </div>
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl bg-white text-[#101C3A] text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ulangi Kuis
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar & Question Counter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>
            Soal {currentQuestionIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-teal-700 font-mono">
            {Object.keys(selectedAnswers).length}/{totalQuestions} Terjawab
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#1DAA9A] h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
              {currentQuestion.category}
            </span>
            <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Level: {currentQuestion.reasoningLevel}
            </span>
          </div>
          <span className="font-mono text-slate-400 font-semibold">{currentQuestion.difficulty}</span>
        </div>

        {/* Stimulus if exists */}
        {currentQuestion.stimulus && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-teal-800 block mb-1">Stimulus Data:</span>
            {currentQuestion.stimulus}
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-[#101C3A] leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === idx
            const isCorrect = isSubmitted && idx === currentQuestion.correctIndex
            const isWrong = isSubmitted && isSelected && idx !== currentQuestion.correctIndex

            let optionClasses = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            if (isSelected && !isSubmitted) {
              optionClasses = 'border-[#1DAA9A] bg-teal-50/50 text-[#101C3A] ring-1 ring-[#1DAA9A]'
            } else if (isCorrect) {
              optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
            } else if (isWrong) {
              optionClasses = 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400'
            }

            return (
              <button
                key={idx}
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
                <span className="pt-0.5 leading-relaxed">{option}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation shown after submission */}
        {isSubmitted && (
          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-2 animate-in fade-in">
            <div className="font-bold flex items-center gap-2 text-teal-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pembahasan Ilmiah:</span>
            </div>
            <p className="leading-relaxed text-slate-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Pagination Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
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

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] text-white text-xs font-bold hover:bg-[#182852] transition-colors"
            >
              Selanjutnya
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            !isSubmitted && (
              <button
                onClick={() => setIsSubmitted(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1DAA9A] text-white text-xs font-bold hover:bg-[#15887B] transition-colors shadow-sm"
              >
                Kumpulkan Jawaban
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
