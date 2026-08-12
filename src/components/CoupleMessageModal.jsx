import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart } from 'lucide-react'
import { coupleMessage } from '../data/content'

export default function CoupleMessageModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:backdrop-blur-sm px-6"
          style={{ pointerEvents: open ? 'auto' : 'none' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-off-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-curry-gold/30"
          >
            <button
              onClick={handleClose}
              aria-label="Close message"
              className="absolute top-4 right-4 text-emerald-green/60 hover:text-emerald-green transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <Heart className="w-8 h-8 text-rosewood-pink mx-auto mb-4" fill="currentColor" />

            <h3 className="text-2xl text-emerald-green mb-4">{coupleMessage.title}</h3>
            <p className="text-olive-green/90 leading-relaxed mb-5 font-body text-lg">
              {coupleMessage.body}
            </p>
            <p className="text-curry-gold font-sans text-sm tracking-wide italic">
              {coupleMessage.signature}
            </p>

            <button
              onClick={handleClose}
              className="mt-6 px-6 py-3 bg-emerald-green text-white rounded-full font-sans text-sm tracking-wide hover:bg-emerald-green/90 transition-colors shadow-md"
            >
              Continue to the site
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}