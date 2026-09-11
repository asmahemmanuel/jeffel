// Once your images are ready, drop them in src/assets/ and uncomment the
// imports below, then swap the matching `src: ''` to the imported variable.
//
// import heroPhoto1 from '../assets/hero-1.jpg'
// import heroPhoto2 from '../assets/hero-2.jpg'
// import heroPhoto3 from '../assets/hero-3.jpg'
// import heroPhoto4 from '../assets/hero-4.jpg'
// import heroPhoto5 from '../assets/hero-5.jpg'
import storyPhoto from '../assets/story.jpg'
// import colorsPhoto from '../assets/colors.jpg'
// import contactPhoto from '../assets/contact.jpg'

export const couple = {
  partnerOne: 'Jeffrey Quansah',
  partnerTwo: 'Eliana Amoafo',
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
    "Our story began with a quiet glance in church, then a courageous hello that awakened something already written upon our hearts. From contacts exchanged on the stairs to conversations that blossomed into love, we found in each other a place to be known, cherished, and free. Through laughter, trials, prayers, and seasons, we kept choosing one another. Now, with God at our centre, the forever we once whispered about has become the beautiful chapter we are about to live."
  ],
  closingTag: '#TheJeffELChapter',
}

export const storyImage = {
  src: storyPhoto, // Assigned the imported variable here!
  alt: 'Pre-wedding photo of the couple',
}

export const programNotice = {
  title: 'Order of Service & Program Outline',
  description: 'Explore the full timeline, order of events, and assigned ministers for our white wedding.',
  buttonText: 'View Program Outline',
}

export const programOutline = [
  {
    title: 'Traditional Marriage',
    date: 'Thursday, October 29th, 2026',
    time: '10:00 AM',
    venue: 'Private Family Venue',
    description: 'A celebration of our culture, family union, and traditional rites.',
  },
  {
    title: 'White Wedding',
    date: 'Saturday, October 31st, 2026',
    time: '11:00 AM',
    venue: 'Global Revival Ministries, RC (Direction)',
    description: 'Exchange of vows, holy matrimony, and celebration of our love before God and witnesses.',
  },
  {
    title: 'Thanksgiving Service',
    date: 'Sunday, November 1st, 2026',
    time: '9:00 AM',
    venue: 'Global Revival Ministries, RC (Direction)',
    description: 'Joining together in worship, gratitude, and thanksgiving for the journey ahead.',
  },
]

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
    date: 'Thursday October 29th 2026',
    title: 'Traditional marriage',
    time: '10:00am',
    location: '',
    link: null,
  },
  {
    id: 'whiteWedding',
    date: 'Saturday October 31st 2026',
    title: 'White Wedding',
    time: '11:00am',
    location: 'Global Revival Ministries, RC (Direction)',
    link: 'https://maps.app.goo.gl/jFnZ5KCfwshGHQHu6?g_st=iwb',
  },
  {
    id: 'thanksgiving',
    date: 'Sunday November 1st 2026',
    title: 'Thanksgiving',
    time: '9:00am',
    location: 'Global Revival Ministries, RC (Direction)',
    link: 'https://maps.app.goo.gl/jFnZ5KCfwshGHQHu6?g_st=iwb',
  },
]

export const directions = [
  {
    id: 'mainVenue',
    label: 'White Wedding & Thanksgiving',
    venue: 'Global Revival Ministries, RC',
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
    { number: 'Momo: 0556608885 | ECOBANK: 1441004956794', name: 'Jeffrey Quansah' },
    { number: 'Momo: 0539544798 | ABSA: 0853001333', name: 'Eliana Amoafo' },
  ],
  reference: 'JeffEl',
}

export const contacts = [
  { name: 'Contact One', phone: '000 000 0000' }
]

export const contactImage = {
  src: '', // src: contactPhoto
  alt: 'Pre-wedding photo of the couple',
}

export const coupleMessage = {
  title: 'A Message From Us',
  body: "Thank you for being part of our story. Your presence, love, and support means the world to us as we begin this new chapter together. We can't wait to celebrate with you!",
  signature: 'With love, Jeffrey Quansah & Eliana Amoafo',
}