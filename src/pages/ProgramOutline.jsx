import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, CheckCircle2, User, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

export default function ProgramOutline() {
  const [orderOfService, setOrderOfService] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const programRef = doc(db, 'program', 'outline')
    const unsubscribe = onSnapshot(programRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().items) {
        setOrderOfService(docSnap.data().items)
      } else {
        setOrderOfService([])
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching program outline: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-green font-sans font-bold text-xs md:text-sm mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 text-curry-gold" />
          Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <h1 className="text-2xl md:text-4xl font-display text-emerald-green mb-2">
            White Wedding <span className="text-curry-gold">Order of Service</span>
          </h1>
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-emerald-green/70">
            #TheJeffELChapter • Program Outline
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="w-8 h-8 text-curry-gold animate-spin mb-3" />
            <p className="text-emerald-green/70 font-sans text-xs">Loading program outline...</p>
          </div>
        ) : orderOfService.length === 0 ? (
          <div className="bg-white border-2 border-curry-gold/40 rounded-xl p-8 shadow-xl text-center">
            <p className="text-emerald-green/70 font-sans text-sm">
              The program outline is currently being updated by the admin. Please check back soon!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-curry-gold/40 rounded-xl p-4 md:p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-emerald-green" />

            <div className="space-y-3.5 md:space-y-4 divide-y divide-off-white">
              {orderOfService.map((service, index) => (
                <div
                  key={service.id || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between pt-3.5 first:pt-0 gap-2"
                >
                  <div className="flex items-start sm:items-center gap-2.5 md:gap-3 pr-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-curry-gold shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <span className="font-sans font-semibold text-xs md:text-sm text-emerald-green block">
                        {service.item}
                      </span>
                      {service.assignee && (
                        <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-curry-gold font-sans font-medium mt-0.5">
                          <User className="w-3 h-3" />
                          {service.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-green/70 font-sans text-[11px] md:text-xs shrink-0 bg-off-white px-2.5 py-1 rounded-full border border-curry-gold/20 self-start sm:self-center">
                    <Clock className="w-3 h-3 text-curry-gold" />
                    <span>{service.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}