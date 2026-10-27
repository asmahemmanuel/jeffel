import { useState, useEffect, useRef } from 'react'
import { db, storage } from '../firebase'
import { doc, onSnapshot, setDoc, collection, query, orderBy, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Loader2, Users, HelpCircle, ArrowLeft, Lock, Unlock, Calendar, Trash2, Image as ImageIcon, Plus, Edit2, Save, X, MessageSquareHeart, ChevronUp, ChevronDown, Eye, EyeOff, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const defaultProgram = {
  showFullProgram: false,
  details: {
    thankYou: 'Thank you',
    thankYouSub: 'FOR BEING A PART OF OUR SPECIAL DAY',
    quote: '"And now these three remain: faith, hope and love. But the greatest of these is love."',
    quoteRef: '1 CORINTHIANS 13:13'
  },
  officiating: [
    'Rev Dr. Robert Ampiah Kwofi',
    'Rev. Mrs Abrefi Ampiah Kwofi',
    'Rev. William Orhin',
    'Rev Edem Emil Dusu',
    'Rev Rexford Lamptey'
  ],
  supporting: [
    'Prophet Daniel Agu',
    'Rev. Dr. P D Quartey',
    'Rev. Andy Denteh',
    'Ps. Stanley Asante Mireku',
    'Rev. William Amoafo',
    'Ps. John Bosco Brempong',
    'Ps. Grace Bentil'
  ],
  items: [
    { id: '1', item: 'Musical Prelude/Arrival of Guests/Groom', assignee: 'Song Ministration: Levite Shebach', time: '' },
    { id: '2', item: 'Opening Prayer', assignee: '', time: '' },
    { id: '3', item: 'Bridal March', assignee: '', time: '' },
    { id: '4', item: 'Praise and Worship', assignee: 'Min Steve Bright Makafui.', time: '' },
    { id: '5', item: 'Declaration of purpose', assignee: '', time: '' },
    { id: '6', item: 'Special Song Ministration by Min. Sitso', assignee: '', time: '' },
    { id: '7', item: 'Solemnization of Matrimony', assignee: '', time: '' },
    { id: '8', item: '1st Offertory', assignee: 'Min. Samuel Anie - Amoah', time: '' },
    { id: '9', item: '1st Scripture Reading – 1 Corinthian 13:1-13', assignee: '', time: '' },
    { id: '10', item: '2nd Scripture Reading – 1 John 4:7-21', assignee: '', time: '' },
    { id: '11', item: 'Sermon', assignee: 'Rev. Robert Ampiah Kwofi', time: '' },
    { id: '12', item: 'Signing of Registrar', assignee: '', time: '' },
    { id: '13', item: '2nd Offertory', assignee: 'Songs by Global Harmonic Clarions', time: '' },
    { id: '14', item: 'Welcoming of couple', assignee: 'Min. Asmah / Min. Richie', time: '' },
    { id: '15', item: 'Presentation of Certificate & Offertory', assignee: '', time: '' },
    { id: '16', item: 'Announcement', assignee: '', time: '' },
    { id: '17', item: 'Closing Hymn', assignee: 'The Lord Bless you and Keep You – Min. Mary-Ann', time: '' },
    { id: '18', item: 'Closing prayer', assignee: '', time: '' },
    { id: '19', item: 'Exit march', assignee: '', time: '' }
  ],
  photoItems: []
}

const detailFields = [
  { key: 'thankYou', label: 'Thank You Heading' },
  { key: 'thankYouSub', label: 'Thank You Subtext' },
  { key: 'quote', label: 'Scripture Quote' },
  { key: 'quoteRef', label: 'Scripture Reference' }
]

// Reusable manager for a numbered list (Order of Service / Order of Photography)
// When `simple` is true, only the item title is used (no time, no assignee)
function ItemListManager({ title, items, onSave, saving, itemPlaceholder, simple = false }) {
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editAssignee, setEditAssignee] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      toast.error('Please enter the item title.')
      return
    }
    const newItem = {
      id: Date.now().toString(),
      item: newTitle.trim(),
      time: simple ? '' : newTime.trim(),
      assignee: simple ? '' : newAssignee.trim()
    }
    onSave([...items, newItem])
    setNewTitle('')
    setNewTime('')
    setNewAssignee('')
  }

  const handleDelete = (id) => {
    onSave(items.filter(p => p.id !== id))
  }

  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditTitle(item.item)
    setEditTime(item.time || '')
    setEditAssignee(item.assignee || '')
  }

  const handleSaveEdit = (id) => {
    const updated = items.map(p => {
      if (p.id !== id) return p
      if (simple) return { ...p, item: editTitle, time: '', assignee: '' }
      return { ...p, item: editTitle, time: editTime, assignee: editAssignee }
    })
    onSave(updated)
    setEditingId(null)
  }

  const handleMove = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onSave(updated)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-6">
      <h3 className="text-lg font-display text-emerald-green">{title}</h3>

      <form onSubmit={handleAdd} className="bg-off-white p-4 rounded-xl border border-curry-gold/30 flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder={itemPlaceholder}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 w-full border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
        />
        {!simple && (
          <>
            <input
              type="text"
              placeholder="Time (optional)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full md:w-32 border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
            />
            <input
              type="text"
              placeholder="Assignee (e.g. Rev. John)"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="w-full md:w-44 border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
            />
          </>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto bg-emerald-green text-off-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-green/90 transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-emerald-green/60 font-sans text-sm text-center py-4">No items yet.</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {items.map((p, index) => (
            <div key={p.id || p.item} className="p-3.5 bg-off-white/60 border border-emerald-green/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {editingId === p.id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                  />
                  {!simple && (
                    <>
                      <input
                        type="text"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="Time (optional)"
                        className="w-full sm:w-28 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                      />
                      <input
                        type="text"
                        value={editAssignee}
                        onChange={(e) => setEditAssignee(e.target.value)}
                        placeholder="Assignee"
                        className="w-full sm:w-36 border border-emerald-green/30 rounded p-1.5 text-xs font-sans"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-2">
                  <span className="font-sans font-semibold text-xs md:text-sm text-emerald-green">
                    <span className="text-curry-gold mr-2">{index + 1}.</span>
                    {p.item}
                  </span>
                  {!simple && (
                    <div className="flex items-center gap-2">
                      {p.assignee && (
                        <span className="bg-curry-gold/10 text-curry-gold border border-curry-gold/30 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                          👤 {p.assignee}
                        </span>
                      )}
                      {p.time && (
                        <span className="bg-emerald-green/10 text-emerald-green text-[11px] px-2.5 py-0.5 rounded-full font-sans font-bold">
                          {p.time}
                        </span>
                      )}
                    </div>
                  )}
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
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="text-emerald-green hover:text-curry-gold p-1.5 rounded disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === items.length - 1}
                      className="text-emerald-green hover:text-curry-gold p-1.5 rounded disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="text-emerald-green hover:text-curry-gold p-1.5 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
      )}
    </div>
  )
}

