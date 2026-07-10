import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Projects } from './collections/Projects'
import { OpenCalls } from './collections/OpenCalls'
import { Registrations } from './collections/Registrations'
import { TeamMembers } from './collections/TeamMembers'
import { Partners } from './collections/Partners'
import { Pages } from './collections/Pages'
import { FormTemplates } from './collections/FormTemplates'
import { Faqs } from './collections/Faqs'
import { Stories } from './collections/Stories'
import { Newsletters } from './collections/Newsletters'
import { PartnerApplications } from './collections/PartnerApplications'
import { EmailSettings } from './globals/EmailSettings'
import { ProjectsSettings } from './globals/ProjectsSettings'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

// A v7 uploadthing token is base64-encoded JSON: { apiKey, appId, regions }.
// A legacy `sk_live_...` secret key is not accepted.
//
// UTApi constructs happily with a bad token and only throws when a request is
// made, so an invalid token stays invisible until someone uploads a file - and
// then surfaces as a generic "Something went wrong" in the admin. Fail at boot,
// where the message is actionable.
// The dashboard's "Quick Copy" snippet wraps the value in single quotes. Vercel
// stores env values literally, so a straight paste keeps them - and uploadthing
// rejects the token even though base64 decoding tolerates the stray characters.
const uploadthingToken = (process.env.UPLOADTHING_TOKEN ?? '').trim().replace(/^['"]|['"]$/g, '')

try {
  const decoded = JSON.parse(Buffer.from(uploadthingToken, 'base64').toString('utf8'))
  if (!decoded?.apiKey || !decoded?.appId) throw new Error('missing apiKey/appId')
} catch {
  throw new Error(
    'UPLOADTHING_TOKEN is missing or not a valid v7 token. Copy the UPLOADTHING_TOKEN ' +
      'value from the uploadthing dashboard (API Keys tab) - not the legacy sk_live_... ' +
      'secret key - and set it for every environment that serves the app.',
  )
}

// Origins allowed to send authenticated (cookie) requests to the API.
// If the domain the admin is loaded from isn't listed here, Payload rejects
// the auth cookie via its CSRF check and every request returns 403.
// Set ALLOWED_ORIGINS to a comma-separated list to permit extra domains
// (e.g. the www. host and the old *.vercel.app URL).
const allowedOrigins = Array.from(
  new Set(
    [
      serverURL,
      ...(process.env.ALLOWED_ORIGINS ?? '')
        .split(',')
        .map((o) => o.trim()),
    ].filter(Boolean),
  ),
)

export default buildConfig({
  serverURL,
  ...(allowedOrigins.length > 0 ? { cors: allowedOrigins, csrf: allowedOrigins } : {}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Documents, Projects, OpenCalls, Registrations, TeamMembers, Partners, Pages, FormTemplates, Faqs, Stories, Newsletters, PartnerApplications],
  globals: [EmailSettings, ProjectsSettings, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Հայերեն', code: 'hy' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
    push: false, // never auto-push schema in dev - always use migrations
  }),
  sharp,
  plugins: [
    uploadthingStorage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collections: {
        // Public images - served straight from the uploadthing CDN.
        //
        // Proxying them through /api/media/file/<filename> serves 0-byte
        // responses: the static handler derives Content-Length from a HEAD
        // request to uploadthing, which answers chunked with no Content-Length,
        // so `Number(null)` -> 0 and the body is truncated to nothing.
        // Media is world-readable anyway, so skip the proxy entirely.
        media: { disablePayloadAccessControl: true },
        documents: true,   // private documents - applicant CVs - must stay behind access control
      } as any,
      options: {
        token: uploadthingToken,
      },
    }),
  ],
})
