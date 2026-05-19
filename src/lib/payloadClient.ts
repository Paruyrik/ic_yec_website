import { unstable_cache } from 'next/cache'
import type { CollectionSlug, GlobalSlug, PaginatedDocs, Payload, TypedCollection, TypedGlobal } from 'payload'
import { getPayload } from 'payload'

import config from '@/payload.config'

export type FindCollectionOptions = Parameters<Payload['find']>[0]
export type FindGlobalOptions = Parameters<Payload['findGlobal']>[0]

export type ExtendedPayload = Payload & {
  getCachedGlobal: <T extends GlobalSlug>(opts: FindGlobalOptions) => Promise<TypedGlobal[T]>
  getCachedCollection: <T extends CollectionSlug>(opts: FindCollectionOptions) => Promise<PaginatedDocs<TypedCollection[T]>>
}

let payloadInstance: Payload | null = null

export async function getPayloadClient(): Promise<ExtendedPayload> {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config: await config })
  }

  const extended = payloadInstance as ExtendedPayload

  extended.getCachedGlobal = async function <T extends GlobalSlug>(opts: FindGlobalOptions) {
    const cached = unstable_cache(
      async () => payloadInstance!.findGlobal(opts) as Promise<TypedGlobal[T]>,
      ['globals', JSON.stringify(opts)],
      { tags: [`globals-${opts.slug}`] },
    )
    return cached()
  }

  extended.getCachedCollection = async function <T extends CollectionSlug>(opts: FindCollectionOptions) {
    const cached = unstable_cache(
      async () => payloadInstance!.find(opts) as Promise<PaginatedDocs<TypedCollection[T]>>,
      ['collection', JSON.stringify(opts)],
      { tags: [`collection-${opts.collection}`] },
    )
    return cached()
  }

  return extended
}
