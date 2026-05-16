import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'country', 'projectName', 'featured', 'order'],
    group: 'Content',
  },
  access: {
    read:   () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'quote',       type: 'textarea', required: true, localized: true },
    { name: 'author',      type: 'text',     required: true },
    { name: 'age',         type: 'number',   admin: { description: 'Age at time of participation' } },
    { name: 'country',     type: 'text',     required: true },
    { name: 'projectName', type: 'text',     admin: { description: 'e.g. "Touch of the Art 2024"' } },
    { name: 'photo',       type: 'upload',   relationTo: 'media' },
    { name: 'featured',    type: 'checkbox', defaultValue: true,  admin: { position: 'sidebar' } },
    { name: 'order',       type: 'number',   defaultValue: 0,     admin: { position: 'sidebar', description: 'Lower = shown first' } },
  ],
}
