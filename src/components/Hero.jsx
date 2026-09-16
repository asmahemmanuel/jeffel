import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { heroImages, couple } from '../data/content'

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-off-white" style={{ touchAction: 'pan-y' }}>
      <div 
        className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-black"
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={heroImages[index].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
            style={{ touchAction: 'pan-y' }}
          >
            {heroImages[index].src ? (
              <>
                {/* 1. Background: Lightly blurred to keep the image recognizable */}
                <img
                  src={heroImages[index].src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-60"
                  aria-hidden="true"
                />
                
                {/* 2. Foreground: full, uncropped portrait */}
                <img
                  src={heroImages[index].src}
                  alt={heroImages[index].label}
                  className="relative w-full h-full object-contain drop-shadow-2xl z-10"
                  loading="eager"
                  fetchpriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-green via-olive-green to-curry-gold flex items-center justify-center">
                <span className="text-off-white/70 font-sans text-xs tracking-widest uppercase">
                  {heroImages[index].label}
                </span>
              </div>
            )}
            
            {/* Subtle dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/20 z-20" />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 pointer-events-auto">
          {heroImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-curry-gold' : 'w-1.5 bg-off-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 text-center py-8 md:py-12 px-2 md:px-6 bg-off-white overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <p className="tracking-[0.3em] text-emerald-green text-[10px] md:text-sm font-sans mb-3 md:mb-4 uppercase">
          {couple.hashtag}
        </p>
        
        {/* 
          Updated Hero Name Header: 
          Uses a cascading series of vw units (viewport width) so it perfectly
          shrinks and grows dynamically on tablets, laptops, and wide monitors 
          without ever breaking to a new line or causing horizontal scroll.
        */}
        <h1 className="text-[5.5vw] sm:text-[4.5vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-display text-emerald-green mb-3 md:mb-4 whitespace-nowrap">
          {couple.partnerOne} <span className="text-curry-gold">&amp;</span> {couple.partnerTwo}
        </h1>
        
        <p className="text-sm md:text-lg text-olive-green/80 font-body italic">
          {couple.tagline}
        </p>
      </motion.div>
    </section>
  )
}