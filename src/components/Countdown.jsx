import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Loader2, Camera, CalendarCheck, ArrowDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { couple } from '../data/content'
import { db, storage } from '../firebase'
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import imageCompression from 'browser-image-compression'

function getTimeLeft(target) {
  const diff = +new Date(target) - +new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(couple.countdownTarget))
  const [isUploading, setIsUploading] = useState(false)
  const [showRSVP, setShowRSVP] = useState(false)
  
  // Track the user's specific vote instead of just a true/false boolean
  const [currentVote, setCurrentVote] = useState(localStorage.getItem('rsvpVote') || null)
  
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Countdown Timer only (real-time listener removed from frontend)
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(couple.countdownTarget))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of files) {
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 1920, 
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)

        const fileRef = ref(storage, `gallery/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, compressedFile)
        const downloadURL = await getDownloadURL(fileRef)

        await addDoc(collection(db, 'gallery'), {
          url: downloadURL,
          createdAt: serverTimestamp(),
        })
      }
      
      const successMessage = files.length === 1 
        ? 'Photo uploaded successfully' 
        : 'Photos uploaded successfully'
      
      toast.success(successMessage)
      navigate('/gallery')
      
    } catch (error) {
      console.error('Error uploading photos:', error)
      toast.error('Failed to upload photos. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Smart RSVP Vote Handler (Allows changing/clearing votes safely)
  const handleVote = async (newChoice) => {
    if (currentVote === newChoice) return // Prevent spamming the same option

    try {
      const rsvpDocRef = doc(db, 'rsvp', 'votes')
      const updates = {}

      // If they selected a new choice, add 1 to it
      if (newChoice) {
        updates[newChoice] = increment(1)
      }
      
      // If they had a previous choice, subtract 1 from it to cancel it out
      if (currentVote) {
        updates[currentVote] = increment(-1)
      }

      await setDoc(rsvpDocRef, updates, { merge: true })

      if (newChoice) {
        localStorage.setItem('rsvpVote', newChoice)
        setCurrentVote(newChoice)
        toast.success("Attendance response recorded!")
        setTimeout(() => setShowRSVP(false), 1500)
      } else {
        // Clearing response
        localStorage.removeItem('rsvpVote')
        setCurrentVote(null)
        toast.success("Response cleared!")
      }
    } catch (error) {
      console.error("Error saving vote:", error)
      toast.error("Failed to update response.")
    }
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <section id="countdown" className="bg-white py-14 px-4 md:px-6 text-center overflow-visible">
      {/* Hidden File Input for Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <Clock className="w-6 h-6 text-emerald-green mx-auto mb-3" strokeWidth={1.5} />
      <h2 className="text-3xl md:text-4xl mb-2">
        <span className="font-display text-emerald-green">Start the </span>
        <span className="font-display text-curry-gold">countdown</span>
      </h2>
      <p className="font-sans text-emerald-green/70 mb-8">Time left to the wedding!</p>

      <div className="flex justify-center gap-3 md:gap-8 flex-wrap">
        {units.map((u) => (
          <div
            key={u.label}
            className="bg-off-white rounded-xl px-4 md:px-6 py-4 min-w-[70px] md:min-w-[80px] shadow-sm"
          >
            <p className="text-3xl md:text-4xl font-display text-curry-gold">{u.value}</p>
            <p className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-emerald-green/60 mt-1">
              {u.label}
            </p>
          </div>
        ))}
      </div>

      {/* --- DANGLING BAR AND BUTTONS --- */}
      <div className="mt-16 flex flex-col items-center pb-12 w-full max-w-full">
        
        {/* The Horizontal Bar */}
        <div className="w-[290px] md:w-[480px] h-2 md:h-3 rounded-full bg-curry-gold shadow-[0_0_15px_rgba(201,148,0,0.5)] z-20"></div>
        
        {/* Container for the two dangling strings */}
        <div className="flex justify-between w-[260px] md:w-[420px] -mt-0.5 md:-mt-1 z-10 relative">
          
          {/* Arrow 1: Upload */}
          <motion.div 
            className="flex flex-col items-center origin-top"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-[2px] md:w-[3px] h-10 md:h-14 bg-curry-gold shadow-sm"></div>
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-curry-gold -mt-1 md:-mt-2 drop-shadow-md" />
            </div>
            
            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="mt-1 md:mt-2 w-[125px] md:w-[200px] h-[68px] md:h-[72px] bg-off-white hover:bg-curry-gold hover:text-off-white transition-colors duration-300 text-emerald-green px-1.5 md:px-3 py-2 rounded-lg shadow-xl font-sans font-bold text-[9px] md:text-xs tracking-wide border-2 border-curry-gold flex flex-col items-center justify-center gap-1 leading-tight disabled:opacity-70 disabled:cursor-not-allowed text-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>UPLOADING...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span>Upload photos of yourself & the couple</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Arrow 2: Confirm Attendance */}
          <motion.div 
            className="flex flex-col items-center origin-top relative"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-[2px] md:w-[3px] h-14 md:h-20 bg-curry-gold shadow-sm"></div>
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-curry-gold -mt-1 md:-mt-2 drop-shadow-md" />
            </div>

            <div className="relative mt-1 md:mt-2">
              <button 
                onClick={() => setShowRSVP(!showRSVP)}
                className="w-[125px] md:w-[200px] h-[68px] md:h-[72px] bg-emerald-green hover:bg-emerald-green/90 transition-colors duration-300 text-off-white px-2 py-2 rounded-lg shadow-xl font-sans font-bold text-[10px] md:text-sm tracking-wide border-2 border-emerald-green flex flex-col items-center justify-center gap-1 text-center"
              >
                <CalendarCheck className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-curry-gold" />
                <span>Confirm Attendance</span>
              </button>

              <AnimatePresence>
                {showRSVP && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[150px] md:w-full bg-off-white border-2 border-curry-gold/50 rounded-lg shadow-2xl p-2.5 md:p-3 flex flex-col gap-2.5 md:gap-3 z-50 mt-2"
                  >
                    <label className="flex items-center gap-2 text-emerald-green text-[10px] md:text-xs font-sans font-bold cursor-pointer p-1 rounded hover:bg-curry-gold/10 transition-colors">
                      <input 
                        type="radio" 
                        name="rsvp" 
                        checked={currentVote === 'coming'}
                        onChange={() => handleVote('coming')}
                        className="w-3.5 h-3.5 accent-curry-gold cursor-pointer"
                      />
                      Coming
                    </label>
                    
                    <label className="flex items-center gap-2 text-emerald-green text-[10px] md:text-xs font-sans font-bold cursor-pointer p-1 rounded hover:bg-curry-gold/10 transition-colors">
                      <input 
                        type="radio" 
                        name="rsvp" 
                        checked={currentVote === 'yetToDecide'}
                        onChange={() => handleVote('yetToDecide')}
                        className="w-3.5 h-3.5 accent-curry-gold cursor-pointer"
                      />
                      Yet to decide
                    </label>

                    {/* Clear Response Button */}
                    {currentVote && (
                      <button 
                        onClick={() => handleVote(null)}
                        className="mt-1 text-[9px] md:text-[11px] text-rosewood-pink font-sans font-semibold hover:underline text-left px-1"
                      >
                        Clear my response
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}