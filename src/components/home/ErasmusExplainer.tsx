'use client'

import React, { useState } from 'react'

interface Item {
  question: string
  answer: string
}

interface Props {
  title: string
  subtitle?: string | null
  items: Item[]
}

export function ErasmusExplainer({ title, subtitle, items }: Props) {
  const [open, setOpen] = useState<number | null>(0)
  if (items.length === 0) return null

  return (
    <section className="section section--white">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          {/* Left: heading + logo-ish decoration */}
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(0,120,215,0.08)',
              borderRadius: 100,
              marginBottom: 20,
            }}>
              <span>🇪🇺</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0078d7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Erasmus+</span>
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.25, marginBottom: 16 }}>{title}</h2>

            {subtitle && (
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{subtitle}</p>
            )}

            <div style={{ marginTop: 32 }}>
              <a
                href="https://erasmus-plus.ec.europa.eu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 14, color: 'var(--color-primary)', textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Official Erasmus+ website →
              </a>
            </div>
          </div>

          {/* Right: accordion */}
          <div>
            {items.map((item, i) => (
              <div key={i} style={{
                borderBottom: '1px solid var(--color-border)',
              }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '18px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)', flex: 1 }}>
                    {item.question}
                  </span>
                  <span style={{
                    color: 'var(--color-primary)',
                    fontSize: 20,
                    transform: open === i ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}>+</span>
                </button>

                {open === i && (
                  <div style={{
                    paddingBottom: 20,
                    fontSize: 14,
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.65,
                  }}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
