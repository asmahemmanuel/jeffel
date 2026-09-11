import { motion } from 'framer-motion'
import { contactImage } from '../data/content'

export default function ContactImage() {
  return (
    <section className="w-full overflow-hidden bg-off-white py-6 md:py-10">
      {/* Pre-wedding Image Section (Portrait) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-[85%] max-w-xs md:max-w-sm mx-auto aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl shadow-xl"
      >
        {contactImage.src ? (
          <img
            src={contactImage.src}
            alt={contactImage.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rosewood-pink via-curry-gold to-emerald-green flex items-center justify-center">
            <span className="text-white/70 font-sans text-xs tracking-widest uppercase">
              Pre-wedding photo
            </span>
          </div>
        )}
      </motion.div>
    </section>
  )
}