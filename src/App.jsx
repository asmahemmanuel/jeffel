import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import AdminPage from './pages/AdminPage'
import CoupleMessageModal from './components/CoupleMessageModal'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTopButton from './components/ScrollToTopButton'

export default function App() {
  const location = useLocation()

  // Only show the message modal on the home page
  const showModal = location.pathname === '/'

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden">
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
      <ScrollProgress />

      {/* Conditionally render the pop-up */}
      {showModal && <CoupleMessageModal />}

      {/* flex-grow ensures the routes take up proper space above the footer */}
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