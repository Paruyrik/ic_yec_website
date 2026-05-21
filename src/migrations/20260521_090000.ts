import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Change about_section_body from varchar to jsonb (richText uses jsonb)
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ALTER COLUMN "about_section_body" TYPE jsonb USING NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ALTER COLUMN "about_section_body" TYPE varchar USING NULL;
  `)
}
