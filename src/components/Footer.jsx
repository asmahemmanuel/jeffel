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
      className="bg-off-white py-16 px-2 md:px-6 text-center flex flex-col items-center overflow-hidden"
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
      
      {/* 
        Updated Name Header: 
        Uses 5vw on mobile to maximize size, clamps to text-2xl on larger screens, 
        and prevents breaking with whitespace-nowrap 
      */}
      <h3 className="text-[5vw] sm:text-xl md:text-2xl font-display text-emerald-green mb-1 whitespace-nowrap">
        {couple.partnerOne} &amp; {couple.partnerTwo}
      </h3>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2">
        <p className="text-curry-gold font-sans tracking-widest text-[10px] md:text-sm">
          #TheJeffELChapter
        </p>
        <p className="text-curry-gold font-sans tracking-widest text-[10px] md:text-sm">
          #ThisIsForever
        </p>
        <p className="text-curry-gold font-sans tracking-widest text-[10px] md:text-sm">
          #TheInseparable2
        </p>
      </div>

      <p className="text-emerald-green/60 font-sans text-xs md:text-sm mb-12 mt-2">
        October 31st 2026
      </p>

      <p className="text-emerald-green/40 font-sans text-[10px] md:text-xs tracking-wide">
        Powered by A.S Tech. World
      </p>
    </motion.footer>
  )
}