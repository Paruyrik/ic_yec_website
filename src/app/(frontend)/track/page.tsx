'use client'

import { useState } from 'react'
import Link from 'next/link'

type Application = {
  id: string
  status: string
  submittedAt: string
  openCallTitle: string
  openCallSlug: string | null
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string; message: string }> = {
  pending:    { label: 'Pending',    bg: '#FAEEDA', text: '#633806', icon: '⏳', message: 'Your application has been received and is in the queue for review.' },
  reviewing:  { label: 'Reviewing',  bg: '#E6F1FB', text: '#0C447C', icon: '🔍', message: 'Our team is currently reviewing your application. This usually takes 5–10 business days.' },
  accepted:   { label: 'Accepted',   bg: '#EAF3DE', text: '#3B6D11', icon: '🎉', message: 'Congratulations! Your application has been accepted. Check your email for next steps.' },
  waitlisted: { label: 'Waitlisted', bg: '#FEF3C7', text: '#92400E', icon: '📋', message: 'You are on the waiting list. We will contact you if a spot becomes available.' },
  rejected:   { label: 'Rejected',   bg: '#FCEBEB', text: '#A32D2D', icon: '❌', message: 'Unfortunately your application was not successful this time. We encourage you to apply for future programmes.' },
}

export default function TrackPage() {
  const [email,    setEmail]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [results,  setResults]  = useState<Application[] | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res  = await fetch(`/api/track?email=${encodeURIComponent(email.trim())}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong')
      setResults(json.applications)
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / Track Application
          </p>
          <h1 style={{ color: 'white', fontSize: 36 }}>Track Your Application</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, marginTop: 10, maxWidth: 520 }}>
            Enter the email address you used when applying to see the status of your applications.
          </p>
        </div>
      </div>

      <section className="section section--tint" style={{ paddingTop: 56 }}>
        <div className="container" style={{ maxWidth: 640 }}>

          {/* Search form */}
          <div style={{
            background: 'white', borderRadius: 14, padding: '32px',
            boxShadow: 'var(--shadow-card)', marginBottom: 32,
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    padding: '11px 14px', borderRadius: 8,
                    border: '1.5px solid var(--color-border)',
                    fontSize: 15, outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e)  => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e)   => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </label>

              {error && (
                <p style={{ color: '#A32D2D', fontSize: 14, background: '#FCEBEB', padding: '10px 14px', borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px', borderRadius: 8, border: 'none',
                  background: 'var(--color-primary)', color: 'white',
                  fontSize: 15, fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Searching…' : 'Check Status'}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && results !== null && (
            results.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: 14, padding: '40px 32px',
                boxShadow: 'var(--shadow-card)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>No applications found</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', maxWidth: 360, margin: '0 auto 20px' }}>
                  We couldn&apos;t find any applications for <strong>{email}</strong>.
                  Make sure you&apos;re using the same email address you applied with.
                </p>
                <Link
                  href="/open-calls"
                  style={{
                    display: 'inline-flex', padding: '9px 20px', background: 'var(--color-primary)',
                    color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
                  }}
                >
                  Browse open calls →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                  Found {results.length} application{results.length !== 1 ? 's' : ''} for <strong>{email}</strong>
                </p>
                {results.map((app) => {
                  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending
                  return (
                    <div key={app.id} style={{
                      background: 'white', borderRadius: 14,
                      boxShadow: 'var(--shadow-card)', overflow: 'hidden',
                    }}>
                      {/* Status colour bar */}
                      <div style={{ height: 5, background: cfg.text, opacity: 0.7 }} />
                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Open Call</p>
                            {app.openCallSlug ? (
                              <Link
                                href={`/open-calls/${app.openCallSlug}`}
                                style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}
                              >
                                {app.openCallTitle}
                              </Link>
                            ) : (
                              <span style={{ fontSize: 17, fontWeight: 500 }}>{app.openCallTitle}</span>
                            )}
                            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                              Submitted {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>

                          <span style={{
                            padding: '5px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                            background: cfg.bg, color: cfg.text, flexShrink: 0,
                          }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>

                        <div style={{
                          marginTop: 14, padding: '12px 14px', borderRadius: 8,
                          background: cfg.bg, color: cfg.text, fontSize: 13, lineHeight: 1.55,
                        }}>
                          {cfg.message}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* Info box */}
          {!searched && (
            <div style={{
              background: 'var(--color-tint)', borderRadius: 12, padding: '20px 24px',
              fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6,
            }}>
              <p style={{ fontWeight: 500, color: 'var(--color-primary)', marginBottom: 6 }}>ℹ️ How it works</p>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Enter the email you used when submitting your application.</li>
                <li>All your applications across different open calls will be shown.</li>
                <li>Status updates are sent by email as well — check your inbox and spam folder.</li>
                <li>For questions, <Link href="/contact" style={{ color: 'var(--color-primary)' }}>contact us</Link>.</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
