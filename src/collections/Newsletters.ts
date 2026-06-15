import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issueName', 'publishedDate', 'published'],
    group: 'Content',
  },
  access: {
    read:   () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title',         type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '@/components/admin/SlugField',
            exportName: 'SlugField',
          },
        },
      },
    },
    { name: 'issueName',     type: 'text', admin: { description: 'e.g. "Spring 2024", "Issue #3"' } },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'preview',       type: 'textarea', required: true, admin: { description: 'Short summary shown in the archive preview (2–3 sentences).' } },
    { name: 'archiveUrl',    type: 'text', admin: { description: 'Link to full newsletter (Mailchimp archive, PDF, etc.)' } },
    { name: 'coverImage',    type: 'upload', relationTo: 'media' },
    { name: 'published',     type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
