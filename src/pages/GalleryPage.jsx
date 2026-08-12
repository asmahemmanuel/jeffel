import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImageOff, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function GalleryPage() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Query Firestore for uploaded photos, ordered by newest first
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPhotos(fetchedPhotos)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching photos: ", error)
      setLoading(false)
    })

    // Cleanup subscription when the component unmounts
    return () => unsubscribe()
  }, [])

  // Instantly hide any broken image placeholders if the file was deleted from Storage
  const handleImageError = (photoId) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId))
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-off-white">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16 min-h-[70vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl text-center text-emerald-green mb-2"
        >
          Guest Gallery
        </motion.h1>
        <p className="text-center text-emerald-green/70 mb-6 font-sans text-sm max-w-lg mx-auto leading-relaxed">
          Photos our guests have shared. Upload yours from the hero photo at the top of the
          home page!
        </p>

        {/* Back to Home Button */}
        <div className="flex justify-center mb-12">
          <Link 
            to="/"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-sans text-sm font-semibold tracking-wide border-2 border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-off-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO HOME
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-green/50">
            <Loader2 className="w-10 h-10 mb-3 animate-spin text-curry-gold" />
            <p className="font-sans text-sm">Loading beautiful memories...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 text-emerald-green/50">
            <ImageOff className="w-10 h-10 mb-3" />
            <p className="font-sans text-sm">No photos shared yet — be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="aspect-square overflow-hidden rounded-lg shadow-sm group"
              >
                <img
                  src={photo.url} 
                  alt="Wedding memory"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onError={() => handleImageError(photo.id)} // Triggers if the image is missing
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}