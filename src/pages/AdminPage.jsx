import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { Loader2, Users, HelpCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminPage() {
  const [voteCounts, setVoteCounts] = useState({ coming: 0, yetToDecide: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for real-time updates to the RSVP document
    const rsvpDocRef = doc(db, 'rsvp', 'votes')
    
    const unsubscribe = onSnapshot(rsvpDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setVoteCounts(docSnap.data())
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching RSVP data: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-off-white py-20 px-6 sm:px-10 lg:px-20 flex flex-col items-center">
      
      <div className="w-full max-w-3xl mb-10 flex justify-between items-center">
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide border-2 border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-off-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          HOME
        </Link>
        <p className="text-emerald-green/70 font-sans text-xs uppercase tracking-widest font-bold">
          Admin Dashboard
        </p>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl text-emerald-green mb-4">RSVP Tracker</h1>
        <div className="w-16 h-[2px] bg-curry-gold mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="w-10 h-10 text-curry-gold animate-spin mb-4" />
          <p className="text-olive-green font-sans tracking-wide">Loading RSVP data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          
          {/* Coming Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-emerald-green">
            <div className="w-14 h-14 rounded-full bg-emerald-green/10 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-emerald-green" />
            </div>
            <h2 className="text-2xl text-emerald-green font-display mb-2">Coming</h2>
            <p className="text-6xl text-curry-gold font-display font-bold">
              {voteCounts.coming || 0}
            </p>
            <p className="text-emerald-green/60 font-sans text-sm mt-3 uppercase tracking-wider">
              Confirmed Guests
            </p>
          </div>

          {/* Yet to Decide Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-curry-gold">
            <div className="w-14 h-14 rounded-full bg-curry-gold/10 flex items-center justify-center mb-4">
              <HelpCircle className="w-7 h-7 text-curry-gold" />
            </div>
            <h2 className="text-2xl text-emerald-green font-display mb-2">Yet to Decide</h2>
            <p className="text-6xl text-curry-gold font-display font-bold">
              {voteCounts.yetToDecide || 0}
            </p>
            <p className="text-emerald-green/60 font-sans text-sm mt-3 uppercase tracking-wider">
              Pending Guests
            </p>
          </div>

        </div>
      )}
    </div>
  )
}