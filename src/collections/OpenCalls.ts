import type { Block, CollectionConfig } from 'payload'

// ─── Form Field Blocks ────────────────────────────────────────────────────────
// To add a new field type:
//   1. Define a new Block object here and add it to FORM_FIELD_BLOCKS
//   2. Add a renderer to src/components/registration/fieldRegistry.tsx

const textFieldBlock: Block = {
  slug: 'textField',
  labels: { singular: 'Text Field', plural: 'Text Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'minLength', type: 'number' },
    { name: 'maxLength', type: 'number' },
  ],
}

const textareaFieldBlock: Block = {
  slug: 'textareaField',
  labels: { singular: 'Textarea Field', plural: 'Textarea Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'rows', type: 'number', defaultValue: 4 },
    { name: 'minLength', type: 'number' },
    { name: 'maxLength', type: 'number' },
  ],
}

const emailFieldBlock: Block = {
  slug: 'emailField',
  labels: { singular: 'Email Field', plural: 'Email Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
  ],
}

const phoneFieldBlock: Block = {
  slug: 'phoneField',
  labels: { singular: 'Phone Field', plural: 'Phone Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text', defaultValue: '+1 234 567 8900' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'international', type: 'checkbox', defaultValue: true },
  ],
}

const numberFieldBlock: Block = {
  slug: 'numberField',
  labels: { singular: 'Number Field', plural: 'Number Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'min', type: 'number' },
    { name: 'max', type: 'number' },
    { name: 'step', type: 'number', defaultValue: 1 },
    { name: 'unit', type: 'text', admin: { description: 'Label shown next to the input, e.g. "years"' } },
  ],
}

const dateFieldBlock: Block = {
  slug: 'dateField',
  labels: { singular: 'Date Field', plural: 'Date Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'minDate', type: 'date', admin: { description: 'Earliest selectable date' } },
    { name: 'maxDate', type: 'date', admin: { description: 'Latest selectable date' } },
  ],
}

const selectFieldBlock: Block = {
  slug: 'selectField',
  labels: { singular: 'Select / Dropdown Field', plural: 'Select Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'multiple', type: 'checkbox', defaultValue: false, admin: { description: 'Allow selecting more than one option' } },
    {
      name: 'options',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}

const radioFieldBlock: Block = {
  slug: 'radioField',
  labels: { singular: 'Radio Button Field', plural: 'Radio Button Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}

const checkboxFieldBlock: Block = {
  slug: 'checkboxField',
  labels: { singular: 'Checkbox (single agreement)', plural: 'Checkbox Fields' },
  fields: [
    { name: 'label', type: 'text', required: true, admin: { description: 'Checkbox label / agreement text' } },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
  ],
}

const checkboxGroupFieldBlock: Block = {
  slug: 'checkboxGroupField',
  labels: { singular: 'Checkbox Group (multiple)', plural: 'Checkbox Groups' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false, admin: { description: 'Require at least one selection' } },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}

const fileFieldBlock: Block = {
  slug: 'fileField',
  labels: { singular: 'File Upload Field', plural: 'File Upload Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'accept', type: 'text', defaultValue: '.pdf,.doc,.docx', admin: { description: 'Comma-separated file extensions' } },
    { name: 'maxSizeMB', type: 'number', defaultValue: 5 },
    { name: 'multiple', type: 'checkbox', defaultValue: false },
  ],
}

const urlFieldBlock: Block = {
  slug: 'urlField',
  labels: { singular: 'URL Field', plural: 'URL Fields' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'placeholder', type: 'text', defaultValue: 'https://' },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
  ],
}

const countryFieldBlock: Block = {
  slug: 'countryField',
  labels: { singular: 'Country Selector', plural: 'Country Selectors' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'helpText', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'multiple', type: 'checkbox', defaultValue: false },
  ],
}

const headingFieldBlock: Block = {
  slug: 'headingField',
  labels: { singular: 'Section Heading', plural: 'Section Headings' },
  fields: [
    { name: 'text', type: 'text', required: true },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ],
      defaultValue: 'h3',
    },
  ],
}

const paragraphFieldBlock: Block = {
  slug: 'paragraphField',
  labels: { singular: 'Instruction / Paragraph', plural: 'Instruction Paragraphs' },
  fields: [
    { name: 'text', type: 'textarea', required: true },
  ],
}

const dividerFieldBlock: Block = {
  slug: 'dividerField',
  labels: { singular: 'Divider', plural: 'Dividers' },
  fields: [],
}

// All available form field blocks — add new ones here
export const FORM_FIELD_BLOCKS: Block[] = [
  textFieldBlock,
  textareaFieldBlock,
  emailFieldBlock,
  phoneFieldBlock,
  numberFieldBlock,
  dateFieldBlock,
  selectFieldBlock,
  radioFieldBlock,
  checkboxFieldBlock,
  checkboxGroupFieldBlock,
  fileFieldBlock,
  urlFieldBlock,
  countryFieldBlock,
  headingFieldBlock,
  paragraphFieldBlock,
  dividerFieldBlock,
]

// ─── Collection Config ────────────────────────────────────────────────────────

export const OpenCalls: CollectionConfig = {
  slug: 'open-calls',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'deadline', 'status'],
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
      name: 'type',
      type: 'select',
      options: ['youth-exchange', 'training-course', 'esc-volunteering', 'seminar', 'other'],
      required: true,
    },
    { name: 'deadline', type: 'date', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['open', 'closed', 'archived'],
      defaultValue: 'open',
      admin: { position: 'sidebar' },
    },
    { name: 'location', type: 'text', localized: true },
    {
      name: 'dates',
      type: 'group',
      fields: [
        { name: 'from', type: 'date' },
        { name: 'to', type: 'date' },
      ],
    },
    {
      name: 'eligibility',
      type: 'group',
      fields: [
        { name: 'ageMin', type: 'number', defaultValue: 18 },
        { name: 'ageMax', type: 'number', defaultValue: 30 },
        { name: 'countries', type: 'array', fields: [{ name: 'country', type: 'text' }] },
        { name: 'spotsAvailable', type: 'number' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'formFields',
      type: 'blocks',
      blocks: FORM_FIELD_BLOCKS,
      admin: {
        description: 'Dynamic form fields shown in the registration form. Add, reorder, or remove fields freely.',
        initCollapsed: true,
      },
    },
    { name: 'registrationEnabled', type: 'checkbox', defaultValue: true },
    {
      // Selecting a template and saving stamps its formFields into this open call.
      // The field is cleared after the hook runs — it's a one-time "copy" action.
      name: 'applyTemplate',
      type: 'relationship',
      relationTo: 'form-templates' as any,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Pick a template to copy its fields into "Form Fields" on save. Clears automatically after applying.',
        condition: (data) => !data?.formFields?.length,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        const templateId = data?.applyTemplate
        if (!templateId) return data

        // Fetch the template and stamp its formFields
        const template = await req.payload.findByID({
          collection: 'form-templates' as any,
          id: typeof templateId === 'object' ? templateId.id : templateId,
          depth: 1,
        })

        if (template?.formFields?.length) {
          data.formFields = template.formFields
        }

        // Clear the relationship so it doesn't re-apply on subsequent saves
        data.applyTemplate = null

        return data
      },
    ],
  },
}
