// Server-only helpers for loading posts and shaping them for <PostCard>.

import type { Where } from 'payload'
import type { PostCardData } from '@/components/posts/PostCard'
import { getPayloadClient } from '@/lib/payloadClient'
import { localStr, type Locale } from '@/lib/locale'
import { readingMinutes } from '@/lib/posts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPostCard(p: any, locale: Locale): PostCardData {
  const excerpt = localStr(p.excerpt, locale)
  return {
    id: p.id,
    slug: p.slug,
    title: localStr(p.title, locale) || 'Untitled',
    excerpt,
    category: p.category,
    publishedDate: p.publishedDate,
    coverUrl: typeof p.coverImage === 'object' ? p.coverImage?.url ?? null : null,
    readMinutes: readingMinutes(p.content, excerpt),
  }
}

export async function findPosts(opts: {
  locale: Locale
  where?: Where
  limit?: number
  page?: number
  sort?: string
}) {
  const payload = await getPayloadClient()
  return payload
    .getCachedCollection<'posts'>({
      collection: 'posts',
      where: { and: [{ published: { equals: true } }, ...(opts.where ? [opts.where] : [])] },
      sort: opts.sort ?? '-publishedDate',
      limit: opts.limit ?? 12,
      page: opts.page ?? 1,
      depth: 1,
      locale: opts.locale,
    })
    .catch(() => ({ docs: [], totalDocs: 0, totalPages: 0, page: 1 }))
}
