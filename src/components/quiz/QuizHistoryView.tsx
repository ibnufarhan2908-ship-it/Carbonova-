import { useState } from 'react'
import {
  Trophy,
  Calendar,
  Clock,
  Trash2,
  Eye,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react'
import type { QuizResult, QuizStatistics } from '../../types/quiz'
import QuizResultDetailModal from './QuizResultDetailModal'

interface QuizHistoryViewProps {
  history: QuizResult[]
  statistics: QuizStatistics
  onDeleteAttempt: (id: string) => void
  onClearAll: () => void
  onStartNewQuiz: () => void
}

export default function QuizHistoryView({
  history,
  statistics,
  onDeleteAttempt,
  onClearAll,
  onStartNewQuiz,
}: QuizHistoryViewProps) {
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [attemptToDelete, setAttemptToDelete] = useState<string | null>(null)

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 1. Progress Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Kuis Selesai</span>
            <Award className="w-4 h-4 text-[#1DAA9A]" />
          </div>
          <div className="text-2xl font-black text-[#101C3A]">
            {statistics.totalQuizzesCompleted}
          </div>
          <p className="text-[11px] text-slate-500">Percobaan tersimpan otomatis</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Skor</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-[#101C3A]">
            {statistics.averageScore}%
          </div>
          <p className="text-[11px] text-slate-500">Dari seluruh pengerjaan</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Skor Tertinggi</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {statistics.highestScore}%
          </div>
          <p className="text-[11px] text-slate-500">Pencapaian terbaik</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Aktivitas Terakhir</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-[#101C3A] truncate">
            {statistics.latestQuizTitle || 'Belum Ada'}
          </div>
          <p className="text-[11px] text-slate-500">
            {statistics.latestQuizDate
              ? new Date(statistics.latestQuizDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })
              : 'Mulai kuis pertama'}
          </p>
        </div>
      </div>

      {/* 2. History Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-xl text-[#101C3A]">
              Riwayat Pengerjaan Kuis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data pengerjaan Anda disimpan secara lokal (localStorage) dan tetap tersedia setelah refresh atau browser dibuka kembali.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-[#101C3A]">Belum Ada Riwayat Kuis</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum pernah menyelesaikan kuis. Kerjakan latihan soal untuk mengukur pemahaman konsep senyawa karbon Anda!
              </p>
            </div>
            <button
              onClick={onStartNewQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5DE0E6]" />
              <span>Mulai Kuis Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((attempt) => {
              const attemptDate = new Date(attempt.completedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div
                  key={attempt.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-[#101C3A]">
                        {attempt.quizTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                        {attempt.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          attempt.score >= 70
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {attempt.score >= 70 ? 'Lulus' : 'Perlu Belajar'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {attemptDate}
                      </span>
                      <span className="font-semibold text-slate-600">
                        Benar: {attempt.correctAnswers}/{attempt.totalQuestions} Soal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right pr-2">
                      <span className="text-xs text-slate-400 block font-bold">Skor</span>
                      <span
                        className={`text-xl font-black ${
                          attempt.score >= 70 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {attempt.score}%
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedResult(attempt)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>Detail</span>
                    </button>

                    <button
                      onClick={() => setAttemptToDelete(attempt.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus attempt ini"
                      aria-label="Hapus attempt ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delete Single Attempt */}
      {attemptToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#101C3A]">Hapus Hasil Pengerjaan Ini?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tindakan ini akan menghapus riwayat pengerjaan kuis ini secara permanen dari browser Anda.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setAttemptToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteAttempt(attemptToDelete)
                  setAttemptToDelete(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All History */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#101C3A]">Bersihkan Seluruh Riwayat?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Semua hasil dan statistik pengerjaan kuis yang tersimpan di localStorage akan dikosongkan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearAll()
                  setShowClearConfirm(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Ya, Bersihkan Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <QuizResultDetailModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  )
}

