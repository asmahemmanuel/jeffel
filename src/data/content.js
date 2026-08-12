// Once your images are ready, drop them in src/assets/ and uncomment the
// imports below, then swap the matching `src: ''` to the imported variable.
//
// import heroPhoto1 from '../assets/hero-1.jpg'
// import heroPhoto2 from '../assets/hero-2.jpg'
// import heroPhoto3 from '../assets/hero-3.jpg'
// import heroPhoto4 from '../assets/hero-4.jpg'
// import heroPhoto5 from '../assets/hero-5.jpg'
// import storyPhoto from '../assets/story.jpg'
// import colorsPhoto from '../assets/colors.jpg'
// import contactPhoto from '../assets/contact.jpg'

export const couple = {
  partnerOne: 'Partner One',
  partnerTwo: 'Partner Two',
  hashtag: '#TheJeffELChapter',
  tagline: "We can't wait to share our special day with you",
  weddingDateLabel: 'Month Day and Day',
  // Used by the countdown — set this to your real wedding date/time
  countdownTarget: '2026-11-06T08:00:00',
}

export const heroImages = [
  { id: 1, label: 'Photo 1', src: '' }, // src: heroPhoto1
  { id: 2, label: 'Photo 2', src: '' }, // src: heroPhoto2
  { id: 3, label: 'Photo 3', src: '' }, // src: heroPhoto3
  { id: 4, label: 'Photo 4', src: '' }, // src: heroPhoto4
  { id: 5, label: 'Photo 5', src: '' }, // src: heroPhoto5
]

export const ourStory = {
  paragraphs: [
    "Replace this paragraph with how you first met — the setting, how it happened, and that first spark of recognition.",
    "Replace this paragraph with the story of how you got to know each other — the details that made it clear this was different.",
    "Replace this paragraph with your first date and the journey since, leading up to today.",
    "Replace this closing line with something personal — a favorite phrase, an inside joke, or how you feel about the day ahead.",
  ],
  closingTag: '#TheJeffELChapter',
}

export const storyImage = {
  src: '', // src: storyPhoto
  alt: 'Pre-wedding photo of the couple',
}

export const colors = [
  { name: 'Emerald Green', hex: '#006B3C' },
  { name: 'Olive Green', hex: '#6B7134' },
  { name: 'Curry Gold', hex: '#C99400' },
  { name: 'Off White', hex: '#F8F3E7' },
  { name: 'Rosewood Pink', hex: '#B36A6D' },
]

export const colorsImage = {
  src: '', // src: colorsPhoto
  alt: 'Pre-wedding photo of the couple',
}

export const schedule = [
  {
    id: 'traditional',
    date: 'Thursday, Month Day, Year',
    title: 'Traditional marriage',
    time: '8:00am',
    location: 'Venue / Area name',
    link: null,
  },
  {
    id: 'whiteWedding',
    date: 'Saturday, Month Day, Year',
    title: 'White Wedding',
    time: '12:00 noon',
    location: 'Venue Name, Area (landmark reference)',
    link: '#whiteWedding',
  },
  {
    id: 'thanksgiving',
    date: 'Sunday, Month Day, Year',
    title: 'Thanksgiving',
    time: '9:00am',
    location: 'Venue Name, Area (landmark reference)',
    link: '#thanksgiving',
  },
]

export const directions = [
  {
    id: 'whiteWedding',
    label: 'White Wedding',
    venue: 'Venue Name, Area (landmark reference)',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.421!2d-0.186964!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAccra!5e0!3m2!1sen!2sgh',
  },
  {
    id: 'thanksgiving',
    label: 'Thanksgiving',
    venue: 'Venue Name, Area (landmark reference)',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.421!2d-0.186964!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAccra!5e0!3m2!1sen!2sgh',
  },
]

export const faqs = [
  {
    question: "What's the dress code",
    answer: 'Our colors or any elegant attire.',
  },
  {
    question: 'Can I bring a guest',
    answer: "Yes, you're welcome to come with someone.",
  },
  {
    question: 'Where should I park',
    answer: 'There will be plenty of free parking available near the venue.',
  },
  {
    question: 'Is it okay to take pictures with phones and cameras during the wedding',
    answer:
      "Yes! We'd love you to capture and share moments. We just kindly ask that you allow our photographers to do their work without interference.",
  },
]

export const giftInfo = {
  note: 'If you would like to gift us in cash, please see the details below:',
  entries: [
    { number: '000 000 0000', name: 'Partner Two Full Name' },
    { number: '000 000 0000', name: 'Partner One Full Name' },
  ],
  reference: 'YOUR WEDDING REF',
}

export const contacts = [
  { name: 'Contact One', phone: '000 000 0000' },
  { name: 'Contact Two', phone: '000 000 0000' },
]

export const contactImage = {
  src: '', // src: contactPhoto
  alt: 'Pre-wedding photo of the couple',
}

export const coupleMessage = {
  title: 'A Message From Us',
  body: "Thank you for being part of our story. Your presence, love, and support mean the world to us as we begin this new chapter together. We can't wait to celebrate with you!",
  signature: 'With love, Partner One & Partner Two',
}