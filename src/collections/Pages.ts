import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText', localized: true },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
