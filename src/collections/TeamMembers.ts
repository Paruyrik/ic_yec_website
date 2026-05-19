import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'email', type: 'email' },
    { name: 'linkedin', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
