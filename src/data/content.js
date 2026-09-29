import heroPhoto1 from '../assets/hero-1.jpg'
import heroPhoto2 from '../assets/hero-2.jpg'
import heroPhoto3 from '../assets/hero-3.jpg'
import heroPhoto4 from '../assets/hero-4.jpg'
import heroPhoto5 from '../assets/hero-5.jpg'
import heroPhoto6 from '../assets/jeffffffff.jpeg'
import heroPhoto7 from '../assets/jefffffff.jpeg'
import storyPhoto from '../assets/story.jpg'
import colorsPhoto from '../assets/colors.jpg'
import contactPhoto from '../assets/contact.jpg'
import contactPhoto2 from '../assets/contact2.jpg' 

export const couple = {
  partnerOne: 'Jeffrey Quansah',
  partnerTwo: 'Eliana Amoafo',
  hashtag: '#TheJeffELChapter',
  tagline: "We can't wait to share our special day with you",
  weddingDateLabel: 'Month Day and Day',
  countdownTarget: '2026-11-06T08:00:00',
}

export const heroImages = [
  { id: 1, label: 'Photo 1', src: heroPhoto1 },
  { id: 2, label: 'Photo 2', src: heroPhoto2 },
  { id: 3, label: 'Photo 3', src: heroPhoto3 },
  { id: 4, label: 'Photo 4', src: heroPhoto4 },
  { id: 5, label: 'Photo 5', src: heroPhoto5 },
  { id: 6, label: 'Photo 6', src: heroPhoto6 },
  { id: 7, label: 'Photo 7', src: heroPhoto7 },
]

export const ourStory = {
  paragraphs: [
    "Our story began with a quiet glance in church, then a courageous hello that awakened something already written upon our hearts. From contacts exchanged on the stairs to conversations that blossomed into love, we found in each other a place to be known, cherished, and free. Through laughter, trials, prayers, and seasons, we kept choosing one another. Now, with God at our centre, the forever we once whispered about has become the beautiful chapter we are about to live."
  ],
  closingTag: '#TheJeffELChapter',
}

export const storyImage = {
  src: storyPhoto,
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
  src: colorsPhoto,
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
    // Matches the URL structure to open the side panel directly
    link: 'https://www.google.com/maps?ll=5.695203,-0.213848&q=Global+Revival+Ministries+(Revival+City)&z=16',
  },
  {
    id: 'thanksgiving',
    date: 'Sunday November 1st 2026',
    title: 'Thanksgiving',
    time: '9:00am',
    location: 'Global Revival Ministries, RC (Direction)',
    // Matches the URL structure to open the side panel directly
    link: 'https://www.google.com/maps?ll=5.695203,-0.213848&q=Global+Revival+Ministries+(Revival+City)&z=16',
  },
]

export const directions = [
  {
    id: 'mainVenue',
    label: 'White Wedding & Thanksgiving',
    venue: 'Global Revival Ministries, RC',
    // Embed link strictly for the on-page iframe
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15881.743110903328!2d-0.2138478!3d5.6952026!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c42702f9569%3A0x9472bf0f014efef4!2sGlobal%20Revival%20Ministries%20(Revival%20City)!5e0!3m2!1sen!2sgh',
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
  src: contactPhoto,
  alt: 'Pre-wedding photo of the couple',
}

export const contactImage2 = {
  src: contactPhoto2,
  alt: 'Second pre-wedding photo of the couple',
}

export const coupleMessage = {
  title: 'A Message From Us',
  body: "Thank you for being part of our story. Your presence, love, and support means the world to us as we begin this new chapter together. We can't wait to celebrate with you!",
  signature: 'With love, Jeffrey Quansah & Eliana Amoafo',
}