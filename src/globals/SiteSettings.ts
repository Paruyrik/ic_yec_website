import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Configuration' },
  fields: [

    // ── Application timeline ─────────────────────────────────────────────────
    {
      name: 'timeline',
      type: 'group',
      label: 'Application Timeline',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'title', type: 'text', defaultValue: 'What happens after you apply', localized: true },
        {
          name: 'steps',
          type: 'array',
          admin: { description: 'Steps shown in the "after you apply" timeline.' },
          fields: [
            { name: 'icon',        type: 'text', admin: { description: 'Emoji (e.g. 📝 🔍 ✉️ ✈️ 🎓)' } },
            { name: 'title',       type: 'text', required: true, localized: true },
            { name: 'description', type: 'textarea', localized: true },
            { name: 'duration',    type: 'text', admin: { description: 'e.g. "~2 weeks"' } },
          ],
        },
      ],
    },

    // ── Erasmus+ explainer ───────────────────────────────────────────────────
    {
      name: 'erasmusExplainer',
      type: 'group',
      label: 'Erasmus+ Explainer Block',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'title',    type: 'text', defaultValue: 'New to Erasmus+?', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'question', type: 'text',     required: true, localized: true },
            { name: 'answer',   type: 'textarea', required: true, localized: true },
          ],
        },
      ],
    },

    // ── Partner portal ───────────────────────────────────────────────────────
    {
      name: 'partnerPortal',
      type: 'group',
      label: 'Partner Portal Page',
      fields: [
        { name: 'enabled',      type: 'checkbox', defaultValue: true },
        { name: 'title',        type: 'text', defaultValue: 'Partner with IC-YEC', localized: true },
        { name: 'subtitle',     type: 'textarea', localized: true },
        { name: 'pifUrl',       type: 'text', admin: { description: 'Direct URL to the Partner Information Form (PDF or Google Form).' } },
        { name: 'contactEmail', type: 'email', admin: { description: 'Partnership inquiry email (pre-fills mailto link).' } },
        {
          name: 'types',
          label: 'Partnership types',
          type: 'array',
          admin: { description: 'List the types of partnerships you offer.' },
          fields: [
            { name: 'icon',        type: 'text' },
            { name: 'title',       type: 'text', required: true, localized: true },
            { name: 'description', type: 'textarea', localized: true },
          ],
        },
        {
          name: 'requirements',
          type: 'array',
          admin: { description: 'What IC-YEC requires from partner organisations.' },
          fields: [
            { name: 'item', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },

    // ── Newsletter settings ──────────────────────────────────────────────────
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter Section',
      fields: [
        { name: 'enabled',      type: 'checkbox', defaultValue: true },
        { name: 'title',        type: 'text', defaultValue: 'Stay in the loop', localized: true },
        { name: 'subtitle',     type: 'textarea', localized: true },
        { name: 'signupUrl',    type: 'text', admin: { description: 'Mailchimp / Brevo / Google Form signup link.' } },
        { name: 'buttonLabel',  type: 'text', defaultValue: 'Subscribe', localized: true },
        { name: 'showArchive',  type: 'checkbox', defaultValue: true, admin: { description: 'Show last 3 newsletters below the signup form.' } },
      ],
    },

    // ── Live badge settings ──────────────────────────────────────────────────
    {
      name: 'badgeSettings',
      type: 'group',
      label: 'Live & Urgency Badges',
      fields: [
        { name: 'urgentDaysThreshold', type: 'number', defaultValue: 7, admin: { description: 'Open calls closing within this many days show a pulsing urgency badge.' } },
        { name: 'showLiveBadge',       type: 'checkbox', defaultValue: true, admin: { description: 'Show a "● Live" badge on projects currently running.' } },
      ],
    },

    // ── Interactive map ──────────────────────────────────────────────────────
    {
      name: 'mapConfig',
      type: 'group',
      label: 'Interactive Map',
      admin: { description: 'Configure the dark partner map shown on the home and projects pages.' },
      fields: [
        {
          name: 'activeCountryColor',
          type: 'text',
          defaultValue: '#3D3785',
          admin: { description: 'Hex color used to highlight partner countries on the map.' },
        },
        {
          name: 'homeCityColor',
          type: 'text',
          defaultValue: '#E8A0A0',
          admin: { description: 'Hex color for the IC-YEC headquarters dot (home city).' },
        },
        {
          name: 'partnerCityColor',
          type: 'text',
          defaultValue: '#8B85E8',
          admin: { description: 'Hex color for partner city dots.' },
        },
        {
          name: 'cities',
          type: 'array',
          admin: { description: 'Partner cities displayed as pulsing dots. Leave empty to use the built-in default list.' },
          fields: [
            { name: 'city',    type: 'text',     required: true },
            { name: 'country', type: 'text',     required: true },
            { name: 'lat',     type: 'number',   required: true, admin: { description: 'Latitude (e.g. 40.18)' } },
            { name: 'lng',     type: 'number',   required: true, admin: { description: 'Longitude (e.g. 44.51)' } },
            { name: 'isHome',  type: 'checkbox', defaultValue: false, admin: { description: 'Mark as IC-YEC HQ / home city' } },
          ],
        },
      ],
    },

    // ── Theme impact stats (overrides auto-calculated values) ────────────────
    {
      name: 'themeImpact',
      type: 'group',
      label: 'Theme Impact Stats',
      admin: { description: 'Per-theme breakdown shown on the Projects page. Leave blank to hide a theme.' },
      fields: [
        {
          name: 'themes',
          type: 'array',
          fields: [
            {
              name: 'theme',
              type: 'select',
              required: true,
              options: [
                { label: 'Art',                    value: 'art' },
                { label: 'Sport',                  value: 'sport' },
                { label: 'Emotional Intelligence', value: 'emotional-intelligence' },
                { label: 'Training',               value: 'training' },
                { label: 'Inclusion',              value: 'inclusion' },
                { label: 'Digital',                value: 'digital' },
                { label: 'Environment',            value: 'environment' },
              ],
            },
            { name: 'projectCount',     type: 'text', admin: { description: 'e.g. "12 projects"' } },
            { name: 'participantCount', type: 'text', admin: { description: 'e.g. "200+ youth"' } },
            { name: 'countriesCount',   type: 'text', admin: { description: 'e.g. "8 countries"' } },
            { name: 'icon',             type: 'text', admin: { description: 'Emoji icon' } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [({ global }) => { revalidateGlobal(global.slug) }],
  },
}
