import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  animation = 'animate-slide-up',
  className = '',
  style = {},
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)

          // We only need to detect the element once.
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${
        isVisible ? animation : 'opacity-0'
      }`}
      style={style}
    >
      {children}
    </div>
  )
}