import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { RegistrationForm } from '@/components/registration/RegistrationForm'
import type { FormFieldBlock } from '@/components/registration/types'
import { EligibilityChecker } from '@/components/open-calls/EligibilityChecker'
import { DeadlineCountdown } from '@/components/ui/DeadlineCountdown'
import { LiveBadge } from '@/components/ui/LiveBadge'

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

const TYPE_LABELS: Record<string, string> = {
  'youth-exchange':   'Youth Exchange',
  'training-course':  'Training Course',
  'esc-volunteering': 'ESC Volunteering',
  'seminar':          'Seminar',
  'other':            'Other',
}

function fmt(d: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function OpenCallDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload  = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'open-calls',
    where: { slug: { equals: slug } },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  if (!docs.length) notFound()
  const call = docs[0]

  const title    = typeof call.title    === 'string' ? call.title    : (call.title as any)?.en    ?? 'Untitled'
  const summary  = typeof call.summary  === 'string' ? call.summary  : (call.summary as any)?.en  ?? ''
  const location = typeof call.location === 'string' ? call.location : (call.location as any)?.en
  const deadline = call.deadline as string
  const days     = daysUntil(deadline)
  const isOpen   = call.status === 'open' && call.registrationEnabled !== false && days > 0
  const spots    = call.eligibility?.spotsAvailable ?? null

  const dateRange = call.dates?.from
    ? `${fmt(call.dates.from as string, { day: 'numeric', month: 'short' })}` +
      (call.dates.to ? ` – ${fmt(call.dates.to as string, { day: 'numeric', month: 'short', year: 'numeric' })}` : '')
    : null

  const eligCountries = call.eligibility?.countries
    ?.map((c: any) => c.country)
    .filter(Boolean)
    .join(', ')

  return (
    <>
      {/* ── Purple hero ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '52px 0 40px' }}>
        <div className="container">
          {/* Breadcrumb */}
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 10 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href="/open-calls" style={{ color: 'inherit' }}>Open Calls</Link>
            {' / '}{title}
          </p>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge--dark">{TYPE_LABELS[call.type ?? 'other'] ?? call.type}</span>
            {isOpen
              ? <span className="badge" style={{ background: 'rgba(72,187,120,0.2)', color: '#c6f6d5' }}>Open</span>
              : <span className="badge" style={{ background: '#FAECE7', color: '#993C1D' }}>Closed</span>
            }
            {isOpen && days <= 7 && <LiveBadge variant="urgent" label={`${days}d left`} />}
          </div>

          <h1 style={{ color: 'white', fontSize: 34, fontWeight: 500, maxWidth: 760, lineHeight: 1.2 }}>{title}</h1>

          {isOpen && (
            <div style={{ marginTop: 16 }}>
              <DeadlineCountdown deadline={deadline} />
            </div>
          )}
        </div>
      </div>

      {/* ── 2-col body ──────────────────────────────────────────────────── */}
      <section className="section section--tint" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'start' }}>

            {/* ── Left: content + eligibility ──────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Summary */}
              {summary && (
                <p style={{ fontSize: 16, color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                  {summary}
                </p>
              )}

              {/* Eligibility card */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}>
                <h2 style={{ fontSize: 17, marginBottom: 16, color: 'var(--color-text)' }}>Who can apply</h2>
                <div>
                  {[
                    location       && { icon: '📍', label: 'Location',       value: location },
                    dateRange      && { icon: '🗓',  label: 'Activity dates', value: dateRange },
                    deadline       && { icon: '⏰',  label: 'Deadline',       value: fmt(deadline) },
                    (call.eligibility?.ageMin != null) && {
                      icon: '🎂', label: 'Age',
                      value: `${call.eligibility.ageMin} – ${call.eligibility.ageMax ?? 35} years`,
                    },
                    eligCountries  && { icon: '🌍', label: 'Open to',        value: eligCountries },
                    spots          && { icon: '👥', label: 'Spots available', value: String(spots) },
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
              </div>

              {/* Eligibility checker */}
              {isOpen && (
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}>
                  <h2 style={{ fontSize: 17, marginBottom: 16, color: 'var(--color-text)' }}>Check your eligibility</h2>
                  <EligibilityChecker eligibility={{
                    ageMin: call.eligibility?.ageMin ?? null,
                    ageMax: call.eligibility?.ageMax ?? null,
                    countries: (call.eligibility?.countries as any) ?? null,
                  }} />
                </div>
              )}

              {/* Closed state */}
              {!isOpen && (
                <div style={{
                  background: 'white', borderRadius: 'var(--radius-lg)',
                  padding: '28px', textAlign: 'center', boxShadow: 'var(--shadow-card)',
                }}>
                  <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Applications are closed</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20 }}>
                    The deadline has passed. Follow our social media or subscribe to be notified of future opportunities.
                  </p>
                  <Link href="/open-calls" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: 14 }}>
                    ← All open calls
                  </Link>
                </div>
              )}
            </div>

            {/* ── Right: registration form (sticky) ─────────────────────── */}
            {isOpen && (
              <aside style={{ position: 'sticky', top: 88 }}>
                {/* Form card with purple header */}
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  <div className="form-section-header">
                    Application Form
                    {spots && (
                      <span style={{ float: 'right', fontSize: 13, opacity: 0.85 }}>
                        {spots} spots available
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '24px' }}>
                    <RegistrationForm
                      openCallId={String(call.id)}
                      openCallTitle={title}
                      formFields={(call.formFields ?? []) as FormFieldBlock[]}
                      spotsAvailable={spots ?? undefined}
                    />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
