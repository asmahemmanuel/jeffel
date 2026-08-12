import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import rings from '../assets/rings.webp'
import { couple } from '../data/content'

const navLinks = [
  { label: 'Our Story', href: '#story' },
  { label: 'Our Colors', href: '#colors' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Directions', href: '#directions' },
  { label: 'Q & A', href: '#qanda' },
  { label: 'Countdown', href: '#countdown' },
  { label: 'Gallery', href: '/gallery', isRoute: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLinkClick = (link) => {
    setOpen(false)

    if (link.isRoute) {
      setTimeout(() => navigate(link.href), 300)
      return
    }

    // Section link: navigate home first if on another page, then scroll
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(link.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } else {
      setTimeout(() => {
        const el = document.querySelector(link.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed top-5 left-5 z-40 w-12 h-12 rounded-full bg-emerald-green text-off-white flex items-center justify-center shadow-lg hover:bg-emerald-green/90 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-off-white z-50 shadow-2xl flex flex-col px-8 py-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="self-end w-10 h-10 rounded-md border border-emerald-green/30 flex items-center justify-center text-emerald-green hover:bg-emerald-green/10 transition-colors mb-8"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-display text-emerald-green mb-2">
                {couple.partnerOne} &amp; {couple.partnerTwo}
              </h2>
              
              {/* Top Hashtags */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-10 text-emerald-green/70 font-sans text-sm">
                <p>{couple.hashtag}</p>
                <p>#ThisIsForever</p>
                <p>#TheInseparable2</p>
              </div>

              <nav className="flex flex-col gap-7">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleLinkClick(link)}
                    className="text-left text-2xl font-display text-emerald-green hover:text-curry-gold transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto pt-16 flex flex-col items-center text-center">
                <img
                  src={rings}
                  alt="Interlocked wedding rings"
                  className="w-24 h-24 mb-4 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Bottom Hashtags */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-emerald-green/70 font-sans text-sm">
                  <p>{couple.hashtag}</p>
                  <p>#ThisIsForever</p>
                  <p>#TheInseparable2</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}