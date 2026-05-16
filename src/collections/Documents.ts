import type { CollectionConfig } from 'payload'

// Private file storage for applicant CVs and other sensitive documents.
// Read access is restricted to authenticated admins only.
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
  },
  access: {
    read:   ({ req }) => Boolean(req.user),
    create: () => true,           // applicants upload via the public registration form
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
}
