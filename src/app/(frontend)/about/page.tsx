import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'

// Avatar colors cycle by first two initials
const AVATAR_COLORS = ['#3D3785', '#4F9A5E', '#D97706', '#0891B2', '#7C3AED']
function avatarColor(name: string) {
  const code = (name.charCodeAt(0) ?? 0) + (name.charCodeAt(1) ?? 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

const MISSION_CARDS = [
  {
    icon: '🎯',
    heading: 'Mission',
    body: 'To support the personal development of young people through high-quality non-formal education programmes that transcend borders and build European citizenship.',
    bg: 'var(--color-tint)',
    accent: 'var(--color-primary)',
  },
  {
    icon: '👁️',
    heading: 'Vision',
    body: 'A Europe where every young person has access to transformative learning experiences regardless of their background, geography, or financial situation.',
    bg: '#EAF3DE',
    accent: '#3B6D11',
  },
  {
    icon: '💛',
    heading: 'Values',
    body: 'Inclusivity · Empathy · Collaboration · Curiosity · Respect for diversity and the environment.',
    bg: '#FEF3C7',
    accent: '#92400E',
  },
]

const ACTIVITIES = [
  { icon: '🎨', label: 'Art & Culture',           desc: 'Creative expression through visual art, theatre, and multimedia storytelling.', bg: 'var(--color-tint)' },
  { icon: '🏃', label: 'Sport & Inclusion',        desc: 'Using sport as a tool for social inclusion and cross-cultural dialogue.',       bg: '#EAF3DE' },
  { icon: '🧠', label: 'Emotional Intelligence',   desc: 'Workshops on empathy, self-awareness, conflict resolution, and resilience.',     bg: '#FEF3C7' },
  { icon: '💻', label: 'Training & Digital',       desc: 'Upskilling youth workers and young people in digital literacy and facilitation.', bg: '#E6F1FB' },
]

export default async function AboutPage() {
  const payload = await getPayloadClient()

  const [teamResult, affiliationsResult] = await Promise.all([
    payload.getCachedCollection<'team-members'>({ collection: 'team-members', limit: 20, sort: 'order', depth: 1 }).catch(() => ({ docs: [] })),
    payload.getCachedCollection<'partners'>({ collection: 'partners', where: { type: { equals: 'official-representative' } }, limit: 10, depth: 1 }).catch(() => ({ docs: [] })),
  ])

  const team = teamResult.docs
  const affiliations = affiliationsResult.docs

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / About
          </p>
          <h1 style={{ color: 'white', fontSize: 36, fontWeight: 500 }}>About IC-YEC</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 15, maxWidth: 560 }}>
            International Center for Youth Empowerment Cooperation — bringing young people
            together through non-formal education since 2015.
          </p>
        </div>
      </div>

      {/* ── Mission / Vision / Values ──────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-header__label">Who we are</div>
              <h2 className="section-header__title">Our organisation</h2>
            </div>
          </div>
          <div className="grid-3">
            {MISSION_CARDS.map((card) => (
              <div key={card.heading} style={{
                background: card.bg,
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: card.accent, marginBottom: 10 }}>{card.heading}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we do ────────────────────────────────────────────────────── */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-header__label">Our programmes</div>
              <h2 className="section-header__title">What we do</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {ACTIVITIES.map((act) => (
              <div key={act.label} style={{
                background: act.bg,
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{act.icon}</span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{act.label}</h4>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Representation ───────────────────────────────────────── */}
      {affiliations.length > 0 && (
        <section className="section section--white" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div>
                <div className="section-header__label">Affiliations</div>
                <h2 className="section-header__title">Official representation</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
              {affiliations.map((aff: any) => {
                const logoUrl: string | null = aff.logo?.url ?? null
                return (
                  <div key={aff.id} style={{
                    display: 'flex', gap: 28, alignItems: 'center',
                    background: 'var(--color-tint)', borderRadius: 'var(--radius-lg)',
                    padding: '28px 32px',
                    border: '1.5px solid var(--color-border)',
                  }}>
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={aff.name} style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0, borderRadius: 8 }} />
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
                        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: aff.website ? 14 : 0 }}>
                          {aff.description}
                        </p>
                      )}
                      {aff.website && (
                        <a href={aff.website} target="_blank" rel="noopener noreferrer"
                           style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section id="team" className="section section--white">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-header__label">The people</div>
              <h2 className="section-header__title">Our Team</h2>
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
                      width: 80, height: 80, borderRadius: '50%',
                      margin: '0 auto 14px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      ...(photoUrl ? {} : {
                        background: color + '22',
                        border: `2px solid ${color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }),
                    }}>
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoUrl}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <span style={{ fontSize: 22, color, fontWeight: 500 }}>{initials}</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 16, marginBottom: 3 }}>{member.name}</h3>
                    {member.role && (
                      <p style={{ fontSize: 12, fontWeight: 500, color, marginBottom: 8 }}>{member.role}</p>
                    )}
                    {member.bio && (
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{member.bio}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 'auto' }}>
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ fontSize: 18, color: 'var(--color-text-muted)', transition: 'color 0.15s' }}
                           title="Send email">✉️</a>
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

    </>
  )
}
