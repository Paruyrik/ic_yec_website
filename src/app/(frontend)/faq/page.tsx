import { getPayload } from 'payload'
import Link from 'next/link'
import config from '@/payload.config'
import { getLocale, localStr } from '@/lib/locale'
import { FaqAccordion } from '@/components/faq/FaqAccordion'

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  'application-process': { label: 'Application Process',  icon: '📝' },
  'erasmus-plus':        { label: 'Erasmus+ Programme',   icon: '🇪🇺' },
  'esc-volunteering':    { label: 'ESC Volunteering',      icon: '🤝' },
  'youth-exchanges':     { label: 'Youth Exchanges',       icon: '✈️' },
  'training-courses':    { label: 'Training Courses',      icon: '🎓' },
  'general':             { label: 'General',               icon: '💬' },
}

export const metadata = {
  title: 'FAQ — IC-YEC',
  description: 'Frequently asked questions about IC-YEC programmes, Erasmus+, and how to apply.',
}

export default async function FaqPage() {
  const locale  = await getLocale()
  const payload = await getPayload({ config: await config })

  const { docs } = await (payload.find as any)({
    collection: 'faqs',
    where:  { published: { equals: true } },
    sort:   'order',
    limit:  200,
    locale,
  }).catch(() => ({ docs: [] }))

  // Group by category preserving the order defined in CATEGORY_META
  const grouped = new Map<string, typeof docs>()
  for (const cat of Object.keys(CATEGORY_META)) grouped.set(cat, [])
  for (const faq of docs) {
    const cat = (faq as any).category ?? 'general'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(faq)
  }

  const nonEmpty = [...grouped.entries()].filter(([, items]) => items.length > 0)

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / FAQ
          </p>
          <h1 style={{ color: 'white', fontSize: 36 }}>Frequently Asked Questions</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, marginTop: 10, maxWidth: 520 }}>
            Everything you need to know about IC-YEC programmes, how to apply, and what to expect.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container">
          {nonEmpty.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
              No FAQs published yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, alignItems: 'start' }}>
              {/* Sticky sidebar navigation */}
              <nav style={{ position: 'sticky', top: 88 }}>
                <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                  Categories
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {nonEmpty.map(([cat]) => {
                    const meta = CATEGORY_META[cat] ?? { label: cat, icon: '❓' }
                    return (
                      <a
                        key={cat}
                        href={`#${cat}`}
                        className="faq-nav-link"
                      >
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </a>
                    )
                  })}
                </div>

                <div style={{ marginTop: 32, padding: '16px', background: 'var(--color-tint)', borderRadius: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', marginBottom: 6 }}>Still have questions?</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    We&apos;re happy to help.
                  </p>
                  <Link
                    href="/contact"
                    style={{
                      display: 'inline-block', marginTop: 10,
                      padding: '7px 14px', background: 'var(--color-primary)',
                      color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    Contact us →
                  </Link>
                </div>
              </nav>

              {/* FAQ sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                {nonEmpty.map(([cat, items]) => {
                  const meta = CATEGORY_META[cat] ?? { label: cat, icon: '❓' }
                  return (
                    <section key={cat} id={cat}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <span style={{ fontSize: 24 }}>{meta.icon}</span>
                        <h2 style={{ fontSize: 20, fontWeight: 500 }}>{meta.label}</h2>
                        <span style={{
                          marginLeft: 'auto', padding: '2px 10px', borderRadius: 100,
                          background: 'var(--color-tint)', color: 'var(--color-primary)',
                          fontSize: 12, fontWeight: 500,
                        }}>
                          {items.length}
                        </span>
                      </div>
                      <FaqAccordion
                        items={items.map((f: any) => ({
                          id:       f.id,
                          question: localStr(f.question, locale),
                          answer:   localStr(f.answer,   locale),
                        }))}
                      />
                    </section>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
