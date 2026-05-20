import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove the DEFAULT 0 constraint and set all existing 0s to NULL.
  // NULL values sort last in PostgreSQL ASC order, so explicitly-ordered
  // projects (1, 2, 3 …) appear first; unset ones appear after, by date.
  await db.execute(sql`
    ALTER TABLE "projects" ALTER COLUMN "order" DROP DEFAULT;
    UPDATE "projects" SET "order" = NULL WHERE "order" = 0;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" ALTER COLUMN "order" SET DEFAULT 0;
    UPDATE "projects" SET "order" = 0 WHERE "order" IS NULL;
  `)
}
