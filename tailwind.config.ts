import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ic-purple': {
          DEFAULT: '#3D3785',
          mid:     '#6B65C0',
          tint:    '#EEEDFE',
          dark:    '#2e2a63',
        },
        'ic-coral': {
          DEFAULT: '#E8A0A0',
          dark:    '#C97070',
        },
        'ic-dark': '#1A1833',
        'dl-urgent': { bg: '#FAECE7', text: '#993C1D' },
        'dl-ok':     { bg: '#EAF3DE', text: '#3B6D11' },
        status: {
          pending:    { bg: '#FAEEDA', text: '#633806' },
          reviewing:  { bg: '#E6F1FB', text: '#0C447C' },
          accepted:   { bg: '#EAF3DE', text: '#3B6D11' },
          rejected:   { bg: '#FCEBEB', text: '#A32D2D' },
          waitlisted: { bg: '#EEEDFE', text: '#3C3489' },
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        lg:      '12px',
        xl:      '20px',
        full:    '9999px',
      },
      fontWeight: {
        normal:  '400',
        medium:  '500',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(61,55,133,0.08)',
        hover: '0 6px 24px rgba(61,55,133,0.14)',
      },
    },
  },
  plugins: [],
}

export default config
