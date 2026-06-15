import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a required, unique slug to newsletters. Existing rows are backfilled
// from their title (slugified the same way as the admin SlugField), with a
// numeric suffix appended when two titles would collide.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "newsletters" ADD COLUMN "slug" varchar;

  UPDATE "newsletters" n
  SET "slug" = CASE WHEN sub.rn = 1 THEN sub.base ELSE sub.base || '-' || sub.rn END
  FROM (
    SELECT
      id,
      base,
      row_number() OVER (PARTITION BY base ORDER BY id) AS rn
    FROM (
      SELECT
        id,
        NULLIF(trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), '') AS base
      FROM "newsletters"
    ) s
  ) sub
  WHERE n.id = sub.id AND sub.base IS NOT NULL;

  -- Fallback for rows whose title produced an empty slug
  UPDATE "newsletters" SET "slug" = 'newsletter-' || id WHERE "slug" IS NULL OR "slug" = '';

  ALTER TABLE "newsletters" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "newsletters_slug_idx" ON "newsletters" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "newsletters_slug_idx";
  ALTER TABLE "newsletters" DROP COLUMN "slug";`)
}
