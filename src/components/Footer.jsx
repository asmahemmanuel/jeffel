import { motion } from 'framer-motion'
import rings from '../assets/rings.webp'
import { couple } from '../data/content'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="bg-off-white py-16 px-6 text-center flex flex-col items-center"
    >
      <motion.img
        src={rings}
        alt="Interlocked wedding rings"
        initial={{ scale: 0.8, rotate: -10 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 object-contain"
        loading="lazy"
        decoding="async"
      />
      <h3 className="text-2xl text-emerald-green mb-1">
        {couple.partnerOne} &amp; {couple.partnerTwo}
      </h3>
      
      {/* Hashtags container grouped with flex and gap for clean wrapping */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2">
        {/* Removed 'uppercase' class to preserve precise casing */}
        <p className="text-curry-gold font-sans tracking-widest text-sm">
          #TheJeffELChapter
        </p>
        <p className="text-curry-gold font-sans tracking-widest text-sm">
          #ThisIsForever
        </p>
        <p className="text-curry-gold font-sans tracking-widest text-sm">
          #TheInseparable2
        </p>
      </div>

      <p className="text-emerald-green/60 font-sans text-sm mb-12">
        {couple.weddingDateLabel}
      </p>

      {/* Powered By Branding */}
      <p className="text-emerald-green/40 font-sans text-xs tracking-wide">
        Powered by A.S Tech. World
      </p>
    </motion.footer>
  )
}