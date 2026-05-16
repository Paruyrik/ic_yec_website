import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'email', 'openCall', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'openCall', type: 'relationship', relationTo: 'open-calls' as any, required: true },
    { name: 'applicantName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'dateOfBirth', type: 'date', required: true },
    { name: 'motivationLetter', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'documents' as any },
    {
      // Dynamic answers — each entry maps one formField block to its submitted value.
      // The value is stored as a string; file uploads store the media document ID.
      // Array entries for checkbox groups use comma-separated values.
      name: 'answers',
      type: 'array',
      fields: [
        { name: 'blockType', type: 'text', admin: { readOnly: true } },
        { name: 'fieldLabel', type: 'text', admin: { readOnly: true } },
        { name: 'value', type: 'textarea', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Waitlisted', value: 'waitlisted' },
      ],
      defaultValue: 'pending',
    },
    { name: 'gdprConsent', type: 'checkbox', required: true },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes — not visible to applicant' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          // TODO: send confirmation email via Resend (see src/lib/email.ts)
        }
      },
    ],
  },
}
