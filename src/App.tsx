import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import MaterialsPage from './pages/MaterialsPage'
import MoleculeExplorerPage from './pages/MoleculeExplorerPage'
import CarbonLabPage from './pages/CarbonLabPage'
import QuizPage from './pages/QuizPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="materi" element={<MaterialsPage />} />
          <Route path="molekul" element={<MoleculeExplorerPage />} />
          <Route path="lab" element={<CarbonLabPage />} />
          <Route path="latihan" element={<QuizPage />} />
          <Route path="tentang" element={<AboutPage />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
