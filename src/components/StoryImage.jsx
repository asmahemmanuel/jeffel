import { motion } from 'framer-motion'
import { storyImage } from '../data/content'

export default function StoryImage() {
  return (
    <section className="w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden"
      >
        {storyImage.src ? (
          <img
            src={storyImage.src}
            alt={storyImage.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-green via-olive-green to-curry-gold flex items-center justify-center">
            <span className="text-white/70 font-sans text-xs tracking-widest uppercase">
              Pre-wedding photo
            </span>
          </div>
        )}
      </motion.div>
    </section>
  )
}