import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payloadClient'
import { getLocale, localStr } from '@/lib/locale'

type FooterLink = { label: string; url: string; external?: boolean }
type FooterColumn = { heading: string; links: FooterLink[] }

// Built-in defaults — used when the CMS footer columns are left empty.
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: 'Organisation',
    links: [
      { label: 'About IC-YEC', url: '/about' },
      { label: 'Our Projects', url: '/projects' },
      { label: 'Team', url: '/about#team' },
    ],
  },
  {
    heading: 'Programmes',
    links: [
      { label: 'Open Calls', url: '/open-calls' },
      { label: 'Youth Exchanges', url: '/open-calls?type=youth-exchange' },
      { label: 'ESC Volunteering', url: '/open-calls?type=esc-volunteering' },
      { label: 'Training Courses', url: '/open-calls?type=training-course' },
    ],
  },
  {
    heading: 'Connect',
    links: [{ label: 'Contact Us', url: '/contact' }],
  },
]

const DEFAULT_TAGLINE =
  'International Center for Youth Empowerment Cooperation - supporting non-formal ' +
  'education and youth mobility through art, sport, digital skills, and intercultural exchange.'

// Order + labels for the social links group.
const SOCIAL_ORDER: { key: string; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook',  label: 'Facebook' },
  { key: 'linkedin',  label: 'LinkedIn' },
  { key: 'youtube',   label: 'YouTube' },
  { key: 'tiktok',    label: 'TikTok' },
]

export async function Footer() {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const settings = (await payload
    .getCachedGlobal({ slug: 'site-settings' as any })
    .catch(() => null)) as any

  const contact = settings?.contact ?? {}
  const footerCfg = settings?.footer ?? {}
  const social = contact.social ?? {}

  const tagline = localStr(footerCfg.tagline, locale) || DEFAULT_TAGLINE
  const email: string | null = contact.email ?? null

  // Use CMS columns if any are configured, otherwise the built-in defaults.
  const cmsColumns = (footerCfg.columns ?? []).filter((c: any) => localStr(c?.heading, locale))
  const columns: FooterColumn[] = cmsColumns.length
    ? cmsColumns.map((c: any) => ({
        heading: localStr(c.heading, locale),
        links: (c.links ?? []).map((l: any) => ({
          label: localStr(l.label, locale),
          url: l.url as string,
          external: Boolean(l.external),
        })),
      }))
    : DEFAULT_COLUMNS

  // Only show social links that actually have a URL set.
  const socialLinks = SOCIAL_ORDER
    .map(({ key, label }) => ({ label, url: social[key] as string | undefined }))
    .filter((s): s is { label: string; url: string } => Boolean(s.url))

  return (
    <footer style={{ background: 'var(--color-dark)', color: 'rgba(255,255,255,0.75)', paddingTop: 60, paddingBottom: 32 }}>
      <div className="container">
        {/* Top row */}
        <div className="footer-grid">
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Image
                src="/white-logo.png"
                alt="IC-YEC"
                width={40}
                height={40}
                style={{ width: 40, height: 40, objectFit: 'contain' }}
              />
              <span style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>IC-YEC</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 260 }}>{tagline}</p>

            {email && (
              <a href={`mailto:${email}`} className="footer-link" style={{ fontSize: 13 }}>
                ✉ {email}
              </a>
            )}

            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    style={{ fontSize: 13 }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: 'white', fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{column.heading}</span>
              {column.links.map((link) => (
                <Link
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  className="footer-link"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} IC-YEC. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Official representative of{' '}
            <a
              href="https://masterpeace.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500 }}
            >
              Masterpeace
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
