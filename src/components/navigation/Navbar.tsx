import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Atom,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  History,
  Info,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  LogIn,
} from 'lucide-react'
import { LESSON_MODULES } from '../../data/lessons'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [materiDropdownOpen, setMateriDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMateriDropdownOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/beranda') {
      return location.pathname === '/beranda'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navLinks = [
    { name: 'Beranda', path: '/beranda', icon: Atom },
    { name: 'Materi', path: '/materi', icon: BookOpen, hasDropdown: true },
    { name: 'Molecule Explorer', path: '/molekul', icon: Compass },
    { name: 'Carbon Lab', path: '/lab', icon: FlaskConical },
    { name: 'Latihan Soal', path: '/latihan', icon: GraduationCap },
    { name: 'Riwayat Kuis', path: '/riwayat', icon: History },
    { name: 'Tentang', path: '/tentang', icon: Info },
  ]

  const dashboardPath = user?.role === 'teacher' ? '/guru/dashboard' : '/siswa/dashboard'
  const dashboardLabel = user?.role === 'teacher' ? 'Dashboard Guru' : 'Dashboard Siswa'

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand */}
          <Link
            to={isAuthenticated ? dashboardPath : '/login'}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#101C3A] via-[#152a57] to-[#1DAA9A] p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
              <div className="w-full h-full bg-[#101C3A] rounded-[10px] flex items-center justify-center">
                <Atom className="w-5 h-5 text-[#5DE0E6] group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#101C3A] flex items-center gap-1">
                Carbonova
                <span className="w-2 h-2 rounded-full bg-[#1DAA9A] inline-block"></span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Kimia Karbon SMA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path)

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => setMateriDropdownOpen(true)}
                    onMouseLeave={() => setMateriDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        active
                          ? 'text-[#101C3A] bg-slate-100 font-bold'
                          : 'text-slate-600 hover:text-[#101C3A] hover:bg-slate-50'
                      }`}
                    >
                      <link.icon className={`w-4 h-4 ${active ? 'text-[#1DAA9A]' : 'text-slate-400'}`} />
                      {link.name}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          materiDropdownOpen ? 'rotate-180 text-[#1DAA9A]' : 'text-slate-400'
                        }`}
                      />
                    </Link>

                    {/* Dropdown Menu */}
                    {materiDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 pt-2 z-50">
                        <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-200/90 space-y-1">
                          <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Modul Senyawa Karbon
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                              6 Modul
                            </span>
                          </div>
                          {LESSON_MODULES.map((module) => (
                            <Link
                              key={module.id}
                              to={`/materi?modul=${module.slug}`}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-slate-600 group-hover:text-teal-700">
                                {module.moduleNumber}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                                  {module.title}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">
                                  {module.subtitle}
                                </span>
                              </div>
                            </Link>
                          ))}
                          <div className="pt-1.5 border-t border-slate-100">
                            <Link
                              to="/materi"
                              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-teal-50 text-xs font-bold text-teal-700 transition-colors"
                            >
                              <span>Buka Semua Modul</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-[#101C3A] bg-slate-100/90 font-bold'
                      : 'text-slate-600 hover:text-[#101C3A] hover:bg-slate-50'
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${active ? 'text-[#1DAA9A]' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* User Auth Section & Mobile Hamburger Button */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Link to Role Dashboard */}
                <Link
                  to={dashboardPath}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    location.pathname.startsWith(dashboardPath)
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                  <span>{dashboardLabel}</span>
                </Link>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#101C3A] to-[#1DAA9A] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-teal-600 uppercase">
                      {user.role === 'teacher' ? 'Guru' : 'Siswa'}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                  title="Keluar dari sesi"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101C3A] hover:bg-[#182852] text-white text-xs font-bold shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-[#5DE0E6]" />
                <span>Masuk</span>
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#101C3A] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          {isAuthenticated && user && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#101C3A] to-[#1DAA9A] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-teal-600 font-semibold uppercase">
                    {user.role === 'teacher' ? 'Tenaga Pengajar (Guru)' : 'Siswa'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-teal-50 text-teal-800 border border-teal-200/60"
            >
              <LayoutDashboard className="w-5 h-5 text-teal-600" />
              <span>{dashboardLabel}</span>
            </Link>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-[#1DAA9A] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${active ? 'text-[#1DAA9A]' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#101C3A] text-white text-sm font-bold shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#5DE0E6]" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
