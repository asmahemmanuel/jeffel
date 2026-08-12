import { motion } from 'framer-motion'
import { colors } from '../data/content'

export default function OurColors() {
  return (
    <section id="colors" className="bg-off-white py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-12"
      >
        Our Colors
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-8 px-6">
        {colors.map((c, i) => (
          <motion.div
            key={c.hex}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className="w-20 h-20 rounded-full shadow-lg border-4 border-white"
              style={{ backgroundColor: c.hex }}
            />
            <p className="font-sans text-sm text-emerald-green">{c.name}</p>
            <p className="font-sans text-xs text-emerald-green/60">{c.hex}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}