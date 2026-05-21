import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add scalar columns to site_settings
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_section_label"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_heading"   varchar,
      ADD COLUMN IF NOT EXISTS "about_section_intro"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_body"      varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_label" varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_url"   varchar;
  `)

  // Create focus-areas array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_section_focus_areas" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "icon"       varchar,
      "label"      varchar NOT NULL
    );
  `)
  await db.execute(sql`
    ALTER TABLE "site_settings_about_section_focus_areas"
      ADD CONSTRAINT "site_settings_about_section_focus_areas_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_order_idx"
      ON "site_settings_about_section_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_parent_id_idx"
      ON "site_settings_about_section_focus_areas" USING btree ("_parent_id");
  `)

  // Create stats array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_section_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar NOT NULL,
      "label"      varchar NOT NULL,
      "icon"       varchar
    );
  `)
  await db.execute(sql`
    ALTER TABLE "site_settings_about_section_stats"
      ADD CONSTRAINT "site_settings_about_section_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_order_idx"
      ON "site_settings_about_section_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_parent_id_idx"
      ON "site_settings_about_section_stats" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_about_section_focus_areas" CASCADE;
    DROP TABLE IF EXISTS "site_settings_about_section_stats" CASCADE;
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "about_section_label",
      DROP COLUMN IF EXISTS "about_section_heading",
      DROP COLUMN IF EXISTS "about_section_intro",
      DROP COLUMN IF EXISTS "about_section_body",
      DROP COLUMN IF EXISTS "about_section_cta_label",
      DROP COLUMN IF EXISTS "about_section_cta_url";
  `)
}
