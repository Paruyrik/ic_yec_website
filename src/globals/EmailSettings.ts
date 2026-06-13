import type { GlobalConfig } from 'payload'

export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: 'Email Settings',
  admin: { group: 'System' },
  fields: [
    {
      name: 'emailOnAccept',
      type: 'checkbox',
      label: 'Send email to applicant on acceptance',
      defaultValue: true,
    },
    {
      name: 'emailOnReject',
      type: 'checkbox',
      label: 'Send email to applicant on rejection',
      defaultValue: false,
      admin: { description: 'Off by default - staff choose manually per decision' },
    },
    {
      name: 'emailOnWaitlist',
      type: 'checkbox',
      label: 'Send email to applicant when waitlisted',
      defaultValue: true,
    },
    {
      name: 'coordinatorEmail',
      type: 'email',
      label: 'Coordinator CC email',
      defaultValue: 'projects.icyec@gmail.com',
    },
  ],
}
