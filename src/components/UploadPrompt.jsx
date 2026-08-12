import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import { db, storage } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function UploadPrompt() {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Compress before upload — smaller files upload faster and
        // load faster later in the Gallery grid
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        })

        const fileRef = ref(storage, `gallery/${Date.now()}-${file.name}`)
        await uploadBytes(fileRef, compressed)
        const url = await getDownloadURL(fileRef)

        await addDoc(collection(db, 'gallery'), {
          url,
          createdAt: serverTimestamp(),
        })
      }
      toast.success('Photos shared! Check the Gallery page.')
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Something went wrong uploading your photos.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
      <div className="flex flex-col items-center mb-1">
        <span className="font-body italic text-white text-sm sm:text-base drop-shadow-md rotate-[-3deg]">
          Share your photos!
        </span>
        <svg width="28" height="34" viewBox="0 0 28 34" fill="none" className="mt-1">
          <path
            d="M14 1 C14 14, 4 16, 4 26"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          <path d="M4 26 L0 20 M4 26 L9 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <motion.button
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        disabled={uploading}
        className="flex items-center gap-2 bg-off-white text-emerald-green px-5 py-3 sm:px-6 sm:py-3.5 rounded-full shadow-lg font-sans text-sm sm:text-base font-semibold tracking-wide disabled:opacity-70"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            Upload Your Photos
          </>
        )}
      </motion.button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  )
}