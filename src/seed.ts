import { config as dotenv } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// Must load .env BEFORE payload is imported - static imports are hoisted in ESM,
// so payload and config are loaded via dynamic import() below instead.
dotenv({ path: resolve(fileURLToPath(import.meta.url), '../../.env') })

const { getPayload } = await import('payload')
const { default: config } = await import('./payload.config.js')

// ─── helpers ──────────────────────────────────────────────────────────────────

function days(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const payload = await getPayload({ config: await config })

  console.log('🌱  Seeding database…')

  // ── Admin user ─────────────────────────────────────────────────────────────
  console.log('  → users')
  let adminUser
  try {
    adminUser = await payload.create({
      collection: 'users',
      data: { email: 'admin@ic-yec.org', password: 'Admin1234!' },
    })
    console.log('    created admin@ic-yec.org  (password: Admin1234!)')
  } catch {
    console.log('    admin user already exists, skipping')
    const res = await payload.find({ collection: 'users', where: { email: { equals: 'admin@ic-yec.org' } } })
    adminUser = res.docs[0]
  }

  // ── Partners ───────────────────────────────────────────────────────────────
  console.log('  → partners')
  const partnerNames = [
    { name: 'Erasmus+ National Agency Armenia', website: 'https://era.am', type: 'partner' },
    { name: 'Youth in Action Network', website: 'https://yia.eu', type: 'network' },
    { name: 'European Youth Forum', website: 'https://youthforum.org', type: 'network' },
    { name: 'Salto Youth Resource Centre', website: 'https://salto-youth.net', type: 'partner' },
    {
      name: 'Masterpeace',
      website: 'https://masterpeace.org',
      type: 'official-representative',
      representativeRole: 'Official Armenian Representative',
      description: 'IC-YEC is the official Armenian representative of Masterpeace - a global movement using the power of music and the arts to inspire people to connect across divides and build a more peaceful world.',
    },
  ]
  const partners = []
  for (const p of partnerNames) {
    try {
      const doc = await payload.create({ collection: 'partners', data: p as any })
      partners.push(doc)
    } catch { /* already exists */ }
  }
  console.log(`    ${partners.length} partners created`)

  // ── Team members ───────────────────────────────────────────────────────────
  console.log('  → team-members')
  const teamData = [
    { name: 'Mariam Hakobyan', role: 'Executive Director', bio: 'Over 10 years of experience in non-formal education and youth mobility programmes across Europe.', email: 'mariam@ic-yec.org', order: 1 },
    { name: 'Artur Petrosyan', role: 'Programme Manager', bio: 'Specialises in Erasmus+ KA1 and KA2 projects, coordinating exchanges between Armenia and EU partner countries.', email: 'artur@ic-yec.org', order: 2 },
    { name: 'Nare Sargsyan', role: 'Communications Officer', bio: 'Handles all digital outreach, social media, and visual identity for IC-YEC programmes.', email: 'nare@ic-yec.org', order: 3 },
    { name: 'David Grigoryan', role: 'Finance & Administration', bio: 'Manages project budgets and reporting in line with Erasmus+ financial guidelines.', email: 'david@ic-yec.org', order: 4 },
    { name: 'Anna Mkrtchyan', role: 'Volunteer Coordinator', bio: 'Responsible for ESC placements and volunteer support throughout their service period.', email: 'anna@ic-yec.org', order: 5 },
    { name: 'Varduhi Gevorgyan', role: 'Training Facilitator', bio: 'Designs and delivers non-formal education workshops focused on intercultural dialogue and active citizenship.', email: 'varduhi@ic-yec.org', order: 6 },
  ]
  for (const t of teamData) {
    try { await payload.create({ collection: 'team-members', data: t }) } catch { /* skip */ }
  }
  console.log(`    ${teamData.length} team members created`)

  // ── Projects ───────────────────────────────────────────────────────────────
  console.log('  → projects')
  const projectsData = [
    {
      title: 'Bridges of Art',
      slug: 'bridges-of-art',
      status: 'completed',
      fundingSource: 'erasmus-plus',
      category: 'art',
      startDate: '2023-04-01',
      endDate: '2023-10-31',
      countries: [{ country: 'Armenia' }, { country: 'Germany' }, { country: 'Poland' }],
      summary: 'A 10-day youth exchange exploring contemporary art as a tool for intercultural dialogue, bringing together 30 young people from 3 countries.',
    },
    {
      title: 'Digital Futures',
      slug: 'digital-futures',
      status: 'completed',
      fundingSource: 'erasmus-plus',
      category: 'digital',
      startDate: '2023-09-01',
      endDate: '2024-03-31',
      countries: [{ country: 'Armenia' }, { country: 'France' }, { country: 'Italy' }, { country: 'Spain' }],
      summary: 'A training course for youth workers on digital literacy and online facilitation methodologies, with 24 participants from 4 countries.',
    },
    {
      title: 'Green Minds in Action',
      slug: 'green-minds-in-action',
      status: 'ongoing',
      fundingSource: 'erasmus-plus',
      category: 'environment',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      countries: [{ country: 'Armenia' }, { country: 'Greece' }, { country: 'Netherlands' }],
      summary: 'Long-term project raising environmental awareness among youth through workshops, campaigns and a final international seminar.',
    },
    {
      title: 'Move Together',
      slug: 'move-together',
      status: 'ongoing',
      fundingSource: 'erasmus-plus',
      category: 'sport',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      countries: [{ country: 'Armenia' }, { country: 'Portugal' }, { country: 'Czechia' }],
      summary: 'Sport-based youth exchange promoting inclusion and teamwork through cooperative outdoor activities.',
    },
    {
      title: 'Voices for Inclusion',
      slug: 'voices-for-inclusion',
      status: 'upcoming',
      fundingSource: 'erasmus-plus',
      category: 'inclusion',
      startDate: '2025-09-01',
      endDate: '2026-08-31',
      countries: [{ country: 'Armenia' }, { country: 'Belgium' }, { country: 'Romania' }],
      summary: 'A strategic partnership focused on social inclusion methodologies for youth with fewer opportunities.',
    },
  ]
  const projects = []
  for (const p of projectsData) {
    try {
      const doc = await payload.create({ collection: 'projects', data: p as any })
      projects.push(doc)
    } catch { /* skip */ }
  }
  console.log(`    ${projects.length} projects created`)

  // ── Open Calls ─────────────────────────────────────────────────────────────
  console.log('  → open-calls')
  const openCallsData = [
    {
      // NOTE: formFields = EXTRA fields only. Core fields (Name, DOB, Email, Phone,
      // Country, Motivation Letter, CV, GDPR) are always rendered by RegistrationForm.
      title: 'Youth Exchange: Colours of Europe',
      slug: 'youth-exchange-colours-of-europe',
      type: 'youth-exchange',
      status: 'open',
      deadline: days(21),
      location: 'Yerevan, Armenia',
      dates: { from: '2025-08-10', to: '2025-08-20' },
      eligibility: { ageMin: 18, ageMax: 30, spotsAvailable: 5, countries: [{ country: 'Armenia' }, { country: 'Germany' }, { country: 'Poland' }] },
      summary: 'A 10-day international youth exchange exploring cultural identity through visual arts. Join 30 young people from 3 countries for workshops, exhibitions, and intercultural evenings.',
      registrationEnabled: true,
      formFields: [
        { blockType: 'selectField', label: 'T-shirt size', required: true, options: [
          { label: 'XS', value: 'xs' }, { label: 'S', value: 's' }, { label: 'M', value: 'm' },
          { label: 'L', value: 'l' }, { label: 'XL', value: 'xl' },
        ]},
      ],
    },
    {
      title: 'Training Course: Facilitation for Youth Workers',
      slug: 'training-facilitation-youth-workers',
      type: 'training-course',
      status: 'open',
      deadline: days(8),
      location: 'Dilijan, Armenia',
      dates: { from: '2025-07-14', to: '2025-07-21' },
      eligibility: { ageMin: 20, ageMax: 35, spotsAvailable: 3, countries: [{ country: 'Armenia' }, { country: 'France' }, { country: 'Italy' }] },
      summary: 'A 7-day residential training course for youth workers and educators who want to strengthen their facilitation skills using non-formal learning methods.',
      registrationEnabled: true,
      formFields: [
        { blockType: 'headingField', text: 'Professional Background', level: 'h3' },
        { blockType: 'numberField', label: 'Years of experience in youth work', required: true, min: 0, max: 40, unit: 'years' },
        { blockType: 'selectField', label: 'Current role', required: true, options: [
          { label: 'Youth Worker', value: 'youth-worker' },
          { label: 'Teacher / Educator', value: 'educator' },
          { label: 'Project Manager', value: 'project-manager' },
          { label: 'Volunteer', value: 'volunteer' },
          { label: 'Other', value: 'other' },
        ]},
        { blockType: 'textareaField', label: 'Describe one facilitation challenge you have faced', required: true, rows: 4 },
        { blockType: 'checkboxField', label: 'I confirm the information above is accurate', required: true },
      ],
    },
    {
      title: 'ESC Volunteering: Green Future Project',
      slug: 'esc-volunteering-green-future',
      type: 'esc-volunteering',
      status: 'open',
      deadline: days(45),
      location: 'Gyumri, Armenia',
      dates: { from: '2025-09-01', to: '2026-02-28' },
      eligibility: { ageMin: 18, ageMax: 30, spotsAvailable: 2, countries: [{ country: 'EU/EEA countries' }] },
      summary: '6-month ESC volunteering placement focused on environmental education and community gardening projects in Gyumri. Accommodation, travel and pocket money covered.',
      registrationEnabled: true,
      formFields: [
        { blockType: 'textareaField', label: 'Why ESC & why Armenia?', required: true, rows: 5 },
        { blockType: 'textareaField', label: 'Relevant experience with environmental / community work', required: false, rows: 4 },
        { blockType: 'urlField', label: 'LinkedIn profile (optional)', required: false },
      ],
    },
    {
      title: 'Seminar: Youth Policy in the South Caucasus',
      slug: 'seminar-youth-policy-south-caucasus',
      type: 'seminar',
      status: 'open',
      deadline: days(60),
      location: 'Tbilisi, Georgia',
      dates: { from: '2025-10-03', to: '2025-10-06' },
      eligibility: { ageMin: 20, ageMax: 35, spotsAvailable: 8, countries: [{ country: 'Armenia' }, { country: 'Georgia' }, { country: 'Azerbaijan' }] },
      summary: 'A regional seminar bringing together youth policy practitioners, NGO representatives and local authorities to explore youth participation mechanisms in the South Caucasus.',
      registrationEnabled: true,
      formFields: [
        { blockType: 'textField', label: 'Organisation / Institution', required: true },
        { blockType: 'radioField', label: 'I am participating as', required: true, options: [
          { label: 'NGO representative', value: 'ngo' },
          { label: 'Public institution representative', value: 'public' },
          { label: 'Independent researcher', value: 'researcher' },
          { label: 'Young person / activist', value: 'youth' },
        ]},
        { blockType: 'textareaField', label: 'What topic would you like to raise at the seminar?', required: false, rows: 3 },
      ],
    },
    {
      title: 'Youth Exchange: Sport & Inclusion Summit',
      slug: 'youth-exchange-sport-inclusion',
      type: 'youth-exchange',
      status: 'closed',
      deadline: days(-10),
      location: 'Vanadzor, Armenia',
      dates: { from: '2025-05-01', to: '2025-05-10' },
      eligibility: { ageMin: 18, ageMax: 28, spotsAvailable: 6, countries: [{ country: 'Armenia' }, { country: 'Portugal' }, { country: 'Czechia' }] },
      summary: 'A past youth exchange using sport and team activities to promote social inclusion - now closed for applications.',
      registrationEnabled: false,
      formFields: [],
    },
  ]

  const openCalls: any[] = []
  for (const oc of openCallsData) {
    try {
      const doc = await payload.create({ collection: 'open-calls', data: oc as any })
      openCalls.push(doc)
    } catch (e) {
      console.warn(`    ⚠ skipped "${oc.title}":`, String(e).split('\n')[0])
    }
  }
  console.log(`    ${openCalls.length} open calls created`)

  // ── Registrations ─────────────────────────────────────────────────────────
  if (openCalls.length === 0) {
    console.log('  → registrations  (skipped - no open calls)')
    console.log('\n✅  Seed complete.')
    process.exit(0)
  }

  console.log('  → registrations')
  const firstCall = openCalls[0]
  const secondCall = openCalls[1] ?? openCalls[0]

  const registrationsData = [
    {
      openCall: firstCall.id,
      applicantName: 'Sophie Müller',
      email: 'sophie.mueller@example.de',
      phone: '+49 151 23456789',
      country: 'Germany',
      dateOfBirth: '2000-03-15',
      motivationLetter: 'I have always been passionate about intercultural exchange and believe art is the most universal language. I am currently studying Fine Arts in Berlin and would love to share my perspective with peers from other countries.',
      status: 'pending',
      answers: [],
    },
    {
      openCall: firstCall.id,
      applicantName: 'Tigran Abrahamyan',
      email: 'tigran.ab@example.am',
      phone: '+374 55 123456',
      country: 'Armenia',
      dateOfBirth: '1999-07-22',
      motivationLetter: 'As a young designer from Yerevan I want to bring Armenian contemporary art to an international audience and learn from peers across Europe.',
      status: 'accepted',
      notes: 'Strong portfolio, local participant - confirmed by 2025-06-01.',
      answers: [],
    },
    {
      openCall: firstCall.id,
      applicantName: 'Katarzyna Nowak',
      email: 'k.nowak@example.pl',
      phone: '+48 500 234 567',
      country: 'Poland',
      dateOfBirth: '2001-11-30',
      motivationLetter: 'Participating in international exchanges has changed my life. I want to contribute my experience in street art and mural painting to this project.',
      status: 'reviewing',
      answers: [],
    },
    {
      openCall: firstCall.id,
      applicantName: 'Lucas Fernandes',
      email: 'lucas.f@example.pt',
      phone: '+351 912 345 678',
      country: 'Portugal',
      dateOfBirth: '1998-05-10',
      motivationLetter: 'I am a youth facilitator with 3 years of experience. I believe this exchange will help me grow both personally and professionally.',
      status: 'shortlisted',
      notes: 'Good application but country quota is full. On reserve list.',
      answers: [],
    },
    {
      openCall: firstCall.id,
      applicantName: 'Elena Popescu',
      email: 'e.popescu@example.ro',
      phone: '+40 721 987 654',
      country: 'Romania',
      dateOfBirth: '2002-08-03',
      motivationLetter: 'Art and culture are my passion. I would like to use this opportunity to explore how young people from different backgrounds express themselves.',
      status: 'rejected',
      notes: 'Age criterion not met for the partner sending organisation quota.',
      answers: [],
    },
    {
      openCall: secondCall.id,
      applicantName: 'Jean-Paul Dubois',
      email: 'jp.dubois@example.fr',
      phone: '+33 6 12 34 56 78',
      country: 'France',
      dateOfBirth: '1993-04-18',
      motivationLetter: 'I have been working as a youth worker for 5 years and want to improve my facilitation methods with a more structured theoretical background.',
      status: 'accepted',
      answers: [],
    },
    {
      openCall: secondCall.id,
      applicantName: 'Giulia Romano',
      email: 'giulia.romano@example.it',
      phone: '+39 333 456 7890',
      country: 'Italy',
      dateOfBirth: '1995-12-05',
      motivationLetter: 'I coordinate a local youth centre and constantly look for new facilitation tools that I can bring back to my community.',
      status: 'pending',
      answers: [],
    },
    {
      openCall: secondCall.id,
      applicantName: 'Ani Hovhannisyan',
      email: 'ani.h@example.am',
      phone: '+374 91 456789',
      country: 'Armenia',
      dateOfBirth: '1997-02-14',
      motivationLetter: 'Non-formal education changed my outlook. I want to share and improve what I have learned as a volunteer trainer in rural Armenia.',
      status: 'reviewing',
      answers: [],
    },
  ]

  let regCount = 0
  for (const r of registrationsData) {
    try {
      await payload.create({ collection: 'registrations', data: r as any })
      regCount++
    } catch (e) {
      console.warn(`    ⚠ skipped "${r.applicantName}":`, String(e).split('\n')[0])
    }
  }
  console.log(`    ${regCount} registrations created`)

  // ── Stories ───────────────────────────────────────────────────────────────
  console.log('  → stories')
  const storiesData = [
    {
      quote: 'The youth exchange changed my life completely. I came back with 30 new friends and a whole new perspective on what it means to be European.',
      author: 'Sophie Müller',
      age: 22,
      country: 'Germany',
      projectName: 'Bridges of Art 2023',
      featured: true,
      order: 1,
    },
    {
      quote: 'I was nervous about travelling alone, but IC-YEC made me feel safe and supported every step of the way. I\'d recommend it to any young person.',
      author: 'Tigran Abrahamyan',
      age: 24,
      country: 'Armenia',
      projectName: 'Bridges of Art 2023',
      featured: true,
      order: 2,
    },
    {
      quote: 'The training course gave me practical tools I still use every week in my youth centre. The non-formal methods were eye-opening.',
      author: 'Jean-Paul Dubois',
      age: 30,
      country: 'France',
      projectName: 'Training Course: Facilitation 2024',
      featured: true,
      order: 3,
    },
    {
      quote: 'As a volunteer in Gyumri I learned more about myself in 6 months than in 4 years of university. Truly transformative.',
      author: 'Anna Kowalski',
      age: 26,
      country: 'Poland',
      projectName: 'ESC Green Future 2024',
      featured: false,
      order: 4,
    },
    {
      quote: 'The Digital Futures course opened a whole new world for me. Now I run digital workshops for youth workers in my city.',
      author: 'Giulia Romano',
      age: 28,
      country: 'Italy',
      projectName: 'Digital Futures 2023',
      featured: true,
      order: 5,
    },
    {
      quote: 'Participating in the sport exchange showed me that language is no barrier when you play together. Sport truly unites.',
      author: 'Pedro Santos',
      age: 21,
      country: 'Portugal',
      projectName: 'Move Together 2024',
      featured: false,
      order: 6,
    },
  ]
  let storyCount = 0
  for (const s of storiesData) {
    try {
      await payload.create({ collection: 'stories' as any, data: s as any })
      storyCount++
    } catch (e) {
      console.warn(`    ⚠ skipped story by "${s.author}":`, String(e).split('\n')[0])
    }
  }
  console.log(`    ${storyCount} stories created`)

  // ── Newsletters ───────────────────────────────────────────────────────────
  console.log('  → newsletters')
  const newslettersData = [
    {
      title: 'IC-YEC Newsletter - Spring 2025',
      issueName: 'Spring 2025',
      publishedDate: '2025-04-01',
      preview: 'This spring we celebrated the launch of two new Erasmus+ projects - Voices for Inclusion and Move Together. We also welcomed 6 new ESC volunteers to Armenia and opened applications for our summer youth exchanges.',
      archiveUrl: 'https://example.com/newsletter/spring-2025',
      published: true,
    },
    {
      title: 'IC-YEC Newsletter - Winter 2024',
      issueName: 'Winter 2024',
      publishedDate: '2024-12-15',
      preview: 'A year-end recap of all IC-YEC activities: 3 completed projects, 120+ participants, 12 countries involved. Plus: highlights from the Digital Futures training course in October.',
      archiveUrl: 'https://example.com/newsletter/winter-2024',
      published: true,
    },
    {
      title: 'IC-YEC Newsletter - Autumn 2024',
      issueName: 'Autumn 2024',
      publishedDate: '2024-10-01',
      preview: 'The Green Minds in Action project is in full swing with workshops in all three partner countries. We also announce new open calls for spring 2025 - don\'t miss the early application deadline.',
      archiveUrl: 'https://example.com/newsletter/autumn-2024',
      published: true,
    },
  ]
  let nlCount = 0
  for (const n of newslettersData) {
    try {
      await payload.create({ collection: 'newsletters' as any, data: n as any })
      nlCount++
    } catch (e) {
      console.warn(`    ⚠ skipped newsletter "${n.title}":`, String(e).split('\n')[0])
    }
  }
  console.log(`    ${nlCount} newsletters created`)

  // ── Site Settings ─────────────────────────────────────────────────────────
  console.log('  → site-settings global')
  try {
    await (payload.updateGlobal as any)({
      slug: 'site-settings',
      data: {
        timeline: {
          enabled: true,
          title: 'What happens after you apply',
          steps: [
            { icon: '📝', title: 'Submit your application', description: 'Fill in the online form and send your application before the deadline.', duration: 'Day 1' },
            { icon: '🔍', title: 'Review process', description: 'Our team reads every application carefully and evaluates based on motivation, eligibility and country balance.', duration: '~2 weeks' },
            { icon: '✉️', title: 'Decision email', description: 'You receive an acceptance, waitlist or rejection email with clear next steps.', duration: 'Week 3' },
            { icon: '✈️', title: 'Travel & preparation', description: 'Accepted participants receive a full info pack, travel grant details and pre-departure contact.', duration: '2–4 weeks before' },
            { icon: '🎓', title: 'Participate & grow', description: 'Attend the activity, connect with peers from across Europe, and return home with new skills and friendships.', duration: 'Activity days' },
          ],
        },
        erasmusExplainer: {
          enabled: true,
          title: 'New to Erasmus+?',
          subtitle: 'Erasmus+ is the EU\'s flagship programme for education, training, youth and sport. Here are the most common questions we get.',
          items: [
            { question: 'Is Erasmus+ only for students?', answer: 'No! While many people associate it with university exchanges, Erasmus+ also funds youth exchanges, volunteering (ESC), training courses, and seminars for anyone aged 13–30 (or youth workers up to any age).' },
            { question: 'Does it cost anything to participate?', answer: 'For most activities, costs like travel, accommodation and food are fully covered by the project grant. You may need a valid passport and travel insurance, which are usually also covered.' },
            { question: 'Do I need to speak a foreign language?', answer: 'The working language is typically English, but you don\'t need to be fluent - projects are designed to be inclusive and non-formal. The experience itself will improve your language skills!' },
            { question: 'Who can apply?', answer: 'Young people aged 18–30 residing in Armenia or one of the partner countries listed for each specific project. Youth workers can be older. Check each open call for exact eligibility criteria.' },
          ],
        },
        partnerPortal: {
          enabled: true,
          title: 'Partner with IC-YEC',
          subtitle: 'We collaborate with NGOs, youth centres, schools, and public institutions from across Europe and the South Caucasus. Together we design and implement impactful Erasmus+ projects.',
          contactEmail: 'partnerships@ic-yec.org',
          types: [
            { icon: '🤝', title: 'Sending Partner', description: 'Your organisation sends participants to IC-YEC hosted activities in Armenia. Ideal for NGOs and youth centres in EU/EEA countries.' },
            { icon: '🌐', title: 'Hosting Partner', description: 'IC-YEC co-hosts an activity at your location abroad. We bring Armenian participants and share coordination responsibilities.' },
            { icon: '📋', title: 'Strategic Partner', description: 'Long-term KA2 partnership for developing joint methodologies, tools, and resources in non-formal education.' },
            { icon: '🎗️', title: 'Associate Partner', description: 'Support IC-YEC\'s mission through in-kind contributions, network sharing, or co-branding without full project responsibility.' },
          ],
          requirements: [
            { item: 'Valid NGO or legal entity registration in your country' },
            { item: 'Experience working with young people or in non-formal education' },
            { item: 'Designated contact person for project communication' },
            { item: 'Commitment to Erasmus+ values: inclusion, non-discrimination, active citizenship' },
          ],
        },
        newsletter: {
          enabled: true,
          title: 'Stay in the loop',
          subtitle: 'Get updates on new open calls, project news, and opportunities for young people - straight to your inbox. No spam, unsubscribe anytime.',
          buttonLabel: 'Subscribe',
          showArchive: true,
        },
        badgeSettings: {
          urgentDaysThreshold: 7,
          showLiveBadge: true,
        },
      },
    })
    console.log('    site-settings seeded')
  } catch (e) {
    console.warn('    ⚠ site-settings seed failed:', String(e).split('\n')[0])
  }

  console.log('\n✅  Seed complete.')
  console.log('   Admin login: admin@ic-yec.org / Admin1234!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
