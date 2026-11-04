// All business copy lives here so it can be edited without touching layout code.
// Source: dulyqualified.co.za (homepage, /sample and /privacy), October 2026.

export const contact = {
  phoneDisplay: '+27 65 576 9100',
  phoneHref: 'tel:+27655769100',
  whatsappNumber: '27655769100',
  email: 'info@dulyqualified.co.za',
  location: 'Gqeberha, South Africa',
};

export const whatsappLink = (text = "Hi Duly Qualified, I'd like to book a 15-minute call.") =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;

// Remote stock videos from the MotionSites "Guardnet" template.
// Third-party hosted: replace with your own files (e.g. /videos/hero.mp4) before launch.
export const videos = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_074215_f4339e1c-0b1a-4f60-98b2-90e3d7840cb7.mp4',
  paperwork:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072418_508a7d2e-396d-4f6f-9d42-ec920fcf7755.mp4',
  card: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4',
};

export const navLinks = [
  { label: 'how it works', href: '/#how' },
  { label: 'every month', href: '/#month' },
  { label: 'tenders', href: '/#tenders' },
  { label: 'pricing', href: '/#pricing' },
  { label: 'sample report', href: '/sample' },
];

export const steps = [
  {
    n: '01',
    title: 'We map your market',
    body: 'Every business in your area that buys what you sell, from public business records, maps and listings.',
  },
  {
    n: '02',
    title: 'We check each one by hand',
    body: 'Still trading, the right size, in your area, and a real reason to talk now. Most don’t make it.',
  },
  {
    n: '03',
    title: 'You get the brief',
    body: 'Who to contact, why now, and a first message that asks permission before it pitches. You approve and send it yourself.',
  },
  {
    n: '04',
    title: 'We track what happens',
    body: 'Mark each prospect as sent, replied or not interested. On Starter, you send the first message and handle replies yourself. On Growth, we also follow up with prospects who agreed to hear from you. Next month’s list builds on what you learn.',
  },
];

export const pilotFunnel = [
  { value: 368, label: 'businesses found' },
  { value: 201, label: 'tested' },
  { value: 27, label: 'checked by hand' },
  { value: 12, label: 'ready to contact' },
];

export const deliverables = [
  {
    tag: 'Qualified',
    n: '01 · Leads',
    title: 'Twenty businesses ready to hear from you',
    body: '20 qualified prospects, every month.',
    points: ['Why each one, and why now', 'The right person and the best way in', 'A first message you can edit, approve and send'],
  },
  {
    tag: 'Matched',
    n: '02 · Tenders',
    title: 'The tenders you can actually win',
    body: 'We read every public tender in your province, keep the ones that fit your service and size, and grade them, so you only open the ones worth your time.',
    points: ['Closing dates and briefing sessions', 'What each one needs from you', 'Missed ones too, so you see what’s coming round again'],
  },
  {
    tag: 'In order',
    n: '03 · Compliance',
    title: 'Your papers, kept current',
    body: 'One checklist for everything a tender asks for, with expiry dates and a reminder before anything lapses.',
    points: ['CSD, tax PIN and B-BBEE', 'Industry letters of good standing', 'Help getting what’s missing'],
  },
  {
    tag: 'Ready to sign',
    n: '04 · Bids',
    title: 'Bid packs, prepared',
    body: 'When a tender is worth it, we put the pack together: returnable documents checked, forms filled in, pricing schedule set up. You check it, sign it and submit.',
    points: ['A checklist against the tender’s own list', 'Nothing goes in without your sign-off'],
  },
];

export type DocStatus = 'In place' | 'Renew in 12 days' | 'Missing' | 'Check';

export const complianceFolder: { name: string; detail: string; status: DocStatus }[] = [
  { name: 'CIPC registration', detail: 'Company and current directors', status: 'In place' },
  { name: 'CSD supplier number', detail: 'National Treasury Central Supplier Database', status: 'In place' },
  { name: 'Tax compliance PIN', detail: 'SARS eFiling', status: 'In place' },
  { name: 'B-BBEE certificate or sworn affidavit', detail: 'Level of contributor', status: 'In place' },
  { name: 'PSIRA registration', detail: 'Company, directors and guards', status: 'In place' },
  { name: 'PSIRA letter of good standing', detail: 'Must be valid at closing', status: 'Renew in 12 days' },
  { name: 'COIDA letter of good standing', detail: 'Compensation Fund', status: 'Missing' },
  { name: 'PSSPF letter of good standing', detail: 'Private Security Sector Provident Fund', status: 'Missing' },
  { name: 'Bargaining council registration', detail: 'NBCPSS, with contributions up to date', status: 'In place' },
  { name: 'Public liability insurance', detail: 'Or a letter of intent from your insurer', status: 'In place' },
  { name: 'Municipal rates clearance', detail: 'Accounts up to date, or an arrangement', status: 'Check' },
];

