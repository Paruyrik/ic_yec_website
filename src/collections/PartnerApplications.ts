import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: any) => Boolean(user)

export const PartnerApplications: CollectionConfig = {
  slug: 'partner-applications',
  labels: { singular: 'Partner Application', plural: 'Partner Applications' },
  admin: {
    group: 'Partnerships',
    useAsTitle: 'orgName',
    defaultColumns: ['orgName', 'contactName', 'country', 'status', 'createdAt'],
    description: 'Organisations that have submitted a partnership request via the website.',
  },
  access: {
    read:   isAdmin,
    create: () => true,  // public - the form submits here
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // ── Organisation info ─────────────────────────────────────────────
    {
      name: 'orgName',
      type: 'text',
      label: 'Organisation Name',
      required: true,
    },
    {
      name: 'orgType',
      type: 'select',
      label: 'Type of Organisation',
      required: true,
      options: [
        { label: 'Youth NGO / Association',          value: 'youth-ngo' },
        { label: 'School / University',              value: 'school' },
        { label: 'Youth Centre',                     value: 'youth-centre' },
        { label: 'Cultural Organisation',            value: 'cultural' },
        { label: 'Municipality / Public Authority',  value: 'municipality' },
        { label: 'Other',                            value: 'other' },
      ],
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website (optional)',
    },
    // ── Contact person ────────────────────────────────────────────────
    {
      name: 'contactName',
      type: 'text',
      label: 'Contact Person',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'contactRole',
      type: 'text',
      label: 'Role / Title (optional)',
    },
    // ── Partnership interest ──────────────────────────────────────────
    {
      name: 'projectInterests',
      type: 'select',
      label: 'Project types interested in',
      hasMany: true,
      required: true,
      options: [
        { label: 'Youth Exchange',     value: 'youth-exchange' },
        { label: 'Training Course',    value: 'training-course' },
        { label: 'ESC Volunteering',   value: 'esc-volunteering' },
        { label: 'Seminar / Event',    value: 'seminar' },
        { label: 'Other / Not sure',   value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'About your organisation & partnership idea',
      required: true,
      admin: { description: 'Tell us about your organisation and what kind of collaboration you have in mind.' },
    },
    {
      name: 'howHeard',
      type: 'text',
      label: 'How did you hear about IC-YEC?',
    },
    // ── Admin-only fields (sidebar) ───────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: '🆕 New',       value: 'new' },
        { label: '👁 Reviewing', value: 'reviewing' },
        { label: '📧 Contacted', value: 'contacted' },
        { label: '✅ Approved',  value: 'approved' },
        { label: '❌ Declined',  value: 'declined' },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal notes',
      admin: { position: 'sidebar', description: 'Only visible to admins.' },
    },
  ],
  timestamps: true,
}
