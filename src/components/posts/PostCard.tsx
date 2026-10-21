import React from 'react'
import Link from 'next/link'
import { formatPostDate, postCategory } from '@/lib/posts'

export interface PostCardData {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  category?: string | null
  publishedDate: string
  coverUrl?: string | null
  readMinutes?: number
}

export function CategoryBadge({ category }: { category?: string | null }) {
  const c = postCategory(category)
  return (
    <span className="badge" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

// Same uncropped "poster" frame as project cards, in a wider ratio (see styles.css).
function Poster({ url }: { url?: string | null }) {
  return (
    <div
      className={`card__poster post-card__media${url ? ' card__poster--image' : ''}`}
      style={url ? ({ '--poster': `url(${url})` } as React.CSSProperties) : undefined}
    >
      {!url && <div className="post-card__placeholder">IC-YEC</div>}
    </div>
  )
}

function Meta({ post }: { post: PostCardData }) {
  return (
    <div className="post-card__meta">
      <time dateTime={post.publishedDate}>{formatPostDate(post.publishedDate)}</time>
      {post.readMinutes ? <><span aria-hidden>·</span><span>{post.readMinutes} min read</span></> : null}
    </div>
  )
}

/** Standard grid card. */
export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/news/${post.slug}`} className="card post-card">
      <Poster url={post.coverUrl} />
      <div className="card__body">
        <div className="card__meta"><CategoryBadge category={post.category} /></div>
        <h3 className="card__title">{post.title}</h3>
        {post.excerpt && <p className="card__desc post-card__excerpt">{post.excerpt}</p>}
        <Meta post={post} />
      </div>
    </Link>
  )
}

/** Large horizontal card for the headline post on /news. */
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/news/${post.slug}`} className="card post-card post-card--featured">
      <Poster url={post.coverUrl} />
      <div className="card__body post-card--featured__body">
        <div className="card__meta">
          <span className="badge badge--purple">★ Featured</span>
          <CategoryBadge category={post.category} />
        </div>
        <h2 className="post-card--featured__title">{post.title}</h2>
        {post.excerpt && <p className="card__desc" style={{ fontSize: 16 }}>{post.excerpt}</p>}
        <Meta post={post} />
        <span className="card__link">Read the story →</span>
      </div>
    </Link>
  )
}
