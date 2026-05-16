'use client'

import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE, LOCALES, type Locale } from '@/lib/locale-shared'

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter()

  function switchLocale(code: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 12 }}>
      {LOCALES.map((l, i) => (
        <span key={l.code} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 2px', fontSize: 11 }}>|</span>}
          <button
            type="button"
            onClick={() => switchLocale(l.code)}
            title={l.label}
            style={{
              background: current === l.code ? 'rgba(255,255,255,0.12)' : 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: current === l.code ? 600 : 400,
              color: current === l.code ? 'white' : 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              transition: 'background 0.15s, color 0.15s',
            } as React.CSSProperties}
          >
            {l.code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
