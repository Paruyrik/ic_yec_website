import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Configuration' },
  fields: [

    // ── Contact & social ─────────────────────────────────────────────────────
    {
      name: 'contact',
      type: 'group',
      label: 'Contact & Social',
      admin: { description: 'Contact details and social links shown in the footer and on the Contact page.' },
      fields: [
        { name: 'email',   type: 'email', admin: { description: 'Main contact email (shown on the Contact page and in the footer).' } },
        { name: 'phone',   type: 'text',  admin: { description: 'Phone number, e.g. +374 00 000 000.' } },
        { name: 'address', type: 'textarea', localized: true, admin: { description: 'Postal address shown on the Contact page.' } },
        {
          name: 'social',
          type: 'group',
          label: 'Social links',
          admin: { description: 'Paste the full profile URL. Leave a field blank to hide that link.' },
          fields: [
            { name: 'instagram', type: 'text', admin: { description: 'e.g. https://instagram.com/ic.yec' } },
            { name: 'facebook',  type: 'text', admin: { description: 'Full profile URL.' } },
            { name: 'linkedin',  type: 'text', admin: { description: 'Full profile URL.' } },
            { name: 'youtube',   type: 'text', admin: { description: 'Full channel URL.' } },
            { name: 'tiktok',    type: 'text', admin: { description: 'Full profile URL.' } },
          ],
        },
      ],
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      admin: { description: 'Footer tagline and navigation columns.' },
      fields: [
        {
          name: 'tagline',
          type: 'textarea',
          localized: true,
          admin: { description: 'Short paragraph under the logo. Leave blank to use the default.' },
        },
        {
          name: 'columns',
          type: 'array',
          label: 'Link columns',
          admin: { description: 'Footer navigation columns. Leave empty to use the built-in defaults.' },
          fields: [
            { name: 'heading', type: 'text', required: true, localized: true },
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label',    type: 'text', required: true, localized: true },
                { name: 'url',      type: 'text', required: true, admin: { description: 'Internal path (e.g. /about) or full URL.' } },
                { name: 'external', type: 'checkbox', defaultValue: false, admin: { description: 'Open in a new tab.' } },
              ],
            },
          ],
        },
      ],
    },

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

    // ── About page content ───────────────────────────────────────────────────
    {
      name: 'aboutPage',
      type: 'group',
      label: 'About Page',
      admin: { description: 'All editable text on the /about page.' },
      fields: [
        // Hero
        { name: 'heroTitle',    type: 'text', defaultValue: 'International Center for Youth Empowerment Cooperation' },
        { name: 'heroSubtitle', type: 'textarea', defaultValue: 'We are an Armenian youth NGO dedicated to creating spaces where young people from different countries meet, learn from each other, and return home with the skills and motivation to drive change in their own communities.' },
        // Our Story
        { name: 'storyHeading',    type: 'text', defaultValue: 'From a small team in Yerevan to a European network' },
        { name: 'storyParagraph1', type: 'textarea', defaultValue: 'IC-YEC was founded in 2018 by a group of young Armenians who had participated in Erasmus+ exchanges and came back with a conviction: that non-formal learning across borders is one of the most powerful tools for personal growth that exists. They wanted to make that experience available to more young people in Armenia - and to put Armenian youth on the European map.' },
        { name: 'storyParagraph2', type: 'textarea', defaultValue: 'Over the following years we built a network of partner organisations across Europe and the South Caucasus, obtained Erasmus+ accreditation, and ran projects on themes ranging from street art and graphic facilitation to sport inclusion and digital literacy. Each project brought together young people who would never otherwise have met, and sent them home with new friends, new skills, and a wider sense of what is possible.' },
        {
          name: 'timeline',
          type: 'array',
          admin: { description: 'Key milestones shown in the "Our Story" section.' },
          fields: [
            { name: 'year',  type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'desc',  type: 'textarea' },
          ],
        },
        // Mission / Vision / Values
        { name: 'missionBody', type: 'textarea', defaultValue: 'To support the personal development of young people through high-quality non-formal education programmes that transcend borders and build European citizenship.' },
        { name: 'visionBody',  type: 'textarea', defaultValue: 'A Europe where every young person has access to transformative learning experiences regardless of their background, geography, or financial situation.' },
        { name: 'valuesBody',  type: 'textarea', defaultValue: 'Inclusivity · Empathy · Collaboration · Curiosity · Respect for diversity and the environment.' },
        // Stats band
        {
          name: 'pageStats',
          type: 'array',
          label: 'Impact Stats',
          admin: { description: 'Stats shown in the dark impact band.' },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'icon',  type: 'text' },
            { name: 'sub',   type: 'text', admin: { description: 'Small subtitle below the label' } },
          ],
        },
        // How we work
        {
          name: 'howWeWork',
          type: 'array',
          admin: { description: 'Steps in the "How we work" section.' },
          fields: [
            { name: 'step',  type: 'text', required: true, admin: { description: 'Step number e.g. "01"' } },
            { name: 'title', type: 'text', required: true },
            { name: 'desc',  type: 'textarea' },
          ],
        },
        // Focus areas (with description)
        {
          name: 'focusAreas',
          type: 'array',
          admin: { description: 'Focus area cards in the "What we work on" section.' },
          fields: [
            { name: 'icon',  type: 'text' },
            { name: 'label', type: 'text', required: true },
            { name: 'desc',  type: 'textarea' },
          ],
        },
        // Erasmus+ callout
        { name: 'erasmusTitle', type: 'text',     defaultValue: 'Erasmus+ accreditation - what it means for you' },
        { name: 'erasmusBody',  type: 'textarea', defaultValue: 'IC-YEC holds a multi-annual Erasmus+ accreditation. This means every exchange and training course we run meets the European Union\'s quality standards for non-formal education - and that participation is always fully funded: travel, accommodation, meals, and activities are covered for participants. No financial barrier should stand between a young person and a life-changing experience.' },
        // Partners section visibility
        { name: 'showPartnersSection', type: 'checkbox', defaultValue: false, admin: { description: 'Show the "Our partners" section on the About page.' } },
        // CTA
        { name: 'ctaHeading', type: 'text',     defaultValue: 'Get involved with IC-YEC' },
        { name: 'ctaBody',    type: 'textarea', defaultValue: 'Whether you\'re a young person looking to join a project, an organisation wanting to partner with us, or someone who believes in our work - there\'s a place for you here.' },
      ],
    },

    // ── About IC-YEC section (homepage) ─────────────────────────────────────
    {
      name: 'aboutSection',
      type: 'group',
      label: 'About IC-YEC Section (Homepage)',
      admin: { description: 'The "Who We Are" block shown on the homepage.' },
      fields: [
        { name: 'label',   type: 'text', defaultValue: 'Who we are', admin: { description: 'Small label above the heading (e.g. "WHO WE ARE")' } },
        { name: 'heading', type: 'text', defaultValue: 'More than an NGO - a community of doers' },
        { name: 'intro',   type: 'textarea', defaultValue: 'Founded in 2018 in Yerevan, IC-YEC brings together young people, educators, and organisations around a shared belief: that hands-on, intercultural learning changes lives. From street-art workshops in Armenia to sport-based inclusion projects in Portugal, every initiative we run is designed to leave a lasting impact.' },
        { name: 'body',    type: 'richText' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn more about us →' },
        { name: 'ctaUrl',   type: 'text', defaultValue: '/about' },
        {
          name: 'focusAreas',
          type: 'array',
          admin: { description: 'Focus area pills shown below the body text.' },
          fields: [
            { name: 'icon',  type: 'text', admin: { description: 'Emoji (e.g. 🎨 ⚽ 🌿)' } },
            { name: 'label', type: 'text', required: true },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'Stat cards shown in the right column.' },
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "2018" or "500+"' } },
            { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Year founded"' } },
            { name: 'icon',  type: 'text', admin: { description: 'Emoji icon (e.g. 📅 🌍)' } },
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
