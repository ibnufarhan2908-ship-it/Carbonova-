import { Link } from 'react-router-dom'
import { Atom, ShieldCheck, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#101C3A] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1DAA9A] to-[#5DE0E6] p-[2px] shadow-sm">
                <div className="w-full h-full bg-[#101C3A] rounded-[10px] flex items-center justify-center">
                  <Atom className="w-5 h-5 text-[#5DE0E6]" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Carbonova<span className="text-[#5DE0E6]">.</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform pembelajaran kimia interaktif untuk mengeksplorasi struktur molekul, ikatan,
              tata nama, gugus fungsi, dan sifat senyawa karbon bagi siswa SMA/MA.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DAA9A]" />
              <span>Sesuai Standar Tata Nama IUPAC & Kurikulum SMA</span>
            </div>
          </div>

          {/* Quick Links: Navigasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/materi" className="text-slate-400 hover:text-white transition-colors">
                  Katalog Materi
                </Link>
              </li>
              <li>
                <Link to="/molekul" className="text-slate-400 hover:text-white transition-colors">
                  Molecule Explorer
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-slate-400 hover:text-white transition-colors">
                  Carbon Lab
                </Link>
              </li>
              <li>
                <Link to="/latihan" className="text-slate-400 hover:text-white transition-colors">
                  Latihan & Evaluasi
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="text-slate-400 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Materi Pilihan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Modul Populer
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/materi?modul=kekhasan-atom-karbon"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Kekhasan Atom Karbon
                </Link>
              </li>
              <li>
                <Link
                  to="/materi?modul=hidrokarbon"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Alkana, Alkena, Alkuna
                </Link>
              </li>
              <li>
                <Link
                  to="/materi?modul=tata-nama-senyawa-karbon"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Aturan Tata Nama IUPAC
                </Link>
              </li>
              <li>
                <Link
                  to="/materi?modul=gugus-fungsi"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Gugus Fungsi Alkohol – Ester
                </Link>
              </li>
              <li>
                <Link
                  to="/materi?modul=isomer-senyawa-karbon"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Keisomeran Senyawa Karbon
                </Link>
              </li>
            </ul>
          </div>

          {/* Eksperimen Lab */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Eksperimen Virtual
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lab" className="text-slate-400 hover:text-white transition-colors">
                  Molecular Structure Builder
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-slate-400 hover:text-white transition-colors">
                  Simulasi Pembakaran (Combustion)
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-slate-400 hover:text-white transition-colors">
                  Uji Ketidakjenuhan Alkena
                </Link>
              </li>
              <li>
                <Link to="/latihan" className="text-slate-400 hover:text-white transition-colors">
                  Uji Penalaran HOTS Kimia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Carbonova. Dirancang untuk media pembelajaran Kimia SMA/MA.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-[#5DE0E6]" />
              Ilmu Kimia Berbasis Bukti
            </span>
            <span className="text-slate-600">•</span>
            <span>Versi MVP 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
