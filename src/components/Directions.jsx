import { motion } from 'framer-motion'
import { directions } from '../data/content'

export default function Directions() {
  return (
    <section id="directions" className="bg-off-white py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-12 px-6"
      >
        Directions
      </motion.h2>

      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {directions.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl text-curry-gold font-sans uppercase tracking-wide mb-1">
              {d.label}
            </h3>
            <p className="text-emerald-green/80 mb-4">{d.venue}</p>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-md">
              <iframe
                title={d.label}
                src={d.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}