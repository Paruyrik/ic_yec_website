import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: any) => Boolean(user)

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Contact Message', plural: 'Contact Messages' },
  admin: {
    group: 'Partnerships',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'],
    description: 'Messages submitted through the website contact form.',
  },
  access: {
    read:   isAdmin,
    create: () => true, // public - the contact form submits here
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    // ── Admin-only fields (sidebar) ───────────────────────────────────
    // The collection accepts public creates, so these are locked down at
    // field level too - otherwise anyone could POST a pre-triaged message
    // straight to /api/contact-messages.
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      access: { create: isAdmin, update: isAdmin },
      admin: { position: 'sidebar' },
      options: [
        { label: '🆕 New',      value: 'new' },
        { label: '👁 Read',     value: 'read' },
        { label: '📧 Replied',  value: 'replied' },
        { label: '🗄 Archived', value: 'archived' },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal notes',
      access: { create: isAdmin, update: isAdmin },
      admin: { position: 'sidebar', description: 'Only visible to admins.' },
    },
  ],
  timestamps: true,
}
