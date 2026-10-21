import Link from 'next/link'
import type { Where } from 'payload'
import { getLocale } from '@/lib/locale'
import { POST_CATEGORIES } from '@/lib/posts'
import { findPosts, toPostCard } from '@/lib/postsQuery'
import { FeaturedPostCard, PostCard } from '@/components/posts/PostCard'

export const metadata = {
  title: 'News & Stories | IC-YEC',
  description: 'Latest news, events and stories from IC-YEC projects in Armenia and across Europe.',
}

const LIMIT = 9

function pageHref(category: string, page: number) {
  const qs = new URLSearchParams()
  if (category) qs.set('category', category)
  if (page > 1) qs.set('page', String(page))
  const s = qs.toString()
  return s ? `/news?${s}` : '/news'
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const rawCategory = typeof sp.category === 'string' ? sp.category : ''
  const category = POST_CATEGORIES.some((c) => c.value === rawCategory) ? rawCategory : ''
  const page = Math.max(1, Number(sp.page) || 1)
  const locale = await getLocale()

  // On the unfiltered first page, lead with a big headline post: the most
  // recent one marked "featured", or simply the most recent post.
  const showHeadline = !category && page === 1
  const pinned = showHeadline
    ? (await findPosts({ locale, where: { featured: { equals: true } }, limit: 1 })).docs[0]
    : undefined

  const filters: Where[] = [
    ...(category ? [{ category: { equals: category } }] : []),
    ...(pinned ? [{ id: { not_equals: pinned.id } }] : []),
  ]
  const { docs, totalPages } = await findPosts({
    locale,
    limit: LIMIT,
    page,
    where: filters.length ? { and: filters } : undefined,
  })

  const headline = showHeadline ? (pinned ?? docs[0]) : undefined
  const grid = docs.filter((p) => p.id !== headline?.id).map((p) => toPostCard(p, locale))
  const isEmpty = !headline && grid.length === 0

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-primary)', padding: '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.08)', top: -180, right: -60 }} />
          <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.06)', bottom: -140, left: '30%' }} />
        </div>
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>{' / '}News
          </p>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 600, lineHeight: 1.15, maxWidth: 680 }}>
            News &amp; <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>stories</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, lineHeight: 1.6, marginTop: 14, maxWidth: 560 }}>
            What&rsquo;s happening at IC-YEC - project highlights, upcoming events and
            stories from young people across Armenia and Europe.
          </p>
        </div>
      </section>

      <section className="section section--tint" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* ── Category filter ─────────────────────────────────────────── */}
          <nav aria-label="Filter by category" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {[{ value: '', label: 'All' }, ...POST_CATEGORIES].map((c) => (
              <Link
                key={c.value || 'all'}
                href={pageHref(c.value, 1)}
                className={`filter-chip${category === c.value ? ' filter-chip--active' : ''}`}
                aria-current={category === c.value ? 'page' : undefined}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          {isEmpty ? (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>📰</div>
              <h2 style={{ fontSize: 20, marginBottom: 6 }}>No posts yet</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
                {category ? 'Nothing in this category yet - try another one.' : 'Check back soon for news and stories.'}
              </p>
            </div>
          ) : (
            <>
              {headline && (
                <div style={{ marginBottom: 32 }}>
                  <FeaturedPostCard post={toPostCard(headline, locale)} />
                </div>
              )}

              {grid.length > 0 && (
                <div className="grid-3">
                  {grid.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}

              {/* ── Pagination ──────────────────────────────────────────── */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
                  {page > 1 ? (
                    <Link href={pageHref(category, page - 1)} className="btn btn-outline-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
                      ← Newer
                    </Link>
                  ) : <span />}
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link href={pageHref(category, page + 1)} className="btn btn-outline-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
                      Older →
                    </Link>
                  ) : <span />}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
