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

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
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
        media:     true,   // public images - project photos, team photos, logos
        documents: true,   // private documents - applicant CVs
      } as any,
      options: {
        token: process.env.UPLOADTHING_TOKEN ?? '',
      },
    }),
  ],
})
