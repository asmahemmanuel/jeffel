import ScrollReveal from './ScrollReveal'
import { ourStory } from '../data/content'

export default function OurStory() {
  return (
    <section id="story" className="max-w-3xl mx-auto px-6 py-20">
      <ScrollReveal animation="animate-slide-up">
        <h2 className="text-3xl md:text-4xl text-center text-emerald-green mb-10">
          Our Story
        </h2>
      </ScrollReveal>

      <div className="space-y-6">
        {ourStory.paragraphs.map((p, i) => (
          <ScrollReveal key={i} animation="animate-slide-up">
            <p className="text-lg leading-relaxed text-emerald-green/90">{p}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal animation="animate-fade-in">
        {/* Removed the 'uppercase' class and added .replace() to enforce mixed casing */}
        <p className="text-center text-curry-gold font-sans tracking-widest text-sm mt-10">
          {ourStory.closingTag.replace(/THEJEFFELCHAPTER/g, 'TheJeffELChapter')}
        </p>
      </ScrollReveal>
    </section>
  )
}