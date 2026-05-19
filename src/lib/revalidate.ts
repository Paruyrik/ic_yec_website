import { revalidateTag } from 'next/cache'

export function revalidateCollection(slug: string) {
  revalidateTag(`collection-${slug}`, 'default')
}

export function revalidateGlobal(slug: string) {
  revalidateTag(`globals-${slug}`, 'default')
}
