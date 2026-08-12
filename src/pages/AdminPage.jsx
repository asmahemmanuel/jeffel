import { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { doc, onSnapshot, setDoc, collection, query, orderBy, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Loader2, Users, HelpCircle, ArrowLeft, Lock, Unlock, Calendar, Trash2, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [voteCounts, setVoteCounts] = useState({ coming: 0, yetToDecide: 0 })
  const [photos, setPhotos] = useState([])
  
  // Admin Settings State
  const [uploadLocked, setUploadLocked] = useState(false)
  const [countdownDate, setCountdownDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Listen for real-time updates to the RSVP counts
    const rsvpDocRef = doc(db, 'rsvp', 'votes')
    const unsubscribeVotes = onSnapshot(rsvpDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setVoteCounts(docSnap.data())
      }
    }, (error) => console.error("Error fetching RSVP data: ", error))

    // 2. Listen for Admin Settings (Lock status and target date)
    const settingsRef = doc(db, 'rsvp', 'adminSettings')
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setUploadLocked(data.uploadLocked || false)
        if (data.countdownTarget) {
          setCountdownDate(data.countdownTarget)
        }
      }
    })

    // 3. Listen for Gallery Photos to allow deletion
    const galleryRef = collection(db, 'gallery')
    const galleryQuery = query(galleryRef, orderBy('createdAt', 'desc'))
    const unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPhotos(fetchedPhotos)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching gallery: ", error)
      setLoading(false)
    })

    return () => {
      unsubscribeVotes()
      unsubscribeSettings()
      unsubscribeGallery()
    }
  }, [])

  // Function to save lock status and countdown date
  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await setDoc(doc(db, 'rsvp', 'adminSettings'), {
        uploadLocked: uploadLocked,
        countdownTarget: countdownDate
      }, { merge: true })
      toast.success('Admin settings updated successfully!')
    } catch (error) {
      console.error("Error saving settings: ", error)
      toast.error('Failed to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  // Function to permanently delete a photo from Firestore & Storage
  const handleDeletePhoto = async (photoId, photoUrl) => {
    if (!window.confirm("Are you sure you want to permanently delete this photo?")) return
    
    try {
      // 1. Delete from Firebase Storage
      const photoRef = ref(storage, photoUrl)
      await deleteObject(photoRef)

      // 2. Delete from Firestore Database
      await deleteDoc(doc(db, 'gallery', photoId))
      
      toast.success('Photo deleted successfully!')
    } catch (error) {
      console.error("Error deleting photo: ", error)
      toast.error('Failed to delete photo.')
    }
  }

  return (
    <div className="min-h-screen bg-off-white py-20 px-6 sm:px-10 lg:px-20 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-10 flex justify-between items-center">
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
        <h1 className="text-4xl md:text-5xl text-emerald-green mb-4">Dashboard</h1>
        <div className="w-16 h-[2px] bg-curry-gold mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="w-10 h-10 text-curry-gold animate-spin mb-4" />
          <p className="text-olive-green font-sans tracking-wide">Loading Admin Data...</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-12">
          
          {/* =========================================
              RSVP TRACKER SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">RSVP Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Coming Card */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-emerald-green">
                <div className="w-14 h-14 rounded-full bg-emerald-green/10 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-emerald-green" />
                </div>
                <h3 className="text-xl text-emerald-green font-display mb-1">Coming</h3>
                <p className="text-5xl text-curry-gold font-display font-bold">
                  {voteCounts.coming || 0}
                </p>
              </div>

              {/* Yet to Decide Card */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-curry-gold">
                <div className="w-14 h-14 rounded-full bg-curry-gold/10 flex items-center justify-center mb-4">
                  <HelpCircle className="w-7 h-7 text-curry-gold" />
                </div>
                <h3 className="text-xl text-emerald-green font-display mb-1">Yet to Decide</h3>
                <p className="text-5xl text-curry-gold font-display font-bold">
                  {voteCounts.yetToDecide || 0}
                </p>
              </div>
            </div>
          </section>

          {/* =========================================
              SITE CONTROLS SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">Site Controls</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
                {/* Countdown Date Picker */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-sans font-semibold text-emerald-green flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-curry-gold" />
                    Target Date & Time
                  </label>
                  <input 
                    type="datetime-local" 
                    value={countdownDate}
                    onChange={(e) => setCountdownDate(e.target.value)}
                    className="border border-emerald-green/30 rounded-lg p-3 font-sans text-sm focus:outline-none focus:border-curry-gold focus:ring-1 focus:ring-curry-gold transition-colors"
                  />
                  <p className="text-[10px] text-emerald-green/60">This changes the countdown timer on the home page.</p>
                </div>

                {/* Upload Lock Toggle */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-sans font-semibold text-emerald-green flex items-center gap-2">
                    {uploadLocked ? <Lock className="w-4 h-4 text-rosewood-pink" /> : <Unlock className="w-4 h-4 text-emerald-green" />}
                    Photo Uploads
                  </label>
                  <button
                    onClick={() => setUploadLocked(!uploadLocked)}
                    className={`p-3 rounded-lg font-sans text-sm font-bold flex items-center justify-center gap-2 transition-colors ${uploadLocked ? 'bg-rosewood-pink/10 text-rosewood-pink border border-rosewood-pink/50' : 'bg-emerald-green/10 text-emerald-green border border-emerald-green/50'}`}
                  >
                    {uploadLocked ? 'Uploads are LOCKED (Click to Unlock)' : 'Uploads are UNLOCKED (Click to Lock)'}
                  </button>
                  <p className="text-[10px] text-emerald-green/60">Lock this to prevent visitors from uploading photos.</p>
                </div>
              </div>

              {/* Save Settings Button */}
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="mt-4 w-full md:w-auto self-end bg-emerald-green text-off-white px-8 py-3 rounded-lg font-sans text-sm font-bold tracking-wide hover:bg-emerald-green/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </section>

          {/* =========================================
              GALLERY MANAGEMENT SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">Manage Gallery</h2>
            {photos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-12 h-12 text-emerald-green/20 mb-3" />
                <p className="text-emerald-green/60 font-sans">No photos have been uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group bg-white p-2 rounded-xl shadow-sm border border-emerald-green/10">
                    <img 
                      src={photo.url} 
                      alt="Uploaded by guest" 
                      className="w-full h-32 md:h-40 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={() => handleDeletePhoto(photo.id, photo.url)}
                        className="bg-rosewood-pink text-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  )
}