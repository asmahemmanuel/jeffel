import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Loader2,
  Camera,
  CalendarCheck,
  ArrowDown,
  Lock,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { couple } from '../data/content'
import { db, storage } from '../firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  onSnapshot,
  getDoc,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import imageCompression from 'browser-image-compression'
import fpPromise from '@fingerprintjs/fingerprintjs' // IMPORTANT: Run `npm install @fingerprintjs/fingerprintjs`

function getTimeLeft(target) {
  const diff = +new Date(target) - +new Date()

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  return {
    days: Math.floor(
      diff / (1000 * 60 * 60 * 24)
    ),
    hours: Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (diff / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (diff / 1000) % 60
    ),
  }
}

export default function Countdown() {
  const [targetDate, setTargetDate] = useState(couple.countdownTarget)
  const [timeLeft, setTimeLeft] = useState(
    getTimeLeft(couple.countdownTarget)
  )

  const [isUploading, setIsUploading] = useState(false)
  const [isUploadLocked, setIsUploadLocked] = useState(false)
  const [showRSVP, setShowRSVP] = useState(false)
  
  // Track if we are currently checking the database for the fingerprint
  const [isCheckingDevice, setIsCheckingDevice] = useState(true)

  const [currentVote, setCurrentVote] = useState(null)

  const voteWriteRef = useRef(Promise.resolve())
  const visitorIdRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  /* =========================================================
     GENERATE DEVICE FINGERPRINT & CHECK FIRESTORE
     ========================================================= */

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        // 1. Generate Hardware Fingerprint
        const fp = await fpPromise.load()
        const result = await fp.get()
        const deviceId = result.visitorId
        visitorIdRef.current = deviceId

        // 2. Check if this exact device already voted in Firestore
        const responseRef = doc(db, 'rsvp', 'responses', 'guests', deviceId)
        const docSnap = await getDoc(responseRef)

        if (docSnap.exists()) {
          // The device has already voted, lock them out immediately
          const data = docSnap.data()
          setCurrentVote(data.choice)
        } else {
          // Double check local storage just in case Firebase failed on previous visit
          const localVote = localStorage.getItem('rsvpVote')
          if (localVote) {
             setCurrentVote(localVote)
          }
        }
      } catch (error) {
        console.error("Error checking device fingerprint:", error)
      } finally {
        setIsCheckingDevice(false)
      }
    }

    initializeDevice()
  }, [])


  /* =========================================================
     ADMIN SETTINGS LISTENER
     ========================================================= */

  useEffect(() => {
    const settingsRef = doc(db, 'rsvp', 'adminSettings')
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        
        if (data.countdownTarget) {
          setTargetDate(data.countdownTarget)
        }
        
        if (typeof data.uploadLocked === 'boolean') {
          setIsUploadLocked(data.uploadLocked)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  /* =========================================================
     COUNTDOWN TIMER
     ========================================================= */

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  /* =========================================================
     PHOTO UPLOAD
     ========================================================= */

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of files) {
        const options = {
          maxSizeMB: 0.2, 
          maxWidthOrHeight: 1080,
          useWebWorker: true,
          initialQuality: 0.7,
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

      const successMessage = files.length === 1 ? 'Photo uploaded successfully' : 'Photos uploaded successfully'
      toast.success(successMessage)
      navigate('/gallery')
      
    } catch (error) {
      console.error('Error uploading photos:', error)
      toast.error('Failed to upload photos. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  /* =========================================================
     RSVP
     ========================================================= */

  const handleVote = (newChoice) => {
    if (currentVote === newChoice || !visitorIdRef.current) {
      return
    }

    const previousVote = currentVote

    setCurrentVote(newChoice)

    if (newChoice) {
      localStorage.setItem('rsvpVote', newChoice)
      setShowRSVP(false)
      toast.success('Attendance response recorded!', { duration: 1200 })
    } else {
      localStorage.removeItem('rsvpVote')
      toast.success('Response cleared!', { duration: 1200 })
    }

    voteWriteRef.current =
      voteWriteRef.current
        .catch(() => {})
        .then(async () => {
          try {
            const votesRef = doc(db, 'rsvp', 'votes')
            const responseRef = doc(db, 'rsvp', 'responses', 'guests', visitorIdRef.current)

            await runTransaction(db, async (transaction) => {
                const responseSnapshot = await transaction.get(responseRef)

                const firebasePreviousVote = responseSnapshot.exists()
                    ? responseSnapshot.data().choice || null
                    : null

                if (firebasePreviousVote === newChoice) {
                  return
                }

                const votesSnapshot = await transaction.get(votesRef)
                const votesData = votesSnapshot.exists() ? votesSnapshot.data() : {}

                let comingCount = Math.max(0, Number(votesData.coming || 0))
                let yetToDecideCount = Math.max(0, Number(votesData.yetToDecide || 0))

                if (firebasePreviousVote === 'coming') {
                  comingCount = Math.max(0, comingCount - 1)
                }

                if (firebasePreviousVote === 'yetToDecide') {
                  yetToDecideCount = Math.max(0, yetToDecideCount - 1)
                }

                if (newChoice === 'coming') {
                  comingCount += 1
                }

                if (newChoice === 'yetToDecide') {
                  yetToDecideCount += 1
                }

                transaction.set(
                  votesRef,
                  { coming: comingCount, yetToDecide: yetToDecideCount },
                  { merge: true }
                )

                if (newChoice) {
                  transaction.set(
                    responseRef,
                    { choice: newChoice, updatedAt: serverTimestamp() },
                    { merge: true }
                  )
                } else {
                  transaction.delete(responseRef)
                }
              }
            )

          } catch (error) {
            console.error('Error saving RSVP:', error)

            setCurrentVote(previousVote)

            if (previousVote) {
              localStorage.setItem('rsvpVote', previousVote)
            } else {
              localStorage.removeItem('rsvpVote')
            }

            toast.error('Could not save your response. Please try again.', { duration: 2500 })
          }
        })
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <section id="countdown" className="bg-white py-10 md:py-14 px-4 md:px-6 text-center overflow-visible">

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <Clock className="w-5 h-5 md:w-6 md:h-6 text-emerald-green mx-auto mb-2 md:mb-3" strokeWidth={1.5} />

      <h2 className="text-2xl md:text-4xl mb-2">
        <span className="font-display text-emerald-green">Start the </span>
        <span className="font-display text-curry-gold">countdown</span>
      </h2>

      <p className="font-sans text-sm md:text-base text-emerald-green/70 mb-6 md:mb-8">
        Time left to the wedding!
      </p>

      <div className="flex justify-center gap-2 md:gap-6 flex-wrap">
        {units.map((u) => (
          <div key={u.label} className="bg-off-white rounded-xl px-3 md:px-6 py-3 md:py-4 min-w-[65px] md:min-w-[80px] shadow-sm">
            <p className="text-2xl md:text-4xl font-display text-curry-gold">{u.value}</p>
            <p className="font-sans text-[9px] md:text-xs uppercase tracking-widest text-emerald-green/60 mt-1">{u.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 md:mt-14 flex flex-col items-center pb-8 md:pb-10 w-full max-w-full">

        {!currentVote && !isCheckingDevice && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4 flex flex-col items-center">
            <p className="text-emerald-green font-sans font-bold text-xs md:text-sm tracking-wider uppercase">
              PLEASE TAP ON CONFIRM ATTENDANCE RIGHT BELOW
            </p>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}>
              <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-curry-gold mt-1" />
            </motion.div>
          </motion.div>
        )}

        <div className="w-[280px] md:w-[480px] h-2 md:h-3 rounded-full bg-curry-gold shadow-[0_0_15px_rgba(201,148,0,0.5)] z-20"></div>

        <div className="flex justify-between w-[250px] md:w-[420px] -mt-0.5 md:-mt-1 z-10 relative">

          {/* UPLOAD PHOTOS */}
          <motion.div className="flex flex-col items-center origin-top" animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}>
            <div className="flex flex-col items-center justify-center">
              <div className="w-[2px] md:w-[3px] h-8 md:h-14 bg-curry-gold shadow-sm"></div>
              <ArrowDown className="w-4 h-4 md:w-6 md:h-6 text-curry-gold -mt-1 md:-mt-2 drop-shadow-md" />
            </div>

            <button onClick={handleUploadClick} disabled={isUploading || isUploadLocked} className="mt-1 md:mt-2 w-[115px] md:w-[200px] h-[64px] md:h-[72px] bg-off-white hover:bg-curry-gold hover:text-off-white transition-colors duration-300 text-emerald-green px-1.5 md:px-3 py-1 md:py-2 rounded-lg shadow-xl font-sans font-bold text-[8.5px] md:text-xs tracking-wide border-2 border-curry-gold flex flex-col items-center justify-center gap-0.5 md:gap-1 leading-tight disabled:opacity-70 disabled:cursor-not-allowed text-center">
              {isUploadLocked ? (
                <><Lock className="w-3 h-3 md:w-4 md:h-4 shrink-0" /><span>Upload photos of yourself with couple</span></>
              ) : isUploading ? (
                <><Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin shrink-0" /><span>UPLOADING...</span></>
              ) : (
                <><Camera className="w-3 h-3 md:w-4 md:h-4 shrink-0" /><span>Upload photos of yourself with the couple</span></>
              )}
            </button>
          </motion.div>

          {/* CONFIRM ATTENDANCE */}
          <motion.div className="flex flex-col items-center origin-top relative" animate={{ rotate: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}>
            <div className="flex flex-col items-center justify-center">
              <div className="w-[2px] md:w-[3px] h-12 md:h-20 bg-curry-gold shadow-sm"></div>
              <ArrowDown className="w-4 h-4 md:w-6 md:h-6 text-curry-gold -mt-1 md:-mt-2 drop-shadow-md" />
            </div>

            <div className="relative mt-1 md:mt-2">
              <button onClick={() => { if (!currentVote && !isCheckingDevice) setShowRSVP(!showRSVP) }} disabled={!!currentVote || isCheckingDevice} className={`w-[115px] md:w-[200px] h-[64px] md:h-[72px] transition-colors duration-300 px-2 py-1 md:py-1.5 rounded-lg shadow-xl font-sans font-bold text-[10px] md:text-base tracking-wide border-2 flex flex-col items-center justify-center text-center leading-tight ${currentVote || isCheckingDevice ? 'bg-emerald-green/60 border-emerald-green/60 text-off-white/80 cursor-not-allowed' : 'bg-emerald-green hover:bg-emerald-green/90 text-off-white border-emerald-green cursor-pointer'}`}>
                
                {isCheckingDevice ? (
                  <Loader2 className="w-4 h-4 animate-spin text-off-white mb-1" />
                ) : (
                  <CalendarCheck className={`w-3 h-3 md:w-5 md:h-5 shrink-0 mb-0.5 md:mb-1 ${currentVote ? 'text-curry-gold/60' : 'text-curry-gold'}`} />
                )}

                {isCheckingDevice ? (
                  <span>Checking...</span>
                ) : currentVote === 'coming' ? (
                  <><span className="block">Attendance</span><span className="block">Confirmed</span></>
                ) : currentVote === 'yetToDecide' ? (
                  <><span className="block">Response</span><span className="block">Recorded</span></>
                ) : (
                  <><span className="block">Confirm</span><span className="block">Attendance</span></>
                )}
              </button>

              <AnimatePresence>
                {showRSVP && !currentVote && !isCheckingDevice && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 5, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.1 }} className="absolute top-full left-1/2 -translate-x-1/2 w-[140px] md:w-full bg-off-white border-2 border-curry-gold/50 rounded-lg shadow-2xl p-2 md:p-3 flex flex-col gap-2 md:gap-3 z-50 mt-2">
                    <label className="flex items-center gap-2 text-emerald-green text-[9px] md:text-xs font-sans font-bold cursor-pointer p-1 rounded hover:bg-curry-gold/10 transition-colors">
                      <input type="radio" name="rsvp" checked={currentVote === 'coming'} onChange={() => handleVote('coming')} className="w-3 h-3 md:w-3.5 md:h-3.5 accent-curry-gold cursor-pointer" /> Coming
                    </label>
                    <label className="flex items-center gap-2 text-emerald-green text-[9px] md:text-xs font-sans font-bold cursor-pointer p-1 rounded hover:bg-curry-gold/10 transition-colors">
                      <input type="radio" name="rsvp" checked={currentVote === 'yetToDecide'} onChange={() => handleVote('yetToDecide')} className="w-3 h-3 md:w-3.5 md:h-3.5 accent-curry-gold cursor-pointer" /> Yet to decide
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-6 max-w-xl mx-auto bg-off-white border-2 border-curry-gold/50 rounded-2xl p-6 md:p-8 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-green" />
        <h3 className="text-xl md:text-2xl font-display text-emerald-green mb-2">Order of Service & Program Outline</h3>
        <p className="font-sans text-xs md:text-sm text-emerald-green/80 mb-6">Curious about how the big day will unfold? Explore our complete order of service, timeline, and assigned ministers.</p>
        <Link to="/program" className="inline-flex items-center justify-center bg-emerald-green hover:bg-emerald-green/90 text-off-white font-sans font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 border border-emerald-green">View Program Outline</Link>
      </motion.div>

    </section>
  )
}