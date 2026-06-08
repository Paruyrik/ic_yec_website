'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/projects',   label: 'Projects' },
  { href: '/open-calls', label: 'Open Calls' },
  { href: '/about',      label: 'About' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/contact',    label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header style={{
        background: 'var(--color-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(26,24,51,0.18)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
            <Image
              src="/white-logo.png"
              alt="IC-YEC"
              width={44}
              height={44}
              priority
              style={{ width: 44, height: 44, objectFit: 'contain' }}
            />
            <span style={{ color: 'white', fontWeight: 500, fontSize: 17, letterSpacing: '0.01em' }}>IC-YEC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
            <Link href="/open-calls" className="btn btn-primary" style={{ marginLeft: 8, padding: '8px 18px', fontSize: 13 }}>
              Apply Now
            </Link>
          </nav>

          {/* Hamburger button (mobile only) */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              /* X icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div className={`mobile-nav-overlay${open ? ' open' : ''}`}>
        {/* Header row inside overlay */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/white-logo.png" alt="IC-YEC" width={36} height={36} style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <span style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>IC-YEC</span>
          </Link>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ marginTop: 32 }}>
          <Link
            href="/open-calls"
            style={{
              display: 'block', textAlign: 'center',
              padding: '16px 24px',
              background: 'var(--color-accent)',
              color: 'white',
              borderRadius: 12,
              fontWeight: 600, fontSize: 16,
              textDecoration: 'none',
            }}
          >
            Apply Now →
          </Link>
        </div>
      </div>
    </>
  )
}
