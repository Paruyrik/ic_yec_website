import Link from 'next/link'

export default function ContactPage() {
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
        <div className="container" style={{ maxWidth: 680 }}>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

// Client form lives in a separate component so the page can be a Server Component
import ContactForm from './ContactForm'
