import { motion } from 'framer-motion'
import { ourStory } from '../data/content'

export default function OurStory() {
  return (
    <section id="story" className="max-w-3xl mx-auto px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-10"
      >
        Our Story
      </motion.h2>

      <div className="space-y-6">
        {ourStory.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-lg leading-relaxed text-emerald-green/90"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="text-center text-curry-gold font-sans tracking-widest uppercase text-sm mt-10"
      >
        {ourStory.closingTag}
      </motion.p>
    </section>
  )
}