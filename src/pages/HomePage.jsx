import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import OurStory from '../components/OurStory'
import StoryImage from '../components/StoryImage'
import Wishes from '../components/Wishes'
import OurColors from '../components/OurColors'
import ColorsImage from '../components/ColorsImage'
import Schedule from '../components/Schedule'
import Directions from '../components/Directions'
import QandA from '../components/QandA'
import Contact from '../components/Contact'
import ContactImage2 from '../components/ContactImage2' 
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Countdown />
      <OurStory />
      <StoryImage />
      <Wishes />
      <OurColors />
      <ColorsImage />
      <Schedule />
      <Directions />
      
      <QandA />
      <Contact />
      
      {/* Image above the Footer */}
      <ContactImage2 /> 
      
      <Footer />
    </>
  )
}