export default function AdminPage() {
  const [voteCounts, setVoteCounts] = useState({ coming: 0, yetToDecide: 0 })
  const [photos, setPhotos] = useState([])
  const [program, setProgram] = useState(defaultProgram)
  const [wishes, setWishes] = useState([])

  // Draft state for program details & ministers (edited then saved with a button)
  const [detailsDraft, setDetailsDraft] = useState(defaultProgram.details)
  const [officiatingDraft, setOfficiatingDraft] = useState(defaultProgram.officiating.join('\n'))
  const [supportingDraft, setSupportingDraft] = useState(defaultProgram.supporting.join('\n'))
  const draftsInitialized = useRef(false)

  // Admin Settings State
  const [uploadLocked, setUploadLocked] = useState(false)
  const [thankYouMode, setThankYouMode] = useState(false)
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

    // 2. Listen for Admin Settings (Lock status, thank you mode and target date)
    const settingsRef = doc(db, 'rsvp', 'adminSettings')
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setUploadLocked(data.uploadLocked || false)
        setThankYouMode(data.thankYouMode || false)
        if (data.countdownTarget) {
          setCountdownDate(data.countdownTarget)
        }
      }
    })

    // 3. Listen for Program Outline data
    const programRef = doc(db, 'program', 'outline')
    const unsubscribeProgram = onSnapshot(programRef, (docSnap) => {
      let loaded = defaultProgram
      if (docSnap.exists()) {
        const data = docSnap.data()
        loaded = {
          showFullProgram: data.showFullProgram === true,
          details: { ...defaultProgram.details, ...(data.details || {}) },
          officiating: data.officiating || defaultProgram.officiating,
          supporting: data.supporting || defaultProgram.supporting,
          items: data.items || defaultProgram.items,
          photoItems: data.photoItems || []
        }
      }
      setProgram(loaded)

      // Only fill the editable drafts the first time so we don't overwrite what the admin is typing
      if (!draftsInitialized.current) {
        setDetailsDraft(loaded.details)
        setOfficiatingDraft(loaded.officiating.join('\n'))
        setSupportingDraft(loaded.supporting.join('\n'))
        draftsInitialized.current = true
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

  // Function to save lock status, thank you mode and countdown date
  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await setDoc(doc(db, 'rsvp', 'adminSettings'), {
        uploadLocked: uploadLocked,
        thankYouMode: thankYouMode,
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

  // Save Program Outline (any part of it) to Firestore
  const saveProgramToFirestore = async (partial, message = 'Program outline updated!') => {
    setIsSavingProgram(true)
    try {
      await setDoc(doc(db, 'program', 'outline'), { ...program, ...partial })
      toast.success(message)
    } catch (error) {
      console.error("Error saving program: ", error)
      toast.error('Failed to update program outline.')
    } finally {
      setIsSavingProgram(false)
    }
  }

  const linesToArray = (text) =>
    text.split('\n').map(line => line.trim()).filter(Boolean)

  const handleSaveDetails = () => {
    saveProgramToFirestore({ details: detailsDraft })
  }

  const handleSaveMinisters = () => {
    saveProgramToFirestore({
      officiating: linesToArray(officiatingDraft),
      supporting: linesToArray(supportingDraft)
    })
  }

  // Toggle whether visitors can see the 2nd and 3rd faces of the program outline
  const handleToggleProgramVisibility = () => {
    const next = !program.showFullProgram
    saveProgramToFirestore(
      { showFullProgram: next },
      next
        ? 'Full program outline is now visible to guests.'
        : 'Full program outline is now hidden. Guests only see the first face.'
    )
  }

  // Function to permanently delete a photo from Firestore (and from Storage for older photos)
  const handleDeletePhoto = async (photoId, photoUrl) => {
    if (!window.confirm("Are you sure you want to permanently delete this photo?")) return
    
    try {
      // Older photos may still live in Storage; new ones are stored only in Firestore
      if (photoUrl && photoUrl.startsWith('http')) {
        try {
          await deleteObject(ref(storage, photoUrl))
        } catch (storageError) {
          console.warn('Storage file not found or already removed:', storageError)
        }
      }
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
            <div className="flex flex-col gap-8">

              {/* Visibility toggle */}
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${program.showFullProgram ? 'bg-emerald-green/10' : 'bg-rosewood-pink/10'}`}>
                    {program.showFullProgram
                      ? <Eye className="w-5 h-5 text-emerald-green" />
                      : <EyeOff className="w-5 h-5 text-rosewood-pink" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-emerald-green">Show Full Program to Guests</h3>
                    <p className="text-[11px] md:text-xs text-emerald-green/60 mt-0.5">
                      {program.showFullProgram
                        ? 'ON: guests can see all three faces of the program outline.'
                        : 'OFF: guests only see the first face, with a "available soon" message under it.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={program.showFullProgram}
                  onClick={handleToggleProgramVisibility}
                  disabled={isSavingProgram}
                  className="flex items-center gap-3 shrink-0 self-start md:self-center disabled:opacity-70"
                  title="Toggle program visibility"
                >
                  <span className={`text-xs font-sans font-bold ${program.showFullProgram ? 'text-emerald-green' : 'text-rosewood-pink'}`}>
                    {program.showFullProgram ? 'ON' : 'OFF'}
                  </span>
                  <span className={`relative inline-block w-14 h-7 rounded-full transition-colors duration-300 ${program.showFullProgram ? 'bg-emerald-green' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${program.showFullProgram ? 'translate-x-7' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>

              {/* Thank you note & scripture */}
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-5">
                <h3 className="text-lg font-display text-emerald-green">Thank You &amp; Scripture Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailFields.map((field) => (
                    <div
                      key={field.key}
                      className={`flex flex-col gap-1 ${['quote'].includes(field.key) ? 'md:col-span-2' : ''}`}
                    >
                      <label className="text-xs font-sans font-semibold text-emerald-green">{field.label}</label>
                      <input
                        type="text"
                        value={detailsDraft[field.key] || ''}
                        onChange={(e) => setDetailsDraft({ ...detailsDraft, [field.key]: e.target.value })}
                        className="border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSaveDetails}
                  disabled={isSavingProgram}
                  className="self-end bg-emerald-green text-off-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-green/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSavingProgram && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Details
                </button>
              </div>

              {/* Ministers */}
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-5">
                <h3 className="text-lg font-display text-emerald-green">Ministers</h3>
                <p className="text-[11px] text-emerald-green/60 -mt-3">Enter one name per line.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-sans font-semibold text-emerald-green">Officiating Ministers</label>
                    <textarea
                      rows={8}
                      value={officiatingDraft}
                      onChange={(e) => setOfficiatingDraft(e.target.value)}
                      className="border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-sans font-semibold text-emerald-green">Supporting Ministers</label>
                    <textarea
                      rows={8}
                      value={supportingDraft}
                      onChange={(e) => setSupportingDraft(e.target.value)}
                      className="border border-emerald-green/30 rounded-lg p-2.5 text-xs md:text-sm font-sans focus:outline-none focus:border-curry-gold"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveMinisters}
                  disabled={isSavingProgram}
                  className="self-end bg-emerald-green text-off-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-green/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSavingProgram && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Ministers
                </button>
              </div>

              {/* Part 1 : Order of Service */}
              <ItemListManager
                title="Order of Service (Part 1)"
                items={program.items}
                onSave={(updated) => saveProgramToFirestore({ items: updated })}
                saving={isSavingProgram}
                itemPlaceholder="Service Item (e.g. Opening Prayer)"
              />

              {/* Part 2 : Order of Photography (item only, no time / assignee) */}
              <ItemListManager
                title="Order of Photography (Part 2)"
                items={program.photoItems}
                onSave={(updated) => saveProgramToFirestore({ photoItems: updated })}
                saving={isSavingProgram}
                itemPlaceholder="Photography Item (e.g. Couple with Parents)"
                simple
              />

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

              {/* Thank You Message toggle */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-sans font-semibold text-emerald-green flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${thankYouMode ? 'text-curry-gold' : 'text-emerald-green'}`} />
                  Thank You Message
                </label>
                <button
                  onClick={() => setThankYouMode(!thankYouMode)}
                  className={`p-3 rounded-lg font-sans text-sm font-bold flex items-center justify-center gap-2 transition-colors ${thankYouMode ? 'bg-curry-gold/10 text-curry-gold border border-curry-gold/50' : 'bg-emerald-green/10 text-emerald-green border border-emerald-green/50'}`}
                >
                  {thankYouMode ? 'Thank You Message is ON (Click to Turn Off)' : 'Thank You Message is OFF (Click to Turn On)'}
                </button>
                <p className="text-[10px] text-emerald-green/60">When ON, the countdown and Confirm Attendance are hidden, and guests see a thank you message from Mr. &amp; Mrs. Quansah instead.</p>
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
              /* Full-size, uncropped photos: each image keeps its own natural shape */
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group bg-white p-2 rounded-xl shadow-sm border border-emerald-green/10 mb-4 break-inside-avoid">
                    <img 
                      src={photo.url} 
                      alt="Uploaded by guest" 
                      className="block w-full h-auto rounded-lg"
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