import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'website'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Partner',                   value: 'partner' },
        { label: 'Funder',                    value: 'funder' },
        { label: 'Network',                   value: 'network' },
        { label: 'Official Representative',   value: 'official-representative' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    { name: 'website', type: 'text', admin: { position: 'sidebar' } },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'representativeRole',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. "Official Armenian Representative" — shown as a badge on the About page.',
        condition: (data) => data?.type === 'official-representative',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short paragraph shown in the affiliations section on the About page.',
        condition: (data) => data?.type === 'official-representative',
      },
    },
  ],
}
