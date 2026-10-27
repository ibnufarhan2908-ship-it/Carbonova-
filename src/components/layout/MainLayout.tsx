import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../navigation/Navbar'
import Footer from './Footer'

export default function MainLayout() {
  const { pathname } = useLocation()

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#1D2939]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
