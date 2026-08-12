import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import AdminPage from './pages/AdminPage'
import CoupleMessageModal from './components/CoupleMessageModal'
import ScrollToTopButton from './components/ScrollToTopButton'

export default function App() {
  const location = useLocation()
  const showModal = location.pathname === '/'
  const [animationsReady, setAnimationsReady] = useState(false)

  return (
    <main
      className={`relative w-full min-h-screen flex flex-col overflow-x-hidden ${
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
            iconTheme: { primary: '#F8F3E7', secondary: '#006B3C' },
          },
        }}
      />

      {showModal && (
        <CoupleMessageModal onClose={() => setAnimationsReady(true)} />
      )}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/adminjeffel" element={<AdminPage />} />
        </Routes>
      </div>

      <ScrollToTopButton />
    </main>
  )
}