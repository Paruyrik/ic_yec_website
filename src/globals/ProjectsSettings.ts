import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const ProjectsSettings: GlobalConfig = {
  slug: 'projects-settings',
  label: 'Projects - Map & Stats',
  admin: { group: 'Configuration' },
  fields: [
    {
      name: 'mapSection',
      type: 'group',
      label: 'Map Section',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Show map on Projects page' },
        { name: 'title', type: 'text', defaultValue: 'Where we work', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true, admin: { description: 'Short description shown below the map title.' } },
        {
          name: 'activeCountryColor',
          type: 'text',
          defaultValue: '#3D3785',
          admin: { description: 'Hex colour for countries that have projects (e.g. #3D3785).' },
        },
        {
          name: 'pinColor',
          type: 'text',
          defaultValue: '#E8A0A0',
          admin: { description: 'Hex colour for location pins on the map.' },
        },
      ],
    },
    {
      name: 'impactStats',
      type: 'group',
      label: 'Impact Statistics',
      admin: { description: 'Numbers shown in the stats bar above the map. Leave at 0 to hide.' },
      fields: [
        {
          name: 'stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "150+", "12", "5 years"' } },
            { name: 'label', type: 'text', required: true, localized: true, admin: { description: 'e.g. "Participants", "Countries reached"' } },
            { name: 'icon', type: 'text', admin: { description: 'Emoji or icon character (e.g. 🌍 👥 📋).' } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [({ global }) => { revalidateGlobal(global.slug) }],
  },
}
