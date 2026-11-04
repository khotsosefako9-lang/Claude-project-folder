// Sample report content, from dulyqualified.co.za/sample (October 2026).
// Business names are hidden in the sample, as on the original.

export type LeadTag = 'Why now' | 'Renewal' | 'Fit';

export const sampleStats = [
  { value: '1,060', label: 'commercial sites mapped across the metro' },
  { value: '605', label: 'with a website or listing to check' },
  { value: '25', label: 'checked by hand, incl. five from this month’s news' },
  { value: '20', label: 'ready to contact' },
];

export const tagMeaning: Record<LeadTag, string> = {
  'Why now': 'something just changed',
  Renewal: 'already uses security, worth a quote',
  Fit: 'the right size, place and contact',
};

export const leads: { type: string; tag: LeadTag; angle: string; source?: string; who: string; how: string }[] = [
  { type: 'Steel producer · special economic zone', tag: 'Why now', angle: 'R500m expansion inaugurated on 20 October. The new mill moves to 24-hour production in the coming weeks, and staff grow from about 750 to 900 within a year.', source: 'Eastern Cape Industrial News, 21 Oct 2026', who: 'Operations or procurement', how: 'Main switchboard' },
  { type: 'Logistics park developer · Cape Road, Greenbushes', tag: 'Why now', angle: 'First 10,000 m² warehouse completes in December and the second breaks ground this month. Site security during the build, then tenants moving in.', source: 'Algoa FM, 16 Oct 2026', who: 'Development office', how: 'Developer’s regional contact' },
  { type: 'New shopping centre · Fairview', tag: 'Why now', angle: 'Nearing completion, with the opening date still to be announced. Guarding is usually appointed before the doors open.', source: 'BusinessTech, 21 Oct 2026', who: 'Developer’s property office', how: 'Leasing contact' },
  { type: 'Automotive components plant · Kariega', tag: 'Why now', angle: 'New plant opened this year after about R145m of investment, with around 140 staff.', source: 'Algoa FM, 12 Jun 2026', who: 'Plant manager', how: 'Main switchboard' },
  { type: 'Aparthotel and conference venue · beachfront', tag: 'Why now', angle: 'R270m, 145-room property opened in May, with a conference venue. Events bring extra guarding on demand.', source: 'Engineering News, 21 Apr 2026', who: 'General manager', how: 'Reception' },
  { type: 'Neighbourhood shopping centre · Sherwood', tag: 'Renewal', angle: 'Supermarket-anchored centre with guards on duty around the clock. Ask how the current service is going and when it’s next reviewed.', who: 'Centre office', how: 'Phone and email published' },
  { type: 'Entertainment centre · Humewood beachfront', tag: 'Renewal', angle: 'Eleven tenants, open until 2am every day, with after-hours security already outsourced. Come with a better offer at renewal.', who: 'Centre manager', how: 'Named, with a direct email' },
  { type: 'Residential estate (HOA) · Gqeberha', tag: 'Renewal', angle: 'Security is run by an outside company for the homeowners’ association. Ask when the HOA next takes quotes.', who: 'Estate office', how: 'Email, weekdays' },
  { type: 'Golf and wildlife estate · coastal Gqeberha', tag: 'Renewal', angle: '24-hour guards on the first two phases, and the third and final phase is about to be developed.', who: 'Sales office', how: 'Named contacts' },
  { type: 'Wildlife estate, 1,000 ha · Kragga Kamma', tag: 'Renewal', angle: '24-hour security over a very large perimeter, with a clubhouse, café and a 50-plus village inside.', who: 'Reception', how: 'Phone and email published' },
  { type: 'Container logistics and depots · Markman', tag: 'Fit', angle: 'More than 110,000 m² across five sites in Gqeberha and Cape Town, 70,000 m² of secured yard and 200+ staff. Already runs a 24-hour control room, so pitch guarding that works with it.', who: 'Head office', how: 'Phone and WhatsApp' },
  { type: 'Convenience centre · Mount Pleasant', tag: 'Fit', angle: 'About 13 shops over basement parking. Managed by the same property group as number 13: one conversation, two sites.', who: 'Group property manager', how: 'Email published' },
  { type: 'Office park · South End beachfront', tag: 'Fit', angle: 'Beachfront office park, managed by the same property group as number 12. Pitch both together.', who: 'Property manager', how: 'Named, with a direct line' },
  { type: 'Retirement village, two sites · Fairview and Kabega', tag: 'Fit', angle: 'Electric fencing, CCTV, access control and panic buttons already in place. Two sites under one manager.', who: 'Named contact', how: 'Phone and WhatsApp' },
  { type: 'A-grade office park · Gqeberha', tag: 'Fit', angle: 'Sells itself on secure parking and backup power, with a named contact reachable directly.', who: 'Named contact', how: 'Direct cellphone' },
  { type: 'Shopping centre · Gqeberha', tag: 'Fit', angle: 'Supermarket anchor, a food court and long trading hours.', who: 'Centre management', how: 'Named, direct email' },
  { type: 'Neighbourhood shopping centre · Walmer', tag: 'Fit', angle: 'Corner-site centre with shops, restaurants and offices.', who: 'Centre office', how: 'Phone published' },
  { type: 'Retirement village, life-right · Gqeberha', tag: 'Fit', angle: 'Fully allocated, and lists security among its selling points.', who: 'Village office', how: 'Contact form' },
  { type: 'Rubber components manufacturer · Deal Party', tag: 'Fit', angle: 'Supplies car and tyre makers from the Deal Party industrial area, with a full factory on site.', who: 'Factory office', how: 'Phone published' },
  { type: 'Cold storage and transport depot · Neave Industrial', tag: 'Fit', angle: 'Refrigerated stock for up to 800 pallets and a fleet on site. The owner is reachable directly.', who: 'Owner', how: 'Direct cellphone' },
];

