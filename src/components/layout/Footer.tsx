import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = {
  Organisation: [
    { href: '/about', label: 'About IC-YEC' },
    { href: '/projects', label: 'Our Projects' },
    { href: '/about#team', label: 'Team' },
  ],
  Programmes: [
    { href: '/open-calls', label: 'Open Calls' },
    { href: '/open-calls?type=youth-exchange', label: 'Youth Exchanges' },
    { href: '/open-calls?type=esc-volunteering', label: 'ESC Volunteering' },
    { href: '/open-calls?type=training-course', label: 'Training Courses' },
  ],
  Connect: [
    { href: '/contact', label: 'Contact Us' },
    { href: 'https://instagram.com', label: 'Instagram', external: true },
    { href: 'https://facebook.com', label: 'Facebook', external: true },
  ],
}

export function Footer() {
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
            <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 260 }}>
              International Center for Youth Empowerment Cooperation — supporting non-formal
              education and youth mobility through art, sport, digital skills, and intercultural exchange.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: 'white', fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{heading}</span>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  {...('external' in link && link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
