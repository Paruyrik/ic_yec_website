import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payloadClient'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NewsletterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload
    .getCachedCollection<'newsletters'>({
      collection: 'newsletters',
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  if (!docs.length) notFound()
  const nl = docs[0] as any

  const coverUrl: string | null = nl.coverImage?.url ?? null

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--color-primary)', padding: '52px 0 40px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href="/#newsletter" style={{ color: 'inherit' }}>Newsletter</Link>
            {' / '}{nl.issueName ?? fmt(nl.publishedDate)}
          </p>
          {nl.issueName && (
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 100,
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)',
              fontSize: 12, fontWeight: 600, marginBottom: 14,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {nl.issueName}
            </span>
          )}
          <h1 style={{ color: 'white', fontSize: 34, fontWeight: 500, maxWidth: 760, lineHeight: 1.2 }}>
            {nl.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 12 }}>
            {fmt(nl.publishedDate)}
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="section section--white">
        <div className="container" style={{ maxWidth: 760 }}>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={nl.title}
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 32, display: 'block' }}
            />
          )}

          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-line' }}>
            {nl.preview}
          </p>

          {nl.archiveUrl && (
            <div style={{ marginTop: 36 }}>
              <a
                href={nl.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', background: 'var(--color-primary)', color: 'white',
                  borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none',
                }}
              >
                Read the full update →
              </a>
            </div>
          )}

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
            <Link href="/#newsletter" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none', fontSize: 14 }}>
              ← Back to newsletter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
