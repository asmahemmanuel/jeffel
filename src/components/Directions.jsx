import { useState } from 'react'
import ScrollReveal from './ScrollReveal'
import { MapPin } from 'lucide-react'
import { directions } from '../data/content'

function MapEmbed({ d }) {
  const [active, setActive] = useState(false)

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-md">
      <iframe
        title={d.label}
        src={d.mapEmbedSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Transparent overlay: blocks the map from stealing scroll/touch
          gestures until the user deliberately taps to interact with it */}
      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px] group"
          aria-label={`Tap to interact with the map for ${d.label}`}
        >
          <span className="flex items-center gap-2 bg-off-white text-emerald-green px-4 py-2 rounded-full shadow-md font-sans text-sm font-medium group-active:scale-95 transition-transform">
            <MapPin className="w-4 h-4" />
            Tap to explore map
          </span>
        </button>
      )}

      {/* Once active, tapping outside the iframe area re-locks it when the
          section scrolls out of view, so it doesn't stay a scroll trap
          for the rest of the page */}
      {active && (
        <button
          type="button"
          onClick={() => setActive(false)}
          className="absolute top-2 right-2 bg-off-white/90 text-emerald-green text-xs font-sans px-3 py-1.5 rounded-full shadow-md"
        >
          Done
        </button>
      )}
    </div>
  )
}

export default function Directions() {
  return (
    <section id="directions" className="bg-off-white py-20">
      <ScrollReveal animation="animate-slide-up">
        <h2 className="text-3xl md:text-4xl text-center text-emerald-green mb-12 px-6">
          Directions
        </h2>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {directions.map((d) => (
          <ScrollReveal key={d.id} animation="animate-slide-up">
            <h3 className="text-xl text-curry-gold font-sans uppercase tracking-wide mb-1">
              {d.label}
            </h3>
            <p className="text-emerald-green/80 mb-4">{d.venue}</p>
            <MapEmbed d={d} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}