'use client'

import { useState } from 'react'

type FaqItem = { id: string; question: string; answer: string }
type Props   = { items: FaqItem[] }

export function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div
            key={item.id}
            style={{
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              style={{
                width: '100%', textAlign: 'left', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                gap: 16, padding: '18px 0',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: 16, fontWeight: 500,
                color: isOpen ? 'var(--color-primary)' : 'var(--color-text)',
                transition: 'color 0.15s',
              }}>
                {item.question}
              </span>
              <span style={{
                flexShrink: 0, fontSize: 20, lineHeight: 1,
                color: 'var(--color-primary)',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}>
                +
              </span>
            </button>

            {isOpen && (
              <div style={{
                paddingBottom: 20,
                fontSize: 15,
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}>
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
