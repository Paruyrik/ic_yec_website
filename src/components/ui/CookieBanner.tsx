'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ic-yec-consent'

type ConsentState = 'accepted' | 'rejected' | null

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>('accepted') // start hidden, check on mount

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
    setConsent(stored)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setConsent('accepted')
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setConsent('rejected')
  }

  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, width: 'min(600px, calc(100vw - 32px))',
        background: 'var(--color-dark)', color: 'white',
        borderRadius: 14, padding: '20px 24px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>🍪</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>We use cookies</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
            We use essential cookies to keep the site working and optional analytics cookies to
            understand how visitors use our site. No personal data is sold or shared with third parties.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={reject}
          style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
          }}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={accept}
          style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'var(--color-accent)', border: 'none',
            color: 'white', cursor: 'pointer',
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  )
}
