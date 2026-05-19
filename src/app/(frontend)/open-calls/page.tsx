import Link from 'next/link'
import type { OpenCall } from '@/payload-types'
import { getPayloadClient } from '@/lib/payloadClient'

// ── helpers ──────────────────────────────────────────────────────────────────

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

function deadlinePill(deadline: string) {
  const days = daysUntil(deadline)
  if (days <= 0)  return { label: 'Closed',       cls: 'badge dl-closed' }
  if (days <= 30) return { label: `${days}d left`, cls: 'badge dl-urgent' }
  return               { label: `${days}d left`, cls: 'badge dl-ok' }
}

const TYPE_LABELS: Record<string, string> = {
  'youth-exchange':   'Youth Exchange',
  'training-course':  'Training Course',
  'esc-volunteering': 'ESC Volunteering',
  'seminar':          'Seminar',
  'other':            'Other',
}

// ── Card ──────────────────────────────────────────────────────────────────────

function CallCard({ call, muted }: { call: OpenCall; muted?: boolean }) {
  const title    = typeof call.title    === 'string' ? call.title    : (call.title as any)?.en    ?? 'Untitled'
  const location = typeof call.location === 'string' ? call.location : (call.location as any)?.en
  const deadline = call.deadline as string
  const pill     = deadlinePill(deadline)
  const type     = call.type ?? 'other'
  const typeBarClass = `type-bar-${type}`

  const dateRange = call.dates?.from
    ? `${new Date(call.dates.from as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` +
      (call.dates.to ? ` – ${new Date(call.dates.to as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : '')
    : null

  return (
    <Link href={`/open-calls/${call.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className={`card ${typeBarClass}`}
        style={{ opacity: muted ? 0.6 : 1, height: '100%' }}
      >
        {/* Card body */}
        <div className="card__body" style={{ gap: 12 }}>
          {/* Top row: type badge + deadline pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span className="badge badge--purple" style={{ fontSize: 11 }}>
              {TYPE_LABELS[type]}
            </span>
            <span className={pill.cls} style={{ fontSize: 11 }}>{pill.label}</span>
          </div>

          {/* Title */}
          <h3 className="card__title" style={{ fontSize: 16 }}>{title}</h3>

          {/* Meta row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {location && (
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span aria-hidden="true">📍</span> {location}
              </span>
            )}
            {dateRange && (
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span aria-hidden="true">🗓</span> {dateRange}
              </span>
            )}
            {call.eligibility?.spotsAvailable && (
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span aria-hidden="true">👥</span> {call.eligibility.spotsAvailable} spots
              </span>
            )}
          </div>
        </div>

        {/* Card footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Deadline: {new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {call.status === 'open' ? 'Apply' : 'View'} →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OpenCallsPage() {
  const payload = await getPayloadClient()
  const { docs: calls } = await payload.getCachedCollection<'open-calls'>({
    collection: 'open-calls',
    limit: 50,
    sort: 'deadline',
  }).catch(() => ({ docs: [] as OpenCall[] }))

  const open   = calls.filter((c) => c.status === 'open')
  const closed = calls.filter((c) => c.status !== 'open')

  return (
    <>
      {/* Page header */}
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / Open Calls
          </p>
          <h1 style={{ color: 'white', fontSize: 36 }}>Open Calls</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 10, fontSize: 15 }}>
            Apply for youth exchanges, training courses, and ESC volunteering projects.
          </p>
        </div>
      </div>

      <section className="section section--tint">
        <div className="container">
          {/* Active */}
          {open.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: 'white', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
              No open calls right now. Subscribe to our newsletter to get notified.
            </div>
          ) : (
            <>
              <div className="section-header" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 500 }}>Currently open</h2>
              </div>
              <div className="grid-3">
                {open.map((c) => <CallCard key={c.id} call={c} />)}
              </div>
            </>
          )}

          {/* Closed */}
          {closed.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20, color: 'var(--color-text-muted)' }}>
                Past &amp; archived
              </h2>
              <div className="grid-3">
                {closed.map((c) => <CallCard key={c.id} call={c} muted />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
