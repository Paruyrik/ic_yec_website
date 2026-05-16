import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/projects',   label: 'Projects' },
  { href: '/open-calls', label: 'Open Calls' },
  { href: '/about',      label: 'About' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/contact',    label: 'Contact' },
]

export function Header() {
  return (
    <header style={{
      background: 'var(--color-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(26,24,51,0.18)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo / wordmark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
          <Image
            src="/logo-white.svg"
            alt="IC-YEC"
            width={36}
            height={44}
            priority
            style={{ width: 36, height: 'auto' }}
          />
          <span style={{ color: 'white', fontWeight: 500, fontSize: 17, letterSpacing: '0.01em' }}>IC-YEC</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="/open-calls" className="btn btn-primary" style={{ marginLeft: 8, padding: '8px 18px', fontSize: 13 }}>
            Apply Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
