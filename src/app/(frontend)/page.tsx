import { getPayload } from 'payload'
import Link from 'next/link'
import config from '@/payload.config'
import type { Project, OpenCall } from '@/payload-types'
import { getLocale, localStr } from '@/lib/locale'
import { ParticipantStories } from '@/components/stories/ParticipantStories'
import { ApplicationTimeline } from '@/components/home/ApplicationTimeline'
import { ErasmusExplainer } from '@/components/home/ErasmusExplainer'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { FeaturedCallSlider } from '@/components/open-calls/FeaturedCallSlider'
import { HomeMapClient as HomeMap } from '@/components/home/HomeMapClient'

// ── helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    'youth-exchange': 'Youth Exchange',
    'training-course': 'Training Course',
    'esc-volunteering': 'ESC Volunteering',
    'seminar': 'Seminar',
    'other': 'Other',
  }
  return map[type] ?? type
}

// ── Hero ─────────────────────────────────────────────────────────────────────

interface HeroCall {
  id: string
  title: string
  slug: string
  type: string
  location?: string | null
  deadline: string
  dateRange?: string | null
  ageMin?: number | null
  ageMax?: number | null
  spots?: number | null
}

function Hero({ projectCount, featuredCalls }: { projectCount: number; featuredCalls: HeroCall[] }) {
  const hasCalls = featuredCalls.length > 0
  return (
    <section style={{
      background: 'var(--color-primary)',
      position: 'relative',
      overflow: 'hidden',
      padding: hasCalls ? '72px 0 72px' : '96px 0 80px',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.08)', top: -160, right: -80 }} />
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.06)', bottom: -120, left: -60 }} />
      </div>

      <div className="container" style={{ position: 'relative' }}>
        {hasCalls ? (
          /* 2-column split: text left, card right */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 56,
            alignItems: 'center',
          }}>
            {/* Left: headline + CTAs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.12)',
                  fontSize: 11, fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                  Youth NGO · Armenia · Since 2018
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 4.5vw, 58px)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.12,
                marginBottom: 20,
                maxWidth: 560,
              }}>
                Empowering youth{' '}
                <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>across</span>{' '}
                borders
              </h1>

              <p style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.65,
                marginBottom: 36,
                maxWidth: 460,
              }}>
                Art, sport, digital skills, intercultural dialogue —
                we design and run projects that create real change
                for young people in Armenia and across Europe.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/open-calls"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px',
                    background: 'white',
                    color: 'var(--color-primary)',
                    borderRadius: 10, fontWeight: 700,
                    textDecoration: 'none', fontSize: 15,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  View open calls →
                </Link>
                <Link
                  href="/projects"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px',
                    background: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    borderRadius: 10, fontWeight: 500,
                    textDecoration: 'none', fontSize: 15,
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Our projects
                </Link>
              </div>

              {/* Pill stats — below buttons */}
              <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { n: projectCount, label: 'Projects' },
                  { n: '20+', label: 'Partner countries' },
                  { n: '2018', label: 'Founded' },
                ].map(({ n, label }) => (
                  <div key={label} style={{
                    padding: '6px 16px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 100,
                    display: 'flex', gap: 6, alignItems: 'baseline',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{n}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: featured call slider */}
            <FeaturedCallSlider calls={featuredCalls} />
          </div>
        ) : (
          /* Fallback: full-width centered (no open calls) */
          <div style={{ textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 14px', borderRadius: 100,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 24,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
              Youth NGO · Armenia · Since 2018
            </span>
            <h1 style={{
              fontSize: 'clamp(38px, 5vw, 60px)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.15,
              maxWidth: 780,
              margin: '0 auto 20px',
            }}>
              Empowering youth{' '}
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>across</span>{' '}
              borders
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Art, sport, digital skills, intercultural dialogue — we design and run
              projects that create real change for young people in Armenia and across Europe.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/projects" className="btn btn-outline-white">Our Projects</Link>
              <Link href="/open-calls" className="btn btn-primary" style={{ boxShadow: '0 4px 20px rgba(232,160,160,0.35)' }}>
                Open Calls →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, showLiveBadge }: {
  project: Project
  showLiveBadge: boolean
}) {
  const title = typeof project.title === 'string' ? project.title : (project.title as any)?.en ?? 'Untitled'
  const summary = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.en ?? ''
  const status = project.status ?? 'upcoming'
  const isLive = status === 'ongoing'

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        <div className="card__img" style={{ background: 'var(--color-tint-mid)', position: 'relative' }}>
          {isLive && showLiveBadge && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <LiveBadge variant="live" />
            </div>
          )}
        </div>
        <div className="card__body">
          <div className="card__meta">
            <span className="badge badge--purple" style={{ textTransform: 'capitalize' }}>{status}</span>
            {project.fundingSource && (
              <span className="badge badge--purple">{project.fundingSource}</span>
            )}
          </div>
          <h3 className="card__title">{title}</h3>
          {summary && <p className="card__desc">{summary.slice(0, 120)}{summary.length > 120 ? '…' : ''}</p>}
          <span className="card__link">Learn more →</span>
        </div>
      </div>
    </Link>
  )
}

// ── Open call row ─────────────────────────────────────────────────────────────

function OpenCallRow({ call, urgentDays }: { call: OpenCall; urgentDays: number }) {
  const title = typeof call.title === 'string' ? call.title : (call.title as any)?.en ?? 'Untitled'
  const deadline = call.deadline as string
  const days = daysUntil(deadline)
  const isUrgent = days > 0 && days <= urgentDays

  return (
    <Link href={`/open-calls/${call.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 24px',
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.18s, transform 0.18s',
        marginBottom: 12,
      }}>
        <span className="badge badge--purple" style={{ flexShrink: 0 }}>
          {typeLabel(call.type ?? 'other')}
        </span>

        <span style={{ flex: 1, fontWeight: 500, fontSize: 15, color: 'var(--color-text)' }}>
          {title}
        </span>

        {isUrgent && (
          <LiveBadge variant="urgent" label={`${days}d left`} />
        )}

        {call.location && (
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', flexShrink: 0 }}>
            {typeof call.location === 'string' ? call.location : (call.location as any)?.en}
          </span>
        )}

        <span style={{ fontSize: 13, color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {formatDate(deadline)}
        </span>

        <span style={{ color: 'var(--color-primary)', fontSize: 18, flexShrink: 0 }}>→</span>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const locale = await getLocale()
  const payload = await getPayload({ config: await config })

  const [projectsResult, openCallsResult, storiesResult, newslettersResult, settings] =
    await Promise.all([
      payload.find({
        collection: 'projects',
        limit: 3,
        where: { status: { in: ['ongoing', 'upcoming'] } },
        sort: '-createdAt',
      }).catch(() => ({ docs: [] as Project[] })),

      payload.find({
        collection: 'open-calls',
        limit: 5,
        where: { status: { equals: 'open' } },
        sort: 'deadline',
      }).catch(() => ({ docs: [] as OpenCall[] })),

      (payload.find as any)({
        collection: 'stories',
        where: { featured: { equals: true } },
        sort: 'order',
        limit: 8,
        locale,
      }).catch(() => ({ docs: [] })),

      (payload.find as any)({
        collection: 'newsletters',
        where: { published: { equals: true } },
        sort: '-publishedDate',
        limit: 3,
      }).catch(() => ({ docs: [] })),

      (payload.findGlobal as any)({ slug: 'site-settings' }).catch(() => null),
    ])

  const projects = projectsResult.docs
  const openCalls = openCallsResult.docs

  const featuredCalls = openCalls.map((c: any) => {
    const fmt = (d: string, opts?: Intl.DateTimeFormatOptions) =>
      new Date(d).toLocaleDateString('en-GB', opts ?? { month: 'short', year: 'numeric' })
    const dateRange = c.dates?.from
      ? fmt(c.dates.from, { month: 'long', year: 'numeric' })
      : null
    return {
      id: c.id,
      title: typeof c.title === 'string' ? c.title : c.title?.en ?? '',
      slug: c.slug,
      type: c.type ?? 'other',
      location: typeof c.location === 'string' ? c.location : c.location?.en ?? null,
      deadline: c.deadline,
      dateRange,
      ageMin: c.eligibility?.ageMin ?? null,
      ageMax: c.eligibility?.ageMax ?? null,
      spots: c.eligibility?.spotsAvailable ?? null,
    }
  })

  const stories = storiesResult.docs.map((s: any) => ({
    id: s.id,
    quote: localStr(s.quote, locale),
    author: s.author,
    age: s.age,
    country: s.country,
    projectName: s.projectName,
  }))
  const newsletters = newslettersResult.docs
  const allCountries = Array.from(
    new Set(projects.flatMap((p: any) => (p.countries ?? []).map((c: any) => c.country).filter(Boolean)))
  ) as string[]
  const urgentDays: number = settings?.badgeSettings?.urgentDaysThreshold ?? 7
  const showLiveBadge: boolean = settings?.badgeSettings?.showLiveBadge ?? true

  const timeline = settings?.timeline
  const erasmus  = settings?.erasmusExplainer
  const nl       = settings?.newsletter

  const mapCfg             = (settings as any)?.mapConfig ?? {}
  const mapActiveColor     = mapCfg.activeCountryColor || '#3D3785'
  const mapHomeCityColor   = mapCfg.homeCityColor      || '#E8A0A0'
  const mapPartnerColor    = mapCfg.partnerCityColor   || '#8B85E8'
  const mapCities          = (mapCfg.cities ?? []) as { city: string; country: string; lat: number; lng: number; isHome?: boolean }[]

  return (
    <>
      <Hero projectCount={projects.length} featuredCalls={featuredCalls} />

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-header__label">Our work</div>
                <h2 className="section-header__title">Featured Projects</h2>
              </div>
              <Link href="/projects" className="section-header__link">All projects →</Link>
            </div>
            <div className="grid-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} showLiveBadge={showLiveBadge} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Open calls */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-header__label">Apply now</div>
              <h2 className="section-header__title">Open Calls</h2>
            </div>
            <Link href="/open-calls" className="section-header__link">All open calls →</Link>
          </div>

          {openCalls.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'white', borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-muted)', fontSize: 15,
            }}>
              No open calls at the moment. Check back soon.
            </div>
          ) : (
            openCalls.map((c) => <OpenCallRow key={c.id} call={c} urgentDays={urgentDays} />)
          )}
        </div>
      </section>

      {/* ── About IC-YEC ─────────────────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left: mission + values */}
            <div>
              <div className="section-header__label" style={{ marginBottom: 12 }}>Who we are</div>
              <h2 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, marginBottom: 20, color: 'var(--color-text)' }}>
                More than an NGO —<br />
                <span style={{ color: 'var(--color-primary)' }}>a community of doers</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-text-muted)', marginBottom: 28 }}>
                Founded in 2018 in Yerevan, IC-YEC brings together young people, educators,
                and organisations around a shared belief: that hands-on, intercultural learning
                changes lives. From street-art workshops in Armenia to sport-based inclusion
                projects in Portugal, every initiative we run is designed to leave a lasting impact.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-text-muted)', marginBottom: 36 }}>
                We are accredited by the Erasmus+ programme, but our work goes far beyond it —
                we run local community projects, national youth initiatives, and long-term
                strategic partnerships with organisations across Europe and the South Caucasus.
              </p>

              {/* Focus areas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: '🎨', label: 'Art & Culture' },
                  { icon: '⚽', label: 'Sport & Health' },
                  { icon: '🌿', label: 'Environment' },
                  { icon: '💻', label: 'Digital Skills' },
                  { icon: '🤝', label: 'Social Inclusion' },
                  { icon: '🎓', label: 'Non-formal Education' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    background: 'var(--color-tint)',
                    borderRadius: 10,
                    fontSize: 14, fontWeight: 500,
                    color: 'var(--color-text)',
                  }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <Link
                  href="/about"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 10, fontWeight: 500,
                    textDecoration: 'none', fontSize: 14,
                  }}
                >
                  Learn more about us →
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { value: '2018', label: 'Year founded', icon: '📅' },
                { value: '20+',  label: 'Partner countries', icon: '🌍' },
                { value: '500+', label: 'Young participants', icon: '👥' },
                { value: '15+',  label: 'Projects completed', icon: '📋' },
                { value: '6',    label: 'Focus themes', icon: '🎯' },
                { value: '100%', label: 'Non-profit & free', icon: '🎁' },
              ].map(({ value, label, icon }) => (
                <div key={label} style={{
                  padding: '28px 20px',
                  background: 'var(--color-tint)',
                  borderRadius: 14,
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive map ───────────────────────────────────────────────── */}
      <section style={{ background: '#0f0e1a', padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                marginBottom: 8,
              }}>Our reach</div>
              <h2 style={{ fontSize: 28, fontWeight: 600, color: 'white', marginBottom: 8 }}>
                Where we make an impact
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 460 }}>
                IC-YEC is based in Yerevan, Armenia and works with partner organisations
                across Europe and the South Caucasus.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {[
                { n: `${allCountries.length || '20'}+`, label: 'Countries' },
                { n: '13+', label: 'Partner cities' },
              ].map(({ n, label }) => (
                <div key={label} style={{
                  padding: '8px 18px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{n}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 6 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <HomeMap
            activeCountries={allCountries}
            cities={mapCities.length > 0 ? mapCities : undefined}
            activeCountryColor={mapActiveColor}
            homeCityColor={mapHomeCityColor}
            partnerCityColor={mapPartnerColor}
          />
        </div>
      </section>

      {/* Participant stories */}
      {stories.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>Voices</div>
              <h2 style={{ fontSize: 28, fontWeight: 500, marginTop: 8 }}>Stories from participants</h2>
            </div>
            <ParticipantStories stories={stories} />
          </div>
        </section>
      )}

      {/* Application timeline */}
      {timeline?.enabled && timeline.steps?.length > 0 && (
        <ApplicationTimeline
          title={localStr(timeline.title, locale) || 'What happens after you apply'}
          steps={(timeline.steps as any[]).map((s: any) => ({
            icon: s.icon,
            title: localStr(s.title, locale),
            description: localStr(s.description, locale),
            duration: s.duration,
          }))}
        />
      )}

      {/* Erasmus+ explainer */}
      {erasmus?.enabled && erasmus.items?.length > 0 && (
        <ErasmusExplainer
          title={localStr(erasmus.title, locale) || 'New to Erasmus+?'}
          subtitle={localStr(erasmus.subtitle, locale)}
          items={(erasmus.items as any[]).map((item: any) => ({
            question: localStr(item.question, locale),
            answer:   localStr(item.answer, locale),
          }))}
        />
      )}


      {/* Newsletter */}
      {nl?.enabled !== false && (
        <NewsletterSection
          title={localStr(nl?.title, locale) || 'Stay in the loop'}
          subtitle={localStr(nl?.subtitle, locale)}
          signupUrl={nl?.signupUrl}
          buttonLabel={localStr(nl?.buttonLabel, locale) || 'Subscribe'}
          showArchive={nl?.showArchive !== false}
          recentNewsletters={newsletters.map((n: any) => ({
            id: n.id,
            title: n.title,
            issueName: n.issueName,
            publishedDate: n.publishedDate,
            preview: n.preview,
            archiveUrl: n.archiveUrl,
          }))}
        />
      )}
    </>
  )
}
