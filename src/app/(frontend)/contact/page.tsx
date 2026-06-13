import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'
import { getLocale, localStr } from '@/lib/locale'
import ContactForm from './ContactForm'

const SOCIAL_ORDER: { key: string; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook',  label: 'Facebook' },
  { key: 'linkedin',  label: 'LinkedIn' },
  { key: 'youtube',   label: 'YouTube' },
  { key: 'tiktok',    label: 'TikTok' },
]

export const metadata = {
  title: 'Contact IC-YEC',
  description: 'Get in touch with the International Center for Youth Empowerment Cooperation.',
}

export default async function ContactPage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const settings = (await payload
    .getCachedGlobal({ slug: 'site-settings' as any })
    .catch(() => null)) as any

  const contact = settings?.contact ?? {}
  const social = contact.social ?? {}
  const email: string | null = contact.email ?? null
  const phone: string | null = contact.phone ?? null
  const address = localStr(contact.address, locale)

  const socialLinks = SOCIAL_ORDER
    .map(({ key, label }) => ({ label, url: social[key] as string | undefined }))
    .filter((s): s is { label: string; url: string } => Boolean(s.url))

  const hasDetails = Boolean(email || phone || address || socialLinks.length)

  return (
    <>
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / Contact
          </p>
          <h1 style={{ color: 'white', fontSize: 36 }}>Get in Touch</h1>
        </div>
      </div>

      <section className="section section--white">
        <div className="container contact-grid">
          {/* Contact details */}
          {hasDetails && (
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {email && (
                <div>
                  <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 6 }}>Email</h3>
                  <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                    {email}
                  </a>
                </div>
              )}

              {phone && (
                <div>
                  <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 6 }}>Phone</h3>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                    {phone}
                  </a>
                </div>
              )}

              {address && (
                <div>
                  <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 6 }}>Address</h3>
                  <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{address}</p>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 8 }}>Follow us</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* Message form */}
          <div style={{ maxWidth: 680 }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
