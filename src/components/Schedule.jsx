import { motion } from 'framer-motion'
import { schedule } from '../data/content'

export default function Schedule() {
  return (
    <section id="schedule" className="max-w-3xl mx-auto px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl text-center text-emerald-green mb-12"
      >
        Schedule
      </motion.h2>

      <div className="space-y-10">
        {schedule.map((event, i) => (
          <motion.div
            key={event.id}
            id={event.id}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-l-4 border-emerald-green pl-6"
          >
            <p className="uppercase tracking-widest text-xs font-sans text-rosewood-pink mb-1">
              {event.date}
            </p>
            <h3 className="text-2xl text-emerald-green mb-1">{event.title}</h3>
            <p className="font-sans text-sm text-emerald-green/70 mb-1">{event.time}</p>
            {event.link ? (
              <a href={event.link} className="font-sans text-sm text-curry-gold underline underline-offset-2">
                {event.location}
              </a>
            ) : (
              <p className="font-sans text-sm text-emerald-green/70">{event.location}</p>
            )}
            {i < schedule.length - 1 && <hr className="mt-8 border-off-white" />}
          </motion.div>
        ))}
      </div>
    </section>
  )
}