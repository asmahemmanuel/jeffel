import { createContext, useContext, useState, useEffect } from 'react'

const GalleryContext = createContext(null)
const STORAGE_KEY = 'jeffel-gallery-photos'

export function GalleryProvider({ children }) {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setPhotos(JSON.parse(saved))
    } catch {
      // ignore corrupted storage
    }
  }, [])

  const addPhotos = (files) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              src: reader.result,
              name: file.name,
            })
          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers).then((newPhotos) => {
      setPhotos((prev) => {
        const updated = [...newPhotos, ...prev]
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch {
          // storage full — newest photos still show for this session
        }
        return updated
      })
    })
  }

  return (
    <GalleryContext.Provider value={{ photos, addPhotos }}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  return useContext(GalleryContext)
}