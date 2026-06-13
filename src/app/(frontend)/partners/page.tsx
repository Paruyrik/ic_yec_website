import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'
import { getLocale, localStr } from '@/lib/locale'
import { PartnerApplicationForm } from '@/components/partners/PartnerApplicationForm'

export const metadata = {
  title: 'Partner with IC-YEC',
  description: 'Become a partner organisation and collaborate on Erasmus+ youth exchange projects, training courses, and ESC volunteering with IC-YEC.',
}

const WHY_PARTNER = [
  { icon: '🌍', title: 'European network', desc: 'Join a growing network of youth organisations across Europe and the South Caucasus.' },
  { icon: '💶', title: 'Co-funded projects', desc: 'Access Erasmus+ grants together - all participant costs fully covered through project funding.' },
  { icon: '🎓', title: 'Non-formal expertise', desc: 'Benefit from IC-YEC\'s experience designing and facilitating intercultural non-formal education.' },
  { icon: '🤝', title: 'Long-term collaboration', desc: 'We build lasting partnerships - not one-off projects, but ongoing strategic relationships.' },
]

export default async function PartnersPage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()

  const settings = await payload.getCachedGlobal({ slug: 'site-settings' as any }).catch(() => null)
  const portal   = (settings as any)?.partnerPortal ?? {}

  const types        = portal.types        ?? []
  const requirements = portal.requirements ?? []
  const pifUrl       = portal.pifUrl       ?? ''
  const contactEmail = portal.contactEmail ?? 'info@ic-yec.org'

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '64px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.07)', top: -160, right: -60 }} />
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.05)', bottom: -100, left: -40 }} />
        </div>
        <div className="container" style={{ position: 'relative', maxWidth: 720 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>·</span>
            Partner with us
          </p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 100,
            background: 'rgba(255,255,255,0.12)',
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20,
          }}>
            🤝 Open to new partnerships
          </span>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
            Partner with IC-YEC
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 560 }}>
            We collaborate with youth organisations, schools, cultural centres, and municipalities
            across Europe to run Erasmus+ projects that create real impact for young people.
            If you share our values, we'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#apply" style={{
              padding: '12px 24px', background: 'var(--color-accent)', color: 'white',
              borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>
              Apply now →
            </a>
            {pifUrl && (
              <a href={pifUrl} target="_blank" rel="noopener noreferrer" style={{
                padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: 'white',
                borderRadius: 10, fontWeight: 500, fontSize: 14, textDecoration: 'none',
              }}>
                Download PIF (PDF)
              </a>
            )}
            <a href={`mailto:${contactEmail}`} style={{
              padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)',
              borderRadius: 10, fontWeight: 400, fontSize: 14, textDecoration: 'none',
            }}>
              ✉ {contactEmail}
            </a>
          </div>
        </div>
      </div>

      {/* ── Why partner ─────────────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>Why collaborate</div>
            <h2 style={{ fontSize: 26, fontWeight: 600, marginTop: 8 }}>What you gain by partnering with us</h2>
          </div>
          <div className="grid-2">
            {WHY_PARTNER.map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex', gap: 18, alignItems: 'flex-start',
                padding: '24px', background: 'var(--color-tint)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              }}>
                <span style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership types (from Payload) ─────────────────────────── */}
      {types.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>Collaboration models</div>
              <h2 style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>Types of partnership</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {types.map((t: any, i: number) => (
                <div key={i} style={{
                  padding: '28px 24px', background: 'white',
                  borderRadius: 14, border: '1.5px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  {t.icon && <div style={{ fontSize: 36, marginBottom: 14 }}>{t.icon}</div>}
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{localStr(t.title, locale)}</h3>
                  {t.description && (
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                      {localStr(t.description, locale)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── What we look for (from Payload) ─────────────────────────── */}
      {requirements.length > 0 && (
        <section className="section section--white">
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>Criteria</div>
              <h2 style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>What we look for in partners</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requirements.map((r: any, i: number) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 20px', background: 'var(--color-tint)',
                  borderRadius: 10, border: '1px solid var(--color-border)',
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--color-primary)', color: 'white',
                    fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 15, color: 'var(--color-text)', lineHeight: 1.6 }}>
                    {localStr(r.item, locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="section section--tint">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-header__label" style={{ justifyContent: 'center', display: 'flex' }}>What happens next</div>
            <h2 style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>The partnership process</h2>
          </div>
          <div className="grid-4">
            {[
              { step: '01', icon: '📝', title: 'Submit application', desc: 'Fill in the form below. It takes about 5 minutes.' },
              { step: '02', icon: '📧', title: 'We review & respond', desc: 'Our team reviews every application within 3–5 business days.' },
              { step: '03', icon: '📞', title: 'Intro call', desc: 'If there\'s a good match, we schedule a call to discuss ideas and fit.' },
              { step: '04', icon: '🚀', title: 'Start collaborating', desc: 'We design the project together and submit for Erasmus+ funding.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--color-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, margin: '0 auto 14px',
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>STEP {step}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ─────────────────────────────────────────── */}
      <section id="apply" className="section section--white">
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 36 }}>
            <div className="section-header__label">Apply now</div>
            <h2 style={{ fontSize: 26, fontWeight: 600, marginTop: 8, marginBottom: 10 }}>
              Start your partnership application
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
              Fields marked with <span style={{ color: '#e53e3e' }}>*</span> are required.
              We'll get back to you within 3–5 business days.
            </p>
          </div>
          <PartnerApplicationForm />
        </div>
      </section>
    </>
  )
}
