import type { CollectionConfig } from 'payload'
import { revalidateCollection } from '@/lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'fundingSource', 'startDate'],
  },
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
      name: 'status',
      type: 'select',
      options: ['ongoing', 'completed', 'upcoming'],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'fundingSource',
      type: 'select',
      options: ['erasmus-plus', 'other-eu', 'national', 'private'],
    },
    {
      name: 'projectRole',
      type: 'select',
      options: [
        { label: 'Coordinated by IC-YEC', value: 'coordinator' },
        { label: 'Partnership project',   value: 'partner' },
      ],
      admin: {
        position: 'sidebar',
        description: 'IC-YEC\'s role — leave blank if not applicable.',
      },
    },
    {
      name: 'theme',
      type: 'select',
      hasMany: true,
      options: ['art', 'sport', 'emotional-intelligence', 'training', 'inclusion', 'digital', 'environment'],
    },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'participants', type: 'number', admin: { description: 'Total number of participants in this project.' } },
    { name: 'countries', type: 'array', fields: [{ name: 'country', type: 'text' }] },
    {
      name: 'mapPoints',
      type: 'array',
      admin: {
        description: 'Specific locations shown as pins on the interactive map.',
        initCollapsed: true,
      },
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'lat', type: 'number', required: true, admin: { description: 'Latitude (e.g. 40.1872)' } },
        { name: 'lng', type: 'number', required: true, admin: { description: 'Longitude (e.g. 44.5152)' } },
        { name: 'description', type: 'text', admin: { description: 'Shown in the map tooltip.' } },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'main-venue',
          options: [
            { label: 'Main venue', value: 'main-venue' },
            { label: 'Partner organisation', value: 'partner-org' },
            { label: 'Event location', value: 'event-location' },
          ],
        },
      ],
    },
    {
      name: 'outcomes',
      type: 'array',
      admin: { description: 'Key results and achievements of this project.', initCollapsed: true },
      fields: [
        { name: 'outcome', type: 'text', required: true },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      admin: { description: 'Participant quotes shown on the project page.', initCollapsed: true },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'country', type: 'text' },
      ],
    },
    { name: 'videoUrl', type: 'text', admin: { description: 'YouTube or Vimeo URL for the project video.' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Show on homepage featured section.', position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Display order — set 1 to show first, 2 for second, etc. Leave blank to sort by date.',
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'partners', type: 'relationship', relationTo: 'partners' as any, hasMany: true },
  ],
  hooks: {
    afterChange: [({ collection }) => { revalidateCollection(collection.slug) }],
    afterDelete: [({ collection }) => { revalidateCollection(collection.slug) }],
  },
}