export const sectors = [
  {
    title: 'Security firms',
    body: 'Guarding, armed response and technical security.',
    buyers: ['Industrial sites, warehouses and logistics yards', 'Shopping centres, office parks and estates', 'Schools, retirement villages and new developments'],
  },
  {
    title: 'Cleaning and hygiene firms',
    body: 'Contract cleaning, hygiene services and specialist cleaning.',
    buyers: ['Offices, clinics and practices', 'Factories, warehouses and food producers', 'Body corporates, schools and hospitality'],
  },
];

export const cities = [
  { name: 'Gqeberha', status: 'now' },
  { name: 'East London', status: 'next' },
  { name: 'Bloemfontein', status: 'next' },
  { name: 'Cape Town', status: 'next' },
];

export const starterFeatures = [
  '20 qualified prospects with first messages',
  'Tender matches for your service, graded',
  'Compliance folder with expiry reminders',
  'Private monthly report and tracker',
  'A monthly scorecard: prospects delivered, replies, tenders matched and documents about to expire',
];

export const plans = [
  {
    id: 'launch',
    badge: 'Launch',
    name: 'Launch month',
    price: 'R2,999',
    per: '/ first month',
    blurb: 'Everything in Starter for your first month. For the first 3 clients only.',
    founding: null as string | null,
    features: [
      '20 qualified prospects with first messages',
      'Tender matches for your service',
      'Compliance folder with expiry reminders',
      'Private monthly report and tracker',
    ],
    featured: false,
  },
  {
    id: 'starter',
    badge: 'Starter',
    name: 'Starter',
    price: 'R5,000',
    per: '/ month',
    blurb: 'Prospects, tenders and compliance for one service in one city.',
    founding: 'Founding client rate: R4,500 a month for 6 months',
    features: starterFeatures,
    featured: false,
  },
  {
    id: 'growth',
    badge: 'Growth',
    name: 'Growth',
    price: 'R9,500',
    per: '/ month',
    blurb: 'Everything in Starter, plus bid preparation and more support.',
    founding: 'Founding client rate: R8,999 a month for 6 months',
    features: [
      '20 qualified prospects with first messages',
      'Up to 2 tender bids prepared a month',
      'Follow-up for prospects who agreed to hear from you',
      'A monthly competitor report',
      'An insider compliance review',
      'A monthly scorecard: prospects delivered, replies, tenders matched and documents about to expire',
    ],
    featured: true,
  },
];

export const terms = [
  'After the launch month: a 3-month minimum, then month to month with 30 days’ notice.',
  'Growth includes up to 2 tender bids a month. Extra bids cost R3,500 to R6,500 each.',
];
export const promises = {
  yes: ['20 checked prospects a month', 'Compliant first messages', 'Tender matches', 'A readiness report'],
  no: ['Replies', 'Meetings', 'Contracts', 'Tender wins'],
};

export const faqs = [
  {
    q: 'Is this cold spam?',
    a: 'No. Every first message asks permission before it pitches, says who it’s from and makes it easy to say no. Anyone who says no is marked and never contacted again. It keeps you on the right side of POPIA, and it gets better replies.',
  },
  {
    q: 'Who sends the messages?',
    a: 'You do, from your own email or phone. We write the drafts, you edit and approve them. Nothing goes out in your name without you.',
  },
  {
    q: 'What makes a lead “qualified”?',
    a: 'It’s still trading, it’s the right size and in your area, there’s a real reason to talk now, and we’ve found the right person or the best way in. A person checks every one before it reaches you.',
  },
  {
    q: 'We’re not registered on the CSD yet. Can we still start?',
    a: 'Yes. Getting tender-ready is part of the first month. The CSD number, tax compliance PIN and B-BBEE affidavit are free, and we walk you through each one.',
  },
  {
    q: 'Do you write and submit the tender for us?',
    a: 'We prepare the pack and check it against the tender’s own list. You review it, sign it and submit it, because the bid is yours.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'Gqeberha and the rest of Nelson Mandela Bay now, with East London, Bloemfontein and Cape Town next. Tender matching covers the whole province you work in.',
  },
  {
    q: 'Is there a contract?',
    a: 'After the launch month there’s a 3-month minimum. After that it’s month to month, with 30 days’ notice.',
  },
];
