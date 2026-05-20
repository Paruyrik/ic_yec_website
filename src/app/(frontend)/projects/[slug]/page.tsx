import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payloadClient'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { GalleryGrid } from '@/components/projects/GalleryGrid'

function fmt(d: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ongoing:   { bg: 'rgba(72,187,120,0.15)', text: '#276749' },
  completed: { bg: 'var(--color-tint)',     text: 'var(--color-primary)' },
  upcoming:  { bg: '#FEF3C7',               text: '#92400E' },
}

const THEME_LABELS: Record<string, string> = {
  'art':                    'Art',
  'sport':                  'Sport',
  'emotional-intelligence': 'Emotional Intelligence',
  'training':               'Training',
  'inclusion':              'Inclusion',
  'digital':                'Digital',
  'environment':            'Environment',
}

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vmMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`
  return null
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug }  = await params
  const payload   = await getPayloadClient()

  const { docs } = await payload.getCachedCollection<'projects'>({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  }).catch(() => ({ docs: [] as any[] }))

  if (!docs.length) notFound()
  const project = docs[0]

  const title    = typeof project.title   === 'string' ? project.title   : (project.title as any)?.en   ?? 'Untitled'
  const summary  = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.en ?? ''
  const status   = project.status ?? 'upcoming'
  const sc       = STATUS_COLORS[status] ?? STATUS_COLORS.upcoming
  const themes   = Array.isArray(project.theme) ? project.theme as string[] : []
  const countries: string[] = project.countries?.map((c: any) => c.country).filter(Boolean) ?? []
  const gallery: any[]   =(project.gallery ?? []).map((g: any) => g.image).filter((img: any) => img?.url)
  const outcomes: string[] = (project.outcomes ?? []).map((o: any) => o.outcome).filter(Boolean)
  const testimonials: any[] = project.testimonials ?? []
  const embedUrl = project.videoUrl ? getEmbedUrl(project.videoUrl as string) : null

  return (
    <>
      {/* ── Purple hero ──────────────────────────────────────────────────────── */}
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
          </div>
          <h1 style={{ color: 'white', fontSize: 34, fontWeight: 500, maxWidth: 760, lineHeight: 1.2 }}>{title}</h1>
        </div>
      </div>

      {/* ── 2-col body ───────────────────────────────────────────────────────── */}
      <section className="section section--tint" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>

            {/* ── Left: content ────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* Rich text content (preferred) */}
              {project.content && (
                <div className="rich-text" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px 32px', boxShadow: 'var(--shadow-card)' }}>
                  <RichText data={project.content as any} />
                </div>
              )}

              {/* Fallback to summary if no content */}
              {!project.content && summary && (
                <p style={{ fontSize: 17, color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                  {summary}
                </p>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14, color: 'var(--color-text)' }}>Gallery</h2>
                  <GalleryGrid images={gallery} />
                </div>
              )}

              {/* Video embed */}
              {embedUrl && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14, color: 'var(--color-text)' }}>Project Video</h2>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000' }}>
                    <iframe
                      src={embedUrl}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Key outcomes */}
              {outcomes.length > 0 && (
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}>Key Outcomes</h2>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                    {outcomes.map((o, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: 'var(--color-primary)', color: 'white',
                          fontSize: 11, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1,
                        }}>✓</span>
                        <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Testimonials */}
              {testimonials.length > 0 && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14, color: 'var(--color-text)' }}>What participants say</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {testimonials.map((t: any, i: number) => (
                      <blockquote key={i} style={{
                        background: 'white', borderRadius: 'var(--radius-lg)',
                        padding: '20px 24px', margin: 0, boxShadow: 'var(--shadow-card)',
                        borderLeft: '3px solid var(--color-primary)',
                      }}>
                        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text)', marginBottom: 10, fontStyle: 'italic' }}>
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <cite style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'normal', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {t.photo?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.photo.url} alt={t.author} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          )}
                          <span>
                            <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>{t.author}</strong>
                            {t.role && `, ${t.role}`}
                            {t.country && <span style={{ marginLeft: 6, opacity: 0.7 }}>{t.country}</span>}
                          </span>
                        </cite>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes */}
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

            {/* ── Right: metadata sidebar ──────────────────────────────────── */}
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

                {/* Info rows (no Funding) */}
                <div style={{ padding: '8px 20px 4px' }}>
                  {[
                    project.startDate   && { icon: '🚀', label: 'Start date',    value: fmt(project.startDate as string) },
                    project.endDate     && { icon: '🏁', label: 'End date',      value: fmt(project.endDate as string) },
                    (project.participants > 0) && { icon: '👥', label: 'Participants', value: String(project.participants) },
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

                {/* Countries pills */}
                {countries.length > 0 && (
                  <div style={{ padding: '4px 20px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      Countries
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {countries.map((c) => (
                        <span key={c} style={{
                          padding: '3px 10px', borderRadius: 100,
                          background: 'var(--color-tint)',
                          border: '1px solid var(--color-border)',
                          fontSize: 12, fontWeight: 500, color: 'var(--color-primary)',
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
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
