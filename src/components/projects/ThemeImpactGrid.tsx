import React from 'react'

interface ThemeItem {
  theme: string
  projectCount?: string | null
  participantCount?: string | null
  countriesCount?: string | null
  icon?: string | null
}

interface Props {
  themes: ThemeItem[]
}

const THEME_DEFAULTS: Record<string, { label: string; icon: string; color: string }> = {
  'art':                  { label: 'Art & Culture',         icon: '🎨', color: '#a855f7' },
  'sport':                { label: 'Sport & Health',        icon: '⚽', color: '#22c55e' },
  'emotional-intelligence': { label: 'Emotional Intelligence', icon: '💛', color: '#f59e0b' },
  'training':             { label: 'Training & Education',  icon: '🎓', color: '#3b82f6' },
  'inclusion':            { label: 'Social Inclusion',      icon: '🤝', color: '#ec4899' },
  'digital':              { label: 'Digital & Media',       icon: '💻', color: '#06b6d4' },
  'environment':          { label: 'Environment',           icon: '🌿', color: '#16a34a' },
}

export function ThemeImpactGrid({ themes }: Props) {
  if (themes.length === 0) return null

  return (
    <section className="section section--tint">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>By theme</div>
          <h2 style={{ fontSize: 26, fontWeight: 500, marginTop: 8 }}>Impact by Focus Area</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {themes.map((t) => {
            const defaults = THEME_DEFAULTS[t.theme] ?? { label: t.theme, icon: '⭐', color: 'var(--color-primary)' }
            const icon = t.icon ?? defaults.icon
            const label = defaults.label

            return (
              <div key={t.theme} style={{
                background: 'white',
                borderRadius: 14,
                padding: '24px 20px',
                borderTop: `3px solid ${defaults.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>{label}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {t.projectCount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Projects</span>
                      <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: defaults.color }}>{t.projectCount}</span>
                    </div>
                  )}
                  {t.participantCount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Participants</span>
                      <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: defaults.color }}>{t.participantCount}</span>
                    </div>
                  )}
                  {t.countriesCount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Countries</span>
                      <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: defaults.color }}>{t.countriesCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
