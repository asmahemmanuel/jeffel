import { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { doc, onSnapshot, setDoc, collection, query, orderBy, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Loader2, Users, HelpCircle, ArrowLeft, Lock, Unlock, Calendar, Trash2, Image as ImageIcon, Plus, Edit2, Save, X, MessageSquareHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const defaultOrderOfService = [
  { id: '1', item: 'Opening Prayer & Praise and Worship', time: '11:00 AM', assignee: '' },
  { id: '2', item: 'Processional (Entrance of Groom & Bride)', time: '11:15 AM', assignee: '' },
  { id: '3', item: 'Welcome & Introduction of Officiating Ministers', time: '11:30 AM', assignee: '' },
  { id: '4', item: 'Congregational Hymn', time: '11:45 AM', assignee: '' },
  { id: '5', item: 'Declaration of Intent & Exchange of Vows', time: '12:00 PM', assignee: '' },
  { id: '6', item: 'Blessing and Exchange of Rings', time: '12:15 PM', assignee: '' },
  { id: '7', item: 'Signing of the Marriage Certificate', time: '12:30 PM', assignee: '' },
  { id: '8', item: 'Pronouncement & First Kiss', time: '12:45 PM', assignee: '' },
  { id: '9', item: 'Exhortation / Wedding Sermon', time: '1:00 PM', assignee: '' },
  { id: '10', item: 'Offertory & Special Ministration', time: '1:20 PM', assignee: '' },
  { id: '11', item: 'Vote of Thanks & Acknowledgments', time: '1:40 PM', assignee: '' },
  { id: '12', item: 'Closing Prayer & Benediction', time: '1:50 PM', assignee: '' },
  { id: '13', item: 'Recessional March', time: '2:00 PM', assignee: '' }
]

export default function AdminPage() {
  const [voteCounts, setVoteCounts] = useState({ coming: 0, yetToDecide: 0 })
  const [photos, setPhotos] = useState([])
  const [programItems, setProgramItems] = useState([])
  const [wishes, setWishes] = useState([])
  
  // New Program Item Form State
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemTime, setNewItemTime] = useState('')
  const [newItemAssignee, setNewItemAssignee] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editAssignee, setEditAssignee] = useState('')

  // Admin Settings State
  const [uploadLocked, setUploadLocked] = useState(false)
  const [countdownDate, setCountdownDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingProgram, setIsSavingProgram] = useState(false)
  
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

    // 3. Listen for Program Outline items
    const programRef = doc(db, 'program', 'outline')
    const unsubscribeProgram = onSnapshot(programRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().items) {
        setProgramItems(docSnap.data().items)
      } else {
        setProgramItems(defaultOrderOfService)
      }
    })

    // 4. Listen for Gallery Photos to allow deletion
    const galleryRef = collection(db, 'gallery')
    const galleryQuery = query(galleryRef, orderBy('createdAt', 'desc'))
    const unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPhotos(fetchedPhotos)
    }, (error) => {
      console.error("Error fetching gallery: ", error)
    })

    // 5. Listen for Guestbook Wishes to allow deletion
    const wishesRef = collection(db, 'wishes')
    const wishesQuery = query(wishesRef, orderBy('createdAt', 'desc'))
    const unsubscribeWishes = onSnapshot(wishesQuery, (snapshot) => {
      const fetchedWishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setWishes(fetchedWishes)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching wishes: ", error)
      setLoading(false)
    })

    return () => {
      unsubscribeVotes()
      unsubscribeSettings()
      unsubscribeProgram()
      unsubscribeGallery()
      unsubscribeWishes()
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

  // Save Program Outline to Firestore
  const saveProgramToFirestore = async (updatedItems) => {
    setIsSavingProgram(true)
    try {
      await setDoc(doc(db, 'program', 'outline'), { items: updatedItems })
      toast.success('Program outline updated!')
    } catch (error) {
      console.error("Error saving program: ", error)
      toast.error('Failed to update program outline.')
    } finally {
      setIsSavingProgram(false)
    }
  }

  // Add new program item
  const handleAddProgramItem = (e) => {
    e.preventDefault()
    if (!newItemTitle.trim() || !newItemTime.trim()) {
      toast.error('Please enter both title and time.')
      return
    }

    const newItem = {
      id: Date.now().toString(),
      item: newItemTitle.trim(),
      time: newItemTime.trim(),
      assignee: newItemAssignee.trim()
    }

    const updated = [...programItems, newItem]
    saveProgramToFirestore(updated)
    setNewItemTitle('')
    setNewItemTime('')
    setNewItemAssignee('')
  }

  // Delete program item
  const handleDeleteProgramItem = (id) => {
    const updated = programItems.filter(p => p.id !== id)
    saveProgramToFirestore(updated)
  }

  // Start editing program item
  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditTitle(item.item)
    setEditTime(item.time)
    setEditAssignee(item.assignee || '')
  }

  // Save edited program item
  const handleSaveEdit = (id) => {
    const updated = programItems.map(p => {
      if (p.id === id) {
        return { ...p, item: editTitle, time: editTime, assignee: editAssignee }
      }
      return p
    })
    saveProgramToFirestore(updated)
    setEditingId(null)
  }

  // Function to permanently delete a photo from Firestore & Storage
  const handleDeletePhoto = async (photoId, photoUrl) => {
    if (!window.confirm("Are you sure you want to permanently delete this photo?")) return
    
    try {
      const photoRef = ref(storage, photoUrl)
      await deleteObject(photoRef)
      await deleteDoc(doc(db, 'gallery', photoId))
      toast.success('Photo deleted successfully!')
    } catch (error) {
      console.error("Error deleting photo: ", error)
      toast.error('Failed to delete photo.')
    }
  }

  // Function to delete a guestbook wish
  const handleDeleteWish = async (wishId) => {
    if (!window.confirm("Are you sure you want to delete this wish?")) return

    try {
      await deleteDoc(doc(db, 'wishes', wishId))
      toast.success('Wish deleted successfully!')
    } catch (error) {
      console.error("Error deleting wish: ", error)
      toast.error('Failed to delete wish.')
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
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border-t-4 border-emerald-green">
                <div className="w-14 h-14 rounded-full bg-emerald-green/10 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-emerald-green" />
                </div>
                <h3 className="text-xl text-emerald-green font-display mb-1">Coming</h3>
                <p className="text-5xl text-curry-gold font-display font-bold">
                  {voteCounts.coming || 0}
                </p>
              </div>

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
              PROGRAM OUTLINE MANAGER SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">Manage Program Outline</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-6">
              
              <form onSubmit={handleAddProgramItem} className="bg-off-white p-4 rounded-xl border border-curry-gold/30 flex flex-col md:flex-row gap-3 items-center">
                <input 
                  type="text"
                  placeholder="Service Item (e.g. Opening Prayer)"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="flex-1 w-full border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                />
                <input 
                  type="text"
                  placeholder="Time (e.g. 11:00 AM)"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  className="w-full md:w-32 border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                />
                <input 
                  type="text"
                  placeholder="Assignee (e.g. Rev. John)"
                  value={newItemAssignee}
                  onChange={(e) => setNewItemAssignee(e.target.value)}
                  className="w-full md:w-44 border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                />
                <button
                  type="submit"
                  disabled={isSavingProgram}
                  className="w-full md:w-auto bg-emerald-green text-off-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-green/90 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </form>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {programItems.map((p) => (
                  <div key={p.id || p.item} className="p-3.5 bg-off-white/60 border border-emerald-green/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {editingId === p.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                        />
                        <input 
                          type="text"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full sm:w-28 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                        />
                        <input 
                          type="text"
                          value={editAssignee}
                          onChange={(e) => setEditAssignee(e.target.value)}
                          placeholder="Assignee"
                          className="w-full sm:w-36 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-2">
                        <span className="font-sans font-semibold text-xs md:text-sm text-emerald-green">{p.item}</span>
                        <div className="flex items-center gap-2">
                          {p.assignee && (
                            <span className="bg-curry-gold/10 text-curry-gold border border-curry-gold/30 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                              👤 {p.assignee}
                            </span>
                          )}
                          <span className="bg-emerald-green/10 text-emerald-green text-[11px] px-2.5 py-0.5 rounded-full font-sans font-bold">
                            {p.time}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {editingId === p.id ? (
                        <>
                          <button 
                            onClick={() => handleSaveEdit(p.id)}
                            className="bg-emerald-green text-white p-1.5 rounded hover:bg-emerald-green/90"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white p-1.5 rounded hover:bg-gray-500"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleStartEdit(p)}
                            className="text-emerald-green hover:text-curry-gold p-1.5 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProgramItem(p.id)}
                            className="text-rosewood-pink hover:text-rosewood-pink/80 p-1.5 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* =========================================
              MANAGE GUESTBOOK WISHES SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">Manage Guestbook Wishes</h2>
            {wishes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                <MessageSquareHeart className="w-12 h-12 text-emerald-green/20 mb-3" />
                <p className="text-emerald-green/60 font-sans">No wishes have been left yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-4 max-h-[450px] overflow-y-auto">
                {wishes.map((wish) => (
                  <div key={wish.id} className="p-4 bg-off-white/60 border border-emerald-green/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-curry-gold font-sans font-bold text-xs uppercase tracking-wider mb-1">
                        {wish.name}
                      </h4>
                      <p className="text-emerald-green/90 font-body italic text-sm md:text-base">
                        "{wish.message}"
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteWish(wish.id)}
                      className="self-end sm:self-center bg-rosewood-pink/10 text-rosewood-pink hover:bg-rosewood-pink hover:text-white p-2.5 rounded-xl transition-colors shrink-0"
                      title="Delete Wish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================================
              SITE CONTROLS SECTION
              ========================================= */}
          <section>
            <h2 className="text-2xl font-display text-emerald-green mb-6 border-b border-emerald-green/20 pb-2">Site Controls</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
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
                      decoding="async"
                    />
                    
                    <div className="absolute top-3 right-3 md:inset-0 md:bg-black/60 md:rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center md:justify-center md:backdrop-blur-sm z-10">
                      <button 
                        onClick={() => handleDeletePhoto(photo.id, photo.url)}
                        className="bg-rosewood-pink text-white p-2 md:p-3 rounded-full hover:scale-110 transition-transform shadow-md md:shadow-xl"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
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