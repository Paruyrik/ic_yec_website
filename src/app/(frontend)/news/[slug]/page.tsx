import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getLocale, localStr, type Locale } from '@/lib/locale'
import { formatPostDate, readingMinutes } from '@/lib/posts'
import { findPosts, toPostCard } from '@/lib/postsQuery'
import { CategoryBadge, PostCard } from '@/components/posts/PostCard'

type Params = { params: Promise<{ slug: string }> }

async function getPost(slug: string, locale: Locale) {
  const { docs } = await findPosts({ locale, where: { slug: { equals: slug } }, limit: 1 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return docs[0] as any | undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const post = await getPost(slug, locale)
  if (!post) return { title: 'Post not found | IC-YEC' }
  const title = localStr(post.title, locale)
  const description = localStr(post.excerpt, locale) || undefined
  const image = post.coverImage?.url as string | undefined
  return {
    title: `${title} | IC-YEC`,
    description,
    openGraph: { title, description, type: 'article', images: image ? [image] : undefined },
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const locale = await getLocale()
  const post = await getPost(slug, locale)
  if (!post) notFound()

  const title = localStr(post.title, locale) || 'Untitled'
  const excerpt = localStr(post.excerpt, locale)
  const coverUrl: string | null = post.coverImage?.url ?? null
  const coverAlt: string = post.coverImage?.alt || title
  const minutes = readingMinutes(post.content, excerpt)

  // "More news": latest posts in the same category, topped up with any recent posts.
  const [sameCategory, latest] = await Promise.all([
    findPosts({ locale, limit: 3, where: { and: [{ category: { equals: post.category } }, { id: { not_equals: post.id } }] } }),
    findPosts({ locale, limit: 4, where: { id: { not_equals: post.id } } }),
  ])
  const seen = new Set<string | number>()
  const related = [...sameCategory.docs, ...latest.docs]
    .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
    .slice(0, 3)
    .map((p) => toPostCard(p, locale))

  const shareUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/news/${post.slug}`
  const share = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { label: 'X',        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}` },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: coverUrl ? '52px 0 140px' : '52px 0 56px' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 18 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href="/news" style={{ color: 'inherit' }}>News</Link>
          </p>
          <div style={{ marginBottom: 16 }}><CategoryBadge category={post.category} /></div>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, lineHeight: 1.18 }}>
            {title}
          </h1>
          {excerpt && (
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: 1.6, marginTop: 16, maxWidth: 720 }}>
              {excerpt}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 22, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
            {post.author && <><span style={{ color: 'white', fontWeight: 500 }}>{post.author}</span><span aria-hidden>·</span></>}
            <time dateTime={post.publishedDate}>{formatPostDate(post.publishedDate)}</time>
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <article className="section section--white" style={{ paddingTop: coverUrl ? 0 : 56 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {coverUrl && (
            <div
              className="post-cover"
              style={{ marginTop: -100, marginBottom: 48, '--poster': `url(${coverUrl})` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={coverAlt} />
            </div>
          )}

          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {post.content ? (
              <div className="rich-text post-body">
                <RichText data={post.content} />
              </div>
            ) : null}

            {/* Share + back */}
            <div style={{
              marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <Link href="/news" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: 14 }}>
                ← All news
              </Link>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Share:</span>
                {share.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="filter-chip" style={{ padding: '6px 14px', fontSize: 13 }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── More news ────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-header__label">Keep reading</div>
                <h2 className="section-header__title">More news</h2>
              </div>
              <Link href="/news" className="section-header__link">All news →</Link>
            </div>
            <div className="grid-3">
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
