import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'

const AVATAR_COLORS = ['#3D3785', '#4F9A5E', '#D97706', '#0891B2', '#7C3AED']
function avatarColor(name: string) {
  const code = (name.charCodeAt(0) ?? 0) + (name.charCodeAt(1) ?? 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

// ── Fallback static content ───────────────────────────────────────────────────

const DEFAULT_TIMELINE = [
  { year: '2018', label: 'Founded',       desc: 'IC-YEC established in Yerevan with a focus on Erasmus+ youth exchanges.' },
  { year: '2019', label: 'First projects', desc: 'Launched our first cross-border youth projects in Armenia and Georgia.' },
  { year: '2020', label: 'Adapting',       desc: 'Pivoted to online non-formal education during the global pandemic.' },
  { year: '2021', label: 'Accreditation',  desc: 'Received Erasmus+ accreditation, unlocking long-term programme access.' },
  { year: '2022', label: 'Growing',        desc: 'Expanded partnerships to 15+ European countries; first ESC volunteering project.' },
  { year: '2023', label: 'Masterpeace',    desc: 'Became the official representative of Masterpeace in Armenia.' },
  { year: '2024', label: 'Impact',         desc: '500+ young participants reached across art, sport, digital, and inclusion themes.' },
]

const DEFAULT_PAGE_STATS = [
  { value: '500+', label: 'Young people reached',  icon: '👥', sub: 'across all projects' },
  { value: '20+',  label: 'Partner countries',     icon: '🌍', sub: 'in Europe & South Caucasus' },
  { value: '15+',  label: 'Projects delivered',    icon: '📋', sub: 'youth exchanges, trainings & ESC' },
  { value: '6',    label: 'Core themes',            icon: '🎯', sub: 'art, sport, digital & more' },
  { value: '7+',   label: 'Years active',          icon: '🏅', sub: 'continuous operations since 2018' },
  { value: '2018', label: 'Founded in Yerevan',    icon: '📅', sub: 'operating continuously since' },
]

const DEFAULT_HOW_WE_WORK = [
  { step: '01', title: 'Identify needs',      desc: 'We listen to youth workers, community leaders, and young people to find where non-formal education can have the most impact.' },
  { step: '02', title: 'Build partnerships',  desc: 'Every project connects organisations from multiple countries. We curate partnerships where each side brings unique expertise and perspective.' },
  { step: '03', title: 'Design for learning', desc: 'Our activities are grounded in non-formal education methodology — experiential, participatory, and focused on transferable competences.' },
  { step: '04', title: 'Deliver & document',  desc: 'We run intensive residential programmes and follow up with tools that participants can take home and apply in their own communities.' },
]

const DEFAULT_FOCUS_AREAS = [
  { icon: '🎨', label: 'Art & Culture',          desc: 'Visual art, street art, theatre, and creative storytelling as vehicles for self-expression and intercultural dialogue.' },
  { icon: '⚽', label: 'Sport & Inclusion',       desc: 'Sport as a universal language — building teamwork, respect, and resilience while breaking down social barriers.' },
  { icon: '🧠', label: 'Emotional Intelligence',  desc: 'Workshops on empathy, self-awareness, conflict resolution, and mental health literacy for young people and youth workers.' },
  { icon: '💻', label: 'Digital Skills',          desc: 'Digital literacy, online safety, creative media, and tools that empower youth in a fast-changing world.' },
  { icon: '🌿', label: 'Environment',             desc: 'Eco-activism, climate education, and sustainable living as part of responsible European citizenship.' },
  { icon: '🤝', label: 'Social Inclusion',        desc: 'Projects that amplify marginalised voices and build bridges between communities with different backgrounds.' },
]

const HERO_STATS = [
  { value: '2018', label: 'Est.' },
  { value: '20+',  label: 'Countries' },
  { value: '500+', label: 'Participants' },
  { value: '15+',  label: 'Projects' },
  { value: '100%', label: 'Free' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const payload = await getPayloadClient()

  const [teamResult, affiliationsResult, partnersResult, settingsResult] = await Promise.all([
    payload.getCachedCollection<'team-members'>({ collection: 'team-members', limit: 20, sort: 'order', depth: 1 }).catch(() => ({ docs: [] as any[] })),
    payload.getCachedCollection<'partners'>({ collection: 'partners', where: { type: { equals: 'official-representative' } }, limit: 10, depth: 1 }).catch(() => ({ docs: [] as any[] })),
    payload.getCachedCollection<'partners'>({ collection: 'partners', where: { type: { in: ['partner', 'funder', 'network'] } }, limit: 20, depth: 1 }).catch(() => ({ docs: [] as any[] })),
    payload.getCachedGlobal({ slug: 'site-settings' as any }).catch(() => null),
  ])

  const team         = teamResult.docs
  const affiliations = affiliationsResult.docs
  const partners     = partnersResult.docs
  const s            = settingsResult as any
  const ap           = s?.aboutPage ?? {}

  // Resolve values with fallbacks
  const heroTitle      = ap.heroTitle    || 'International Center for Youth Empowerment Cooperation'
  const heroSubtitle   = ap.heroSubtitle || 'We are an Armenian youth NGO dedicated to creating spaces where young people from different countries meet, learn from each other, and return home with the skills and motivation to drive change in their own communities.'
  const storyHeading   = ap.storyHeading   || 'From a small team in Yerevan to a European network'
  const storyP1        = ap.storyParagraph1 || 'IC-YEC was founded in 2018 by a group of young Armenians who had participated in Erasmus+ exchanges and came back with a conviction: that non-formal learning across borders is one of the most powerful tools for personal growth that exists. They wanted to make that experience available to more young people in Armenia — and to put Armenian youth on the European map.'
  const storyP2        = ap.storyParagraph2 || 'Over the following years we built a network of partner organisations across Europe and the South Caucasus, obtained Erasmus+ accreditation, and ran projects on themes ranging from street art and graphic facilitation to sport inclusion and digital literacy. Each project brought together young people who would never otherwise have met, and sent them home with new friends, new skills, and a wider sense of what is possible.'
  const missionBody    = ap.missionBody  || 'To support the personal development of young people through high-quality non-formal education programmes that transcend borders and build European citizenship.'
  const visionBody     = ap.visionBody   || 'A Europe where every young person has access to transformative learning experiences regardless of their background, geography, or financial situation.'
  const valuesBody     = ap.valuesBody   || 'Inclusivity · Empathy · Collaboration · Curiosity · Respect for diversity and the environment.'
  const erasmusTitle   = ap.erasmusTitle || 'Erasmus+ — what it means for participants'
  const erasmusBody    = ap.erasmusBody  || 'IC-YEC is an active Erasmus+ partner organisation. All of our youth exchanges and training courses are co-funded through Erasmus+ project grants, which means participation costs are fully covered for selected participants — travel, accommodation, meals, and programme activities. No financial barrier should stand between a young person and a life-changing experience.'
  const ctaHeading     = ap.ctaHeading   || 'Get involved with IC-YEC'
  const ctaBody        = ap.ctaBody      || 'Whether you\'re a young person looking to join a project, an organisation wanting to partner with us, or someone who believes in our work — there\'s a place for you here.'
  const timeline       = ap.timeline?.length       ? ap.timeline       : DEFAULT_TIMELINE
  const pageStats      = ap.pageStats?.length      ? ap.pageStats      : DEFAULT_PAGE_STATS
  const howWeWork      = ap.howWeWork?.length      ? ap.howWeWork      : DEFAULT_HOW_WE_WORK
  const focusAreas          = ap.focusAreas?.length ? ap.focusAreas : DEFAULT_FOCUS_AREAS
  const showPartnersSection = ap.showPartnersSection === true

  const missionCards = [
    { icon: '🎯', heading: 'Mission', body: missionBody, bg: 'var(--color-tint)', accent: 'var(--color-primary)' },
    { icon: '👁️', heading: 'Vision',  body: visionBody,  bg: '#EAF3DE', accent: '#3B6D11' },
    { icon: '💛', heading: 'Values',  body: valuesBody,  bg: '#FEF3C7', accent: '#92400E' },
  ]

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.07)', top: -180, right: -80 }} />
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.05)', bottom: -120, left: -40 }} />
        </div>
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>·</span>
            About
          </p>
          <div style={{ maxWidth: 680 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 100,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 20,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
              Youth NGO · Yerevan, Armenia · Est. 2018
            </span>
            <h1 style={{ color: 'white', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
              {heroTitle}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.75, marginBottom: 36, maxWidth: 560 }}>
              {heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {HERO_STATS.map(({ value, label }) => (
                <div key={label} style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.14)',
                }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{value}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Our Story ──────────────────────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div className="col-2-start">
            <div>
              <div className="section-header__label" style={{ marginBottom: 12 }}>Our story</div>
              <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.25, marginBottom: 24, color: 'var(--color-text)' }}>
                {storyHeading}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: 18 }}>{storyP1}</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: 18 }}>{storyP2}</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                Today IC-YEC is also the official representative of{' '}
                <a href="https://masterpeace.org" target="_blank" rel="noopener noreferrer"
                   style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                  Masterpeace
                </a>{' '}
                in Armenia — a global NGO using art and sport to build a culture of peace.
                It is a partnership that reflects everything we believe in.
              </p>
            </div>

            {/* Timeline */}
            <div style={{ paddingTop: 8 }}>
              {timeline.map((item: any, i: number) => (
                <div key={item.year} style={{ display: 'flex', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>{String(item.year).slice(2)}</span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 28, background: 'var(--color-border)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 24 : 0, paddingTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{item.year}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>— {item.label}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision / Values ──────────────────────────────────────── */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-header__label">What drives us</div>
              <h2 className="section-header__title">Mission, Vision & Values</h2>
            </div>
          </div>
          <div className="grid-3">
            {missionCards.map((card) => (
              <div key={card.heading} style={{
                background: card.bg, borderRadius: 'var(--radius-lg)',
                padding: '32px 28px', border: '1px solid rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: card.accent, marginBottom: 12 }}>{card.heading}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.75 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact band ────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-primary)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>By the numbers</div>
            <h2 style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>Our impact since 2018</h2>
          </div>
          <div className="grid-stats">
            {pageStats.map((stat: any) => (
              <div key={stat.label} style={{
                padding: '36px 28px', background: 'rgba(255,255,255,0.06)', textAlign: 'center',
              }}>
                {stat.icon && <div style={{ fontSize: 32, marginBottom: 10 }}>{stat.icon}</div>}
                <div style={{ fontSize: 40, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{stat.label}</div>
                {stat.sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{stat.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we work ────────────────────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <div>
              <div className="section-header__label">Our approach</div>
              <h2 className="section-header__title">How we work</h2>
            </div>
          </div>
          <div className="grid-4">
            {howWeWork.map((item: any) => (
              <div key={item.step}>
                <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: 'var(--color-tint-mid)', marginBottom: 16 }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'var(--color-text)' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus areas ────────────────────────────────────────────────────── */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 36 }}>
            <div>
              <div className="section-header__label">Our programmes</div>
              <h2 className="section-header__title">What we work on</h2>
            </div>
          </div>
          <div className="grid-3" style={{ gap: 16 }}>
            {focusAreas.map((area: any) => (
              <div key={area.label} style={{
                background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px',
                border: '1px solid var(--color-border)', display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                {area.icon && <span style={{ fontSize: 30, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{area.icon}</span>}
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>{area.label}</h4>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Erasmus+ callout ────────────────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div className="col-text-aside" style={{
            background: 'linear-gradient(135deg, #003399 0%, #0055cc 100%)',
            borderRadius: 'var(--radius-lg)', padding: '48px 56px',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 100,
                background: 'rgba(255,255,255,0.15)',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
              }}>
                🇪🇺 Erasmus+ Partner Organisation
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 14, lineHeight: 1.3 }}>
                {erasmusTitle}
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, maxWidth: 560 }}>
                {erasmusBody}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              {[
                { icon: '✈️', label: 'Travel covered' },
                { icon: '🏠', label: 'Accommodation included' },
                { icon: '🍽️', label: 'Meals provided' },
                { icon: '📜', label: 'Youthpass certificate' },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', background: 'rgba(255,255,255,0.12)',
                  borderRadius: 8, fontSize: 13, color: 'white', fontWeight: 500,
                }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Official Representation ───────────────────────────────────────── */}
      {affiliations.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div>
                <div className="section-header__label">Affiliations</div>
                <h2 className="section-header__title">Official representation</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
              {affiliations.map((aff: any) => {
                const logoUrl: string | null = aff.logo?.url ?? null
                return (
                  <div key={aff.id} style={{
                    display: 'flex', gap: 28, alignItems: 'center',
                    background: 'white', borderRadius: 'var(--radius-lg)',
                    padding: '28px 32px', border: '1.5px solid var(--color-border)',
                  }}>
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={aff.name} style={{ width: 72, height: 72, objectFit: 'contain', flexShrink: 0, borderRadius: 8 }} />
                    ) : (
                      <div style={{ fontSize: 48, flexShrink: 0, lineHeight: 1 }}>🌍</div>
                    )}
                    <div>
                      {aff.representativeRole && (
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', marginBottom: 8 }}>
                          {aff.representativeRole}
                        </div>
                      )}
                      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: 'var(--color-text)' }}>
                        {aff.website ? (
                          <a href={aff.website} target="_blank" rel="noopener noreferrer"
                             style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                            {aff.name}
                          </a>
                        ) : aff.name}
                      </h3>
                      {aff.description && (
                        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: aff.website ? 14 : 0 }}>
                          {aff.description}
                        </p>
                      )}
                      {aff.website && (
                        <a href={aff.website} target="_blank" rel="noopener noreferrer"
                           style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
                          Visit {new URL(aff.website).hostname} ↗
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Partners ──────────────────────────────────────────────────────── */}
      {showPartnersSection && partners.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div className="section-header" style={{ marginBottom: 32 }}>
              <div>
                <div className="section-header__label">Network</div>
                <h2 className="section-header__title">Our partners</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {partners.map((p: any) => {
                const logoUrl: string | null = p.logo?.url ?? null
                return (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', background: 'var(--color-tint)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexShrink: 0,
                  }}>
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={p.name} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} />
                    ) : (
                      <span style={{ fontSize: 22 }}>🤝</span>
                    )}
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                      {p.website ? (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {p.name}
                        </a>
                      ) : p.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section id="team" className="section section--tint">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 36 }}>
            <div>
              <div className="section-header__label">The people</div>
              <h2 className="section-header__title">Meet our team</h2>
            </div>
          </div>
          {team.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Team profiles coming soon.</p>
          ) : (
            <div className="grid-3">
              {team.map((member: any) => {
                const initials = member.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
                const color = avatarColor(member.name)
                const photoUrl: string | null = member.photo?.url ?? null
                return (
                  <div key={member.id} className="card" style={{ padding: '28px 24px 20px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
                      overflow: 'hidden', flexShrink: 0,
                      ...(photoUrl ? {} : {
                        background: color + '22', border: `2px solid ${color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }),
                    }}>
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <span style={{ fontSize: 24, color, fontWeight: 600 }}>{initials}</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{member.name}</h3>
                    {member.role && (
                      <p style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{member.role}</p>
                    )}
                    {member.bio && (
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: 14 }}>{member.bio}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 'auto' }}>
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ fontSize: 18, color: 'var(--color-text-muted)' }} title="Send email">✉️</a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                           style={{ fontSize: 18, color: 'var(--color-text-muted)' }} title="LinkedIn">🔗</a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="cta-grid" style={{
            background: 'var(--color-tint)', borderRadius: 'var(--radius-lg)',
            padding: '48px 40px', border: '1px solid var(--color-border)',
          }}>
            <div>
              <div className="section-header__label" style={{ marginBottom: 12 }}>Join us</div>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)', lineHeight: 1.3 }}>
                {ctaHeading}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{ctaBody}</p>
            </div>
            {[
              { icon: '🚀', title: 'Apply for a project', desc: 'Check our open calls and apply for a youth exchange, training course, or volunteering opportunity.', href: '/open-calls', label: 'View open calls →', bg: 'var(--color-primary)' },
              { icon: '🤝', title: 'Partner with us',     desc: 'We are always looking for organisations in Europe and beyond who share our values and want to co-create projects.', href: '/partner', label: 'Become a partner →', bg: '#3B6D11' },
            ].map(({ icon, title, desc, href, label, bg }) => (
              <div key={title} style={{
                background: 'white', borderRadius: 'var(--radius-md)', padding: '28px 24px',
                border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column',
              }}>
                <span style={{ fontSize: 32, marginBottom: 14 }}>{icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'var(--color-text)' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{desc}</p>
                <Link href={href} style={{
                  display: 'inline-flex', alignItems: 'center', padding: '10px 18px',
                  background: bg, color: 'white', borderRadius: 8,
                  fontWeight: 500, fontSize: 13, textDecoration: 'none', width: 'fit-content',
                }}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
