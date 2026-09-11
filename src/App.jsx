import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import ProgramOutline from './pages/ProgramOutline'
import AdminPage from './pages/AdminPage'
import CoupleMessageModal from './components/CoupleMessageModal'
import ScrollToTopButton from './components/ScrollToTopButton'

export default function App() {
  const location = useLocation()
  const [animationsReady, setAnimationsReady] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const hasNavigatedAway = useRef(false)

  useEffect(() => {
    if (location.pathname === '/') {
      // Only show modal on initial load or browser refresh, not when returning from internal pages
      if (!hasNavigatedAway.current) {
        setShowModal(true)
      } else {
        setAnimationsReady(true)
      }
    } else {
      hasNavigatedAway.current = true
      setShowModal(false)
    }
  }, [location.pathname])

  const handleCloseModal = () => {
    setShowModal(false)
    setAnimationsReady(true)
  }

  return (
    <main
      className={`relative w-full min-h-screen flex flex-col overflow-x-clip ${
        !animationsReady ? 'pause-animations' : ''
      }`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#006B3C',
              color: '#F8F3E7',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '8px',
            },
            iconTheme: {
              primary: '#F8F3E7',
              secondary: '#006B3C',
            },
          },
        }}
      />

      {showModal && (
        <CoupleMessageModal onClose={handleCloseModal} />
      )}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/program" element={<ProgramOutline />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/adminjeffel" element={<AdminPage />} />
        </Routes>
      </div>

      <ScrollToTopButton />
    </main>
  )
}