export const briefs = [
  {
    label: 'Lead 1 · Why now',
    channel: 'Email',
    business: 'Steel producer, special economic zone',
    contact: 'Operations manager',
    angleLabel: 'Why now',
    angle: 'New mill moving to 24-hour shifts',
    subject: 'Security for the new rolling mill',
    body: [
      'Good day,',
      'My name is [Your name] from [Your firm], a PSIRA-registered security company in Gqeberha.',
      'Congratulations on the new rolling mill. With the move to 24-hour production, we’d like to offer a proposal for guarding and access control at the new site.',
      'Would you be open to a short call next week? If not, simply reply and let me know, and I won’t contact you again.',
      'Kind regards,\n[Your name]',
    ],
  },
  {
    label: 'Lead 6 · Renewal',
    channel: 'Email',
    business: 'Neighbourhood shopping centre, Sherwood',
    contact: 'Centre office',
    angleLabel: 'Angle',
    angle: 'Ask when the guarding contract is next reviewed',
    subject: 'Guarding at the centre',
    body: [
      'Good day,',
      'My name is [Your name] from [Your firm], a PSIRA-registered security company here in Gqeberha. We look after [the kinds of sites you guard] in the area.',
      'I see the centre has guards on duty around the clock. When the contract next comes up for review, would you be open to receiving a quote from us?',
      'If not, no problem at all. Just let me know and I won’t contact you again.',
      'Kind regards,\n[Your name]',
    ],
  },
  {
    label: 'Lead 14 · Fit',
    channel: 'WhatsApp',
    business: 'Retirement village, two sites',
    contact: 'Named contact',
    angleLabel: 'Angle',
    angle: 'One provider for both sites',
    subject: null as string | null,
    body: [
      'Hi [Name], my name is [Your name] from [Your firm], a security company in Gqeberha.',
      'We look after [the kinds of sites you guard] and I think we could help with guarding across both of your villages, under one contract.',
      'Would you be open to me sending a short proposal? If not, no problem, I won’t message again.',
    ],
  },
];

export const openTenders = [
  { date: '30 Oct', time: '11:00', title: 'Total facilities management, Mandela Bay Theatre Complex, 3 years', ref: 'MBTC-SCM/T03/2026' },
  { date: '31 Oct', time: '16:00', title: 'Guarding service for a Gqeberha regional office, 24 months', ref: 'AMS/029/2026-2027' },
  { date: '3 Nov', time: '11:00', title: 'Physical security at NYDA centres, 12 months (re-advertised)', ref: 'RFP2026/07/NYDA' },
];

export const closedTenders = [
  { date: '22 Oct', title: 'Security at three Social Development offices, 3 months each', ref: 'RFQ.NMM-26/27-0048, 0049 and 0051' },
  { date: '19 Oct', title: 'Security guarding, Gqeberha', ref: 'AMS/031/2026-2027' },
  { date: '16 Oct', title: 'Security services, Port of Ngqura, 3 years 3 months', ref: 'TNPA/2026/09/0003/114821/RFP' },
  { date: '12 Oct', title: 'Physical security guarding, Port Elizabeth, 5 months', ref: 'RFQ VIC 10/2026' },
  { date: '15 Sep', title: 'Security, Enkuselweni Child and Youth Care Centre', ref: 'RFQ-26/27-NMM-0039(i)' },
  { date: '14 Sep', title: 'Security services, Sarah Baartman District Municipality', ref: 'Bid 23/2026' },
  { date: '1 Sep', title: 'Security at two Social Development sites', ref: 'RFQ-26/27-NMM-0043(i) and 0038(i)' },
];

export const todos = [
  { title: 'Renew the PSIRA letter of good standing', body: 'Before the 31 October closing date, so the regional office tender is still on the table.' },
  { title: 'Request a COIDA letter of good standing', body: 'Online with the Compensation Fund. We’ll check your returns are filed first.' },
  { title: 'Request a PSSPF letter of good standing', body: 'From the provident fund, once contributions are confirmed up to date.' },
  { title: 'Confirm the municipal account', body: 'Several metro tenders ask for proof that rates are paid up.' },
];

export const nextMonth = [
  { title: 'Follow-ups, on Growth', body: 'Part of the Growth plan. Follow-up is only for prospects who agreed to hear from you. Anyone who said no is never contacted again.' },
  { title: '20 new qualified prospects', body: 'Built on what worked this month, never repeating a business that said no.' },
  { title: 'New tenders', body: 'Matched, graded and added as they’re published, with closing dates.' },
  { title: 'Reminders', body: 'A heads-up before any certificate in your folder lapses.' },
];

export const sources = [
  'Business locations: Overture Maps Foundation places data, release 2026-09-23.1, and each business’s own public website, checked October 2026.',
  'Leads 1 to 5: Eastern Cape Industrial News (21 Oct 2026), Algoa FM (16 Oct and 12 Jun 2026), BusinessTech (21 Oct 2026), Engineering News (21 Apr 2026).',
  'Tenders: public tender notices and bulletins, checked 20 to 23 October 2026. Always confirm details in the official tender document.',
  'Compliance list: returnable documents in recent public security tenders, including Nelson Mandela Bay event security and provincial guarding tenders.',
];
