import { revalidateTag } from 'next/cache'

export function revalidateCollection(slug: string) {
  try {
    revalidateTag(`collection-${slug}`, 'default')
  } catch {
    // no-op: revalidateTag is only valid inside a Next.js request context
  }
}

export function revalidateGlobal(slug: string) {
  try {
    revalidateTag(`globals-${slug}`, 'default')
  } catch {
    // no-op: revalidateTag is only valid inside a Next.js request context
  }
}
