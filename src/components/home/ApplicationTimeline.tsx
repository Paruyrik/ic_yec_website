import React from 'react'

interface TimelineStep {
  icon?: string | null
  title: string
  description?: string | null
  duration?: string | null
}

interface Props {
  title: string
  steps: TimelineStep[]
}

export function ApplicationTimeline({ title, steps }: Props) {
  if (steps.length === 0) return null

  return (
    <section className="section section--tint">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>How it works</div>
          <h2 style={{ fontSize: 28, fontWeight: 500, marginTop: 8 }}>{title}</h2>
        </div>

        {/* Desktop: horizontal row; mobile: single vertical column (see styles.css) */}
        <div
          className="timeline-grid"
          style={{ '--timeline-cols': String(Math.min(steps.length, 5)) } as React.CSSProperties}
        >
          {/* Connecting line (hidden on mobile) */}
          <div className="timeline-line" />

          {steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 12px',
              position: 'relative',
              zIndex: 1,
            }}>
              {/* Step circle */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'white',
                border: '2px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginBottom: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}>
                {step.icon ?? String(i + 1)}
              </div>

              {step.duration && (
                <span style={{
                  fontSize: 11,
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 6,
                }}>{step.duration}</span>
              )}

              <h3 style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text)',
                textAlign: 'center',
                marginBottom: 8,
              }}>{step.title}</h3>

              {step.description && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>{step.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
