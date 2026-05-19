import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'
import { getLocale, localStr } from '@/lib/locale'

export const metadata = {
  title: 'Partner with IC-YEC',
  description: 'Become a partner organisation and collaborate on Erasmus+ youth exchange projects, training courses, and ESC volunteering with IC-YEC.',
}

export default async function PartnersPage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()

  const settings = await payload.getCachedGlobal({ slug: 'site-settings' as any }).catch(() => null)
  const portal = (settings as any)?.partnerPortal ?? {}

  const partnersResult = await payload.getCachedCollection<'partners'>({
    collection: 'partners',
    limit: 50,
    sort: 'name',
  }).catch(() => ({ docs: [] }))

  const partners = partnersResult.docs

  const title    = localStr(portal.title, locale)    || 'Partner with IC-YEC'
  const subtitle = localStr(portal.subtitle, locale) || ''
  const types    = portal.types ?? []
  const requirements = portal.requirements ?? []
  const pifUrl   = portal.pifUrl ?? ''
  const contactEmail = portal.contactEmail ?? 'partnerships@ic-yec.org'

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--color-primary)', padding: '64px 0 52px' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / Partners
          </p>
          <h1 style={{ color: 'white', fontSize: 38, fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.65 }}>
              {subtitle}
            </p>
          )}

          <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {pifUrl && (
              <a
                href={pifUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 24px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  borderRadius: 10, fontWeight: 600,
                  textDecoration: 'none', fontSize: 14,
                }}
              >
                Download Partner Form (PDF)
              </a>
            )}
            <a
              href={`mailto:${contactEmail}`}
              style={{
                padding: '11px 24px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: 10, fontWeight: 500,
                textDecoration: 'none', fontSize: 14,
                backdropFilter: 'blur(4px)',
              }}
            >
              ✉ {contactEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Partnership types */}
      {types.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>Collaboration models</div>
              <h2 style={{ fontSize: 26, fontWeight: 500, marginTop: 8 }}>Types of Partnership</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 20,
            }}>
              {types.map((t: any, i: number) => (
                <div key={i} style={{
                  padding: '28px 24px',
                  background: 'var(--color-tint)',
                  borderRadius: 14,
                  border: '1.5px solid var(--color-border)',
                }}>
                  {t.icon && <div style={{ fontSize: 36, marginBottom: 14 }}>{t.icon}</div>}
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
                    {localStr(t.title, locale)}
                  </h3>
                  {t.description && (
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      {localStr(t.description, locale)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <section className="section section--tint">
          <div className="container" style={{ maxWidth: 720 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24, textAlign: 'center' }}>
              What we look for in partners
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requirements.map((r: any, i: number) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 20px',
                  background: 'white',
                  borderRadius: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 15, color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {localStr(r.item, locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Current partners */}
      {partners.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <h2 style={{ fontSize: 22, fontWeight: 500, textAlign: 'center', marginBottom: 32 }}>
              Our current partners
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
            }}>
              {partners.map((p: any) => (
                <div key={p.id} style={{
                  padding: '10px 20px',
                  background: 'var(--color-tint)',
                  borderRadius: 100,
                  border: '1px solid var(--color-border)',
                  fontSize: 14,
                  color: 'var(--color-text)',
                }}>
                  {p.website ? (
                    <a href={p.website} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'inherit', textDecoration: 'none' }}>
                      {p.name}
                    </a>
                  ) : p.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 520 }}>
          <h2 style={{ color: 'white', fontSize: 26, fontWeight: 500, marginBottom: 14 }}>
            Ready to collaborate?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Send us a message and we&apos;ll get back to you within 3 business days to discuss how we can work together.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=Partnership%20inquiry`}
            style={{
              display: 'inline-block',
              padding: '13px 32px',
              background: 'var(--color-accent)',
              color: 'var(--color-primary)',
              borderRadius: 10, fontWeight: 600,
              textDecoration: 'none', fontSize: 15,
            }}
          >
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
