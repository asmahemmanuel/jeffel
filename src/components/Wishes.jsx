import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import toast from 'react-hot-toast'
import { Send, Loader2, Quote, Heart, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Wishes() {
  const [wishes, setWishes] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef(null)

  // Fetch wishes from Firebase in real-time
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setWishes(fetchedWishes)
    })
    return () => unsubscribe()
  }, [])

  // Dynamic Word-Count Based Slideshow Timer
  useEffect(() => {
    if (wishes.length <= 1) return

    const currentWish = wishes[currentSlide]
    const wordCount = currentWish?.message ? currentWish.message.split(/\s+/).length : 5

    // Base time 4s + extra time per word, capped between 5s and 12s
    const calculatedDelay = Math.min(Math.max(4000 + wordCount * 300, 5000), 12000)

    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % wishes.length)
    }, calculatedDelay)

    return () => clearTimeout(timerRef.current)
  }, [currentSlide, wishes])

  const handleNext = () => {
    if (wishes.length <= 1) return
    setCurrentSlide((prev) => (prev + 1) % wishes.length)
  }

  const handlePrev = () => {
    if (wishes.length <= 1) return
    setCurrentSlide((prev) => (prev - 1 + wishes.length) % wishes.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !message.trim()) {
      toast.error('Please enter your name and a wish.')
      return
    }

    setIsSubmitting(true)
    
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: serverTimestamp()
      })
      
      toast.success('Thank you for your warm wishes!')
      setName('')
      setMessage('')
      setCurrentSlide(0) // Instantly show their new wish
      
    } catch (error) {
      console.error("Error adding wish: ", error)
      toast.error('Failed to send wish. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="wishes" className="bg-white py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <Heart className="w-6 h-6 md:w-8 md:h-8 text-rosewood-pink mx-auto mb-3" fill="currentColor" />
          <h2 className="text-3xl md:text-5xl font-display text-emerald-green mb-3">
            Guestbook <span className="text-curry-gold">&</span> Wishes
          </h2>
          <p className="font-sans text-xs md:text-sm text-emerald-green/70 uppercase tracking-widest">
            Leave a little love for the couple
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* =======================
              LEFT: WISHES SLIDESHOW 
              ======================= */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[300px] md:h-[360px] w-full bg-off-white rounded-3xl p-8 md:p-12 shadow-2xl border border-curry-gold/20 flex flex-col items-center justify-center text-center overflow-hidden group"
          >
            <Quote className="w-12 h-12 md:w-16 md:h-16 text-curry-gold/20 absolute top-6 left-6" />
            
            {/* Navigation Arrows */}
            {wishes.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous wish"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-curry-gold/30 text-emerald-green flex items-center justify-center shadow-md hover:bg-curry-gold hover:text-white transition-colors z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next wish"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-curry-gold/30 text-emerald-green flex items-center justify-center shadow-md hover:bg-curry-gold hover:text-white transition-colors z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {wishes.length > 0 ? (
              <div className="w-full px-4 md:px-8 relative h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8"
                  >
                    <p className="text-emerald-green font-body text-base md:text-xl italic mb-6 line-clamp-5 leading-relaxed">
                      "{wishes[currentSlide]?.message}"
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-[1px] bg-curry-gold"></div>
                      <h4 className="text-curry-gold font-sans font-bold tracking-widest uppercase text-xs md:text-sm">
                        {wishes[currentSlide]?.name}
                      </h4>
                      <div className="w-8 h-[1px] bg-curry-gold"></div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-emerald-green/50 flex flex-col items-center">
                <p className="font-body text-lg md:text-xl italic">
                  Be the first to leave a wish for Jeffrey & Eliana!
                </p>
              </div>
            )}

            {/* Slideshow Dots */}
            {wishes.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {wishes.slice(0, 8).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide % 8 ? 'w-4 bg-curry-gold' : 'w-1.5 bg-emerald-green/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* =======================
              RIGHT: SUBMIT FORM 
              ======================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md mx-auto lg:max-w-full"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold uppercase tracking-widest text-emerald-green pl-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eliana"
                  className="w-full bg-off-white border border-emerald-green/20 rounded-xl px-4 py-3.5 font-sans text-sm text-emerald-green focus:outline-none focus:border-curry-gold focus:ring-1 focus:ring-curry-gold transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold uppercase tracking-widest text-emerald-green pl-1">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Congratulations..."
                  className="w-full bg-off-white border border-emerald-green/20 rounded-xl px-4 py-3.5 font-sans text-sm text-emerald-green focus:outline-none focus:border-curry-gold focus:ring-1 focus:ring-curry-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-emerald-green text-off-white py-4 rounded-xl font-sans text-sm font-bold tracking-wide uppercase hover:bg-emerald-green/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Love...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-curry-gold" />
                    Post your wish
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}