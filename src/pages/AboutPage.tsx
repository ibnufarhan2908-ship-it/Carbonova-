import { Atom, BookOpen, Compass, FlaskConical, GraduationCap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <Atom className="w-3.5 h-3.5" />
          Tentang Carbonova
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101C3A] tracking-tight">
          Menghadirkan Kimia Karbon yang Hidup dan Bermakna
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Carbonova dirancang untuk mengatasi kesulitan siswa dalam memahami struktur tiga dimensi,
          tata nama sistematis, serta hubungan antara rumus dan sifat fisik-kimia senyawa organik.
        </p>
      </div>

      {/* Vision & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">Visi Kami</span>
          <h3 className="text-xl font-bold text-[#101C3A]">Belajar Kimia Tanpa Sekadar Menghafal</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kimia organik adalah ilmu tentang pola, geometri, dan logika ikatan elektron. Melalui eksplorasi digital dan simulasi interaktif, siswa dapat membangun pemahaman konseptual yang kokoh dan tahan lama.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1DAA9A]">Standar Keilmuan</span>
          <h3 className="text-xl font-bold text-[#101C3A]">Akurasi & Standar IUPAC</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Seluruh aturan tata nama, rumus struktur, persamaan stoikiometri, dan data sifat fisik senyawa disusun dengan cermat mengacu pada standar IUPAC Blue Book serta kurikulum kimia SMA/MA nasional.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Carbonova */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#101C3A] text-center">Empat Pilar Pembelajaran</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1DAA9A] mx-auto flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#101C3A]">Modul Terstruktur</h4>
            <p className="text-xs text-slate-500">6 modul materi komprehensif dari dasar hingga turunan alkana.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#101C3A]">Molecule Explorer</h4>
            <p className="text-xs text-slate-500">Visualisasi 2D bola-tongkat dan rumus struktur senyawa real.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#101C3A]">Carbon Lab</h4>
            <p className="text-xs text-slate-500">Simulasi pembakaran, uji ikatan rangkap, dan builder molekul.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#101C3A]">Evaluasi HOTS</h4>
            <p className="text-xs text-slate-500">Soal penalaran berbasis stimulus, analisis, dan bukti ilmiah.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
