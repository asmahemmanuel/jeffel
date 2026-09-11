import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { contactImage } from '../data/content'

export default function ContactImage() {
  return (
    <section className="w-full overflow-hidden bg-off-white">
      {/* Pre-wedding Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden"
      >
        {contactImage.src ? (
          <img
            src={contactImage.src}
            alt={contactImage.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rosewood-pink via-curry-gold to-emerald-green flex items-center justify-center">
            <span className="text-white/70 font-sans text-xs tracking-widest uppercase">
              Pre-wedding photo
            </span>
          </div>
        )}
      </motion.div>

      {/* RSVP Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="bg-off-white py-12 px-6 text-center"
      >
        <h3 className="text-3xl font-display text-emerald-green mb-8">
          RSVP
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {/* Caleb Contact */}
          <div className="flex flex-col items-center">
            <span className="text-emerald-green/80 font-sans text-sm uppercase tracking-widest mb-3 font-bold">
              Caleb
            </span>
            <a 
              href="tel:0201515324" 
              className="flex items-center gap-2 bg-emerald-green hover:bg-emerald-green/90 text-off-white px-8 py-4 rounded-full font-sans font-bold shadow-xl transition-transform hover:scale-105 border border-emerald-green"
            >
              <Phone className="w-5 h-5 text-curry-gold" />
              020 151 5324
            </a>
          </div>

          {/* Sarah Contact */}
          <div className="flex flex-col items-center">
            <span className="text-emerald-green/80 font-sans text-sm uppercase tracking-widest mb-3 font-bold">
              Sarah
            </span>
            <a 
              href="tel:0536758977" 
              className="flex items-center gap-2 bg-emerald-green hover:bg-emerald-green/90 text-off-white px-8 py-4 rounded-full font-sans font-bold shadow-xl transition-transform hover:scale-105 border border-emerald-green"
            >
              <Phone className="w-5 h-5 text-curry-gold" />
              053 675 8977
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}