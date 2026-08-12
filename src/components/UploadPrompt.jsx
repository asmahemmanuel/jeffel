import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import { useGallery } from '../context/GalleryContext'

export default function UploadPrompt() {
  const inputRef = useRef(null)
  const { addPhotos } = useGallery()

  const handleChange = (e) => {
    if (e.target.files?.length) {
      addPhotos(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
      {/* Dangling label + curved dashed arrow pointing to the button */}
      <div className="flex flex-col items-center mb-1">
        <span className="font-body italic text-white text-sm sm:text-base drop-shadow-md rotate-[-3deg]">
          Share your photos!
        </span>
        <svg
          width="28"
          height="34"
          viewBox="0 0 28 34"
          fill="none"
          className="mt-1"
        >
          <path
            d="M14 1 C14 14, 4 16, 4 26"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          <path
            d="M4 26 L0 20 M4 26 L9 22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <motion.button
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        className="flex items-center gap-2 bg-off-white text-emerald-green px-5 py-3 sm:px-6 sm:py-3.5 rounded-full shadow-lg font-sans text-sm sm:text-base font-semibold tracking-wide"
      >
        <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
        Upload Your Photos
      </motion.button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}