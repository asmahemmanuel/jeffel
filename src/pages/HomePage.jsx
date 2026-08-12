import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import OurStory from '../components/OurStory'
import StoryImage from '../components/StoryImage'
import OurColors from '../components/OurColors'
import ColorsImage from '../components/ColorsImage'
import Schedule from '../components/Schedule'
import Directions from '../components/Directions'
import ContactImage from '../components/ContactImage'
import QandA from '../components/QandA'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Countdown />
      <OurStory />
      <StoryImage />
      <OurColors />
      <ColorsImage />
      <Schedule />
      <Directions />
      <ContactImage />
      <QandA />
      <Contact />
      <Footer />
    </>
  )
}