import React from 'react'
import Link from 'next/link'

interface Newsletter {
  id: string
  title: string
  issueName?: string | null
  publishedDate: string
  preview: string
  archiveUrl?: string | null
}

interface Props {
  title: string
  subtitle?: string | null
  signupUrl?: string | null
  buttonLabel?: string | null
  showArchive: boolean
  recentNewsletters: Newsletter[]
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function NewsletterSection({ title, subtitle, signupUrl, buttonLabel, showArchive, recentNewsletters }: Props) {
  return (
    <section style={{ background: 'var(--color-primary)', padding: '72px 0' }}>
      <div className="container">
        {/* Top: signup */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto', marginBottom: showArchive && recentNewsletters.length > 0 ? 64 : 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 100, marginBottom: 20,
            fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            ✉ Newsletter
          </div>

          <h2 style={{ fontSize: 30, fontWeight: 500, color: 'white', marginBottom: 12 }}>{title}</h2>

          {subtitle && (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 28 }}>
              {subtitle}
            </p>
          )}

          {signupUrl ? (
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '13px 32px',
                background: 'var(--color-accent)',
                color: 'var(--color-primary)',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(232,160,160,0.4)',
              }}
            >
              {buttonLabel ?? 'Subscribe'}
            </a>
          ) : (
            <form
              action="/api/newsletter"
              method="POST"
              style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: '12px 16px',
                  borderRadius: 10, border: 'none',
                  fontSize: 15, outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 22px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  border: 'none', borderRadius: 10,
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {buttonLabel ?? 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Archive previews */}
        {showArchive && recentNewsletters.length > 0 && (
          <div>
            <p style={{
              textAlign: 'center',
              fontSize: 12, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 24,
            }}>Recent issues</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(recentNewsletters.length, 3)}, 1fr)`,
              gap: 16,
            }}>
              {recentNewsletters.map(nl => (
                <div key={nl.id} style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '20px 22px',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                    {nl.issueName ?? formatDate(nl.publishedDate)}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 10 }}>
                    {nl.title}
                  </div>
                  <p style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.55, marginBottom: 16,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>
                    {nl.preview}
                  </p>
                  {nl.archiveUrl && (
                    <a
                      href={nl.archiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 13, color: 'var(--color-accent)',
                        textDecoration: 'none', fontWeight: 500,
                      }}
                    >
                      Read issue →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
