import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@/payload.config'

function fmt(d: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ongoing:   { bg: 'rgba(72,187,120,0.15)', text: '#276749' },
  completed: { bg: 'var(--color-tint)',     text: 'var(--color-primary)' },
  upcoming:  { bg: '#FEF3C7',               text: '#92400E' },
}

const THEME_LABELS: Record<string, string> = {
  'art':                  'Art',
  'sport':                'Sport',
  'emotional-intelligence': 'Emotional Intelligence',
  'training':             'Training',
  'inclusion':            'Inclusion',
  'digital':              'Digital',
  'environment':          'Environment',
}

const FUNDING_LABELS: Record<string, string> = {
  'erasmus-plus': 'Erasmus+',
  'other-eu':     'Other EU',
  'national':     'National',
  'private':      'Private',
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug }  = await params
  const payload   = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  if (!docs.length) notFound()
  const project = docs[0]

  const title   = typeof project.title   === 'string' ? project.title   : (project.title as any)?.en   ?? 'Untitled'
  const summary = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.en ?? ''
  const status  = project.status ?? 'upcoming'
  const sc      = STATUS_COLORS[status] ?? STATUS_COLORS.upcoming
  const themes  = Array.isArray(project.theme) ? project.theme as string[] : []
  const countries = project.countries?.map((c: any) => c.country).filter(Boolean).join(', ') ?? ''

  return (
    <>
      {/* ── Purple hero with breadcrumb ──────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '52px 0 40px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 10 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href="/projects" style={{ color: 'inherit' }}>Projects</Link>
            {' / '}{title}
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span className="badge badge--dark" style={{ textTransform: 'capitalize' }}>{status}</span>
            {project.fundingSource && (
              <span className="badge badge--dark">{FUNDING_LABELS[project.fundingSource] ?? project.fundingSource}</span>
            )}
          </div>
          <h1 style={{ color: 'white', fontSize: 34, fontWeight: 500, maxWidth: 760, lineHeight: 1.2 }}>{title}</h1>
        </div>
      </div>

      {/* ── 2-col body ──────────────────────────────────────────────────────── */}
      <section className="section section--tint" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>

            {/* ── Left: content ───────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {summary && (
                <p style={{ fontSize: 17, color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                  {summary}
                </p>
              )}

              {themes.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                    Themes
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {themes.map((t) => (
                      <span key={t} className="badge badge--purple">{THEME_LABELS[t] ?? t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Link href="/projects" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: 14 }}>
                  ← Back to all projects
                </Link>
              </div>
            </div>

            {/* ── Right: metadata sidebar ─────────────────────────────────── */}
            <aside style={{ position: 'sticky', top: 88 }}>
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}>
                {/* Status strip */}
                <div style={{ padding: '14px 20px', background: sc.bg, borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: sc.text, textTransform: 'capitalize' }}>
                    {status}
                  </span>
                </div>

                {/* Info rows */}
                <div style={{ padding: '8px 20px 16px' }}>
                  {[
                    project.startDate  && { icon: '🚀', label: 'Start date',  value: fmt(project.startDate as string) },
                    project.endDate    && { icon: '🏁', label: 'End date',    value: fmt(project.endDate as string) },
                    countries          && { icon: '🌍', label: 'Countries',   value: countries },
                    project.fundingSource && { icon: '💶', label: 'Funding',  value: FUNDING_LABELS[project.fundingSource] ?? project.fundingSource },
                  ].filter(Boolean).map((row: any) => (
                    <div key={row.label} className="info-row">
                      <span className="info-row__icon">{row.icon}</span>
                      <div>
                        <div className="info-row__label">{row.label}</div>
                        <div className="info-row__value">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA strip */}
                <div style={{ padding: '0 20px 20px' }}>
                  <Link href="/open-calls" className="btn btn-outline-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                    See open calls →
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  )
}
