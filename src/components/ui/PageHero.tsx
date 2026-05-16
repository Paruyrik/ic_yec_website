import React from 'react'

type Props = {
  label?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  tint?: boolean
}

export function PageHero({ label, title, subtitle, actions, tint = false }: Props) {
  return (
    <section className={`section ${tint ? 'section--tint' : 'section--white'}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="container">
        {label && (
          <p style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            marginBottom: 10,
          }}>
            {label}
          </p>
        )}
        <h1 style={{ fontSize: 36, fontWeight: 500, color: 'var(--color-text)', maxWidth: 700 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            marginTop: 14,
            fontSize: 17,
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: 600,
          }}>
            {subtitle}
          </p>
        )}
        {actions && (
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
