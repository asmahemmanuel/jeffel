import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs, giftInfo } from '../data/content'

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-off-white py-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-lg text-emerald-green font-body">❓ {question}</span>
        <ChevronDown
          className={`w-5 h-5 text-curry-gold transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="mt-2 text-emerald-green/80 font-sans text-sm">{answer}</p>
      </motion.div>
    </div>
  )
}

export default function QandA() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="qanda" className="max-w-3xl mx-auto px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-4"
      >
        Q &amp; A
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center text-emerald-green/70 mb-10"
      >
        For all our friends and family who have lots of questions, please check out our
        questions and answers first!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {faqs.map((f, i) => (
          <FaqItem
            key={f.question}
            question={f.question}
            answer={f.answer}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mt-12 bg-off-white rounded-xl p-6"
      >
        <p className="text-emerald-green/90 mb-4">{giftInfo.note}</p>
        <div className="space-y-3 font-sans text-sm">
          {giftInfo.entries.map((e) => (
            <div key={e.number}>
              <p className="text-emerald-green font-medium">{e.number}</p>
              <p className="text-emerald-green/70">{e.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-rosewood-pink font-sans">
          Reference: <span className="font-semibold">{giftInfo.reference}</span>
        </p>
      </motion.div>
    </section>
  )
}