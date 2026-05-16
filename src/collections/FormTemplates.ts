import type { CollectionConfig } from 'payload'
import { FORM_FIELD_BLOCKS } from './OpenCalls'

export const FormTemplates: CollectionConfig = {
  slug: 'form-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'updatedAt'],
    group: 'Configuration',
  },
  access: {
    read:   ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Standard Youth Exchange", "ESC Volunteering"' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional note about when to use this template.' },
    },
    {
      name: 'formFields',
      type: 'blocks',
      blocks: FORM_FIELD_BLOCKS,
      admin: {
        description: 'Build the field set once here. Apply it to any open call via the "Apply template" option.',
        initCollapsed: true,
      },
    },
  ],
}
