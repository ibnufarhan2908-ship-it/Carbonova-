import { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react'
import ChemicalFormula, { formatChemicalText } from '../ChemicalFormula'

interface MoleculeNamingChallenge {
  id: string
  formula: string
  structureType: string
  options: string[]
  correctIndex: number
  explanation: string
}

const CHALLENGES: MoleculeNamingChallenge[] = [
  {
    id: 'ch-1',
    formula: 'CH₃–CH(CH₃)–CH₂–CH₃',
    structureType: 'Alkana Bercabang',
    options: ['2-metilbutana', '3-metilbutana', 'dimetilpropana', 'pentana'],
    correctIndex: 0,
    explanation:
      'Rantai induk terpanjang memiliki 4 atom C (butana). Penomoran dimulai dari kiri agar cabang metil (–CH₃) mendapat nomor terendah yaitu nomor 2. Jadi namanya adalah 2-metilbutana.',
  },
  {
    id: 'ch-2',
    formula: 'CH₂=CH–CH₂–CH₃',
    structureType: 'Alkena Rantai Terbuka',
    options: ['1-butena', '2-butena', '3-butena', 'butana'],
    correctIndex: 0,
    explanation:
      'Rantai induk memiliki 4 atom C dengan ikatan rangkap dua. Penomoran wajib dimulai dari ujung terdekat dengan ikatan rangkap dua (ujung kiri = C1). Maka namanya adalah 1-butena.',
  },
  {
    id: 'ch-3',
    formula: 'CH₃–C≡C–CH₃',
    structureType: 'Alkuna Simetris',
    options: ['2-butuna', '1-butuna', 'dimetilasetilena', '2-butena'],
    correctIndex: 0,
    explanation:
      'Rantai 4 atom C dengan ikatan rangkap tiga di antara C2 dan C3. Dihitung dari ujung manapun posisi ikatan rangkap tiga berada di nomor 2. Nama IUPAC resminya adalah 2-butuna.',
  },
  {
    id: 'ch-4',
    formula: 'CH₃–CH₂–CH₂–OH',
    structureType: 'Alkohol (Alkanol)',
    options: ['1-propanol', '2-propanol', 'propil eter', 'propanal'],
    correctIndex: 0,
    explanation:
      'Gugus hidroksil (–OH) terikat pada atom C nomor 1 dari rantai propana (3 atom C). Sesuai aturan IUPAC, akhiran -a diganti -ol dengan menyertakan posisi gugus fungsi: 1-propanol.',
  },
  {
    id: 'ch-5',
    formula: 'CH₃–CO–CH₂–CH₃',
    structureType: 'Keton (Alkanon)',
    options: ['2-butanon', '1-butanon', 'etil metil eter', 'butanal'],
    correctIndex: 0,
    explanation:
      'Gugus karbonil (C=O) berada pada atom C nomor 2 dari rantai butana (4 karbon). Penomoran dari kiri memberi nomor 2 (lebih kecil daripada penomoran dari kanan yang menghasilkan nomor 3). Nama IUPAC: 2-butanon.',
  },
]

export default function NameMoleculeWidget() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const currentChallenge = CHALLENGES[currentIndex]

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
    setIsAnswered(true)
  }

  const handleNext = () => {
    setSelectedOption(null)
    setIsAnswered(false)
    setCurrentIndex((prev) => (prev + 1) % CHALLENGES.length)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setIsAnswered(false)
  }

  const isCorrect = selectedOption === currentChallenge.correctIndex

  return (
    <div className="bg-gradient-to-br from-slate-900 to-[#101C3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-[#5DE0E6] text-xs font-bold border border-teal-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            Aktivitas Interaktif PRD 5.2
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Name This Molecule!</h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Tantangan {currentIndex + 1} dari {CHALLENGES.length}
        </div>
      </div>

      {/* Chemical Structure Display */}
      <div className="p-6 rounded-2xl bg-black/40 border border-slate-700/60 text-center space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Tipe: {currentChallenge.structureType}
        </span>
        <div className="font-mono text-lg sm:text-2xl font-black text-[#5DE0E6] tracking-wide py-2 overflow-x-auto">
          <ChemicalFormula formula={currentChallenge.formula} />
        </div>
        <p className="text-xs text-slate-300">
          Berdasarkan aturan tata nama IUPAC, apa nama yang tepat untuk senyawa di atas?
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentChallenge.options.map((opt, idx) => {
          let btnStyle = 'bg-white/5 hover:bg-white/10 border-slate-700 text-slate-200'

          if (isAnswered) {
            if (idx === currentChallenge.correctIndex) {
              btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
            } else if (idx === selectedOption) {
              btnStyle = 'bg-rose-500/30 border-rose-400 text-rose-200 ring-2 ring-rose-500'
            } else {
              btnStyle = 'bg-white/5 border-slate-800 text-slate-500 opacity-60'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentChallenge.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentChallenge.correctIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation Feedback */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-in fade-in ${
            isCorrect
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100'
              : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
          }`}
        >
          <div className="font-bold flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{isCorrect ? 'Jawaban Anda Tepat!' : 'Belum Tepat, Pelajari Pembahasan:'}</span>
          </div>
          <div className="leading-relaxed opacity-90">{formatChemicalText(currentChallenge.explanation)}</div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          disabled={!isAnswered}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-white/5 flex items-center gap-1.5 transition-colors ${
            !isAnswered ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Coba Lagi
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1DAA9A] hover:bg-[#15887B] text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Tantangan Berikutnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

