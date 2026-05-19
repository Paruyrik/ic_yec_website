import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'published'],
    group: 'Content',
  },
  access: {
    read:   () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Plain text answer. Use double line-breaks for paragraphs.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Application Process',  value: 'application-process' },
        { label: 'Erasmus+ Programme',   value: 'erasmus-plus' },
        { label: 'ESC Volunteering',      value: 'esc-volunteering' },
        { label: 'Youth Exchanges',       value: 'youth-exchanges' },
        { label: 'Training Courses',      value: 'training-courses' },
        { label: 'General',               value: 'general' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first within a category.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
