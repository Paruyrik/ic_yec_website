import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'
import { POST_CATEGORIES } from '@/lib/posts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'featured', 'published'],
    group: 'Content',
    description: 'News and blog posts shown on /news and in the "Latest news" section of the homepage.',
  },
  access: {
    read:   () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-publishedDate',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
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
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short summary shown on post cards (1–2 sentences).' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown on cards and at the top of the post. Posters are shown uncropped.' },
    },
    { name: 'content', type: 'richText', localized: true },

    // ── Sidebar ──────────────────────────────────────────────────────────────
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: POST_CATEGORIES.map(({ value, label }) => ({ value, label })),
      admin: { position: 'sidebar' },
    },
    { name: 'author', type: 'text', admin: { position: 'sidebar', description: 'Optional, e.g. "IC-YEC Team"' } },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pin as the big headline post on /news.' },
    },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to hide from the website.' } },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
