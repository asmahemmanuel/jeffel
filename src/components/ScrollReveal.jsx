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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target) // fires once, then stops watching
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animation : 'opacity-0'}`}
      style={style}
    >
      {children}
    </div>
  )
}