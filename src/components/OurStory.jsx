import { motion } from 'framer-motion'
import { ourStory } from '../data/content'

export default function OurStory() {
  return (
    <motion.section 
      id="story" 
      className="max-w-3xl mx-auto px-6 py-10 md:py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-6 md:mb-8"
      >
        Our Story
      </motion.h2>

      <div className="space-y-4 md:space-y-6">
        {ourStory.paragraphs.map((p, i) => (
          <motion.p 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
            className="text-base md:text-lg leading-relaxed text-emerald-green/90"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center text-curry-gold font-sans tracking-widest text-xs md:text-sm mt-8"
      >
        {ourStory.closingTag.replace(/THEJEFFELCHAPTER/g, 'TheJeffELChapter')}
      </motion.p>
    </motion.section>
  )
}