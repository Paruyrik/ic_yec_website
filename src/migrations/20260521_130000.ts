import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Idempotent safety migration — ensures all about-page tables and columns
 * exist regardless of whether 20260521_110000 ran successfully.
 * All statements use IF NOT EXISTS / IF EXISTS so they are safe to re-run.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Scalar columns (IF NOT EXISTS means safe to run even if already added)
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_page_hero_title"              varchar,
      ADD COLUMN IF NOT EXISTS "about_page_hero_subtitle"           varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_heading"           varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_paragraph_1"       varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_paragraph_2"       varchar,
      ADD COLUMN IF NOT EXISTS "about_page_mission_body"            varchar,
      ADD COLUMN IF NOT EXISTS "about_page_vision_body"             varchar,
      ADD COLUMN IF NOT EXISTS "about_page_values_body"             varchar,
      ADD COLUMN IF NOT EXISTS "about_page_erasmus_title"           varchar,
      ADD COLUMN IF NOT EXISTS "about_page_erasmus_body"            varchar,
      ADD COLUMN IF NOT EXISTS "about_page_cta_heading"             varchar,
      ADD COLUMN IF NOT EXISTS "about_page_cta_body"                varchar,
      ADD COLUMN IF NOT EXISTS "about_page_show_partners_section"   boolean DEFAULT false;
  `)

  // Array tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_timeline" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "year"       varchar,
      "label"      varchar,
      "desc"       varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_page_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar NOT NULL,
      "label"      varchar NOT NULL,
      "icon"       varchar,
      "sub"        varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_how_we_work" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "step"       varchar,
      "title"      varchar,
      "desc"       varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_focus_areas" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "icon"       varchar,
      "label"      varchar NOT NULL,
      "desc"       varchar
    );
  `)

  // FK constraints — use DO $$ to skip if already exists
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_settings_about_page_timeline"
        ADD CONSTRAINT "site_settings_about_page_timeline_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_about_page_page_stats"
        ADD CONSTRAINT "site_settings_about_page_page_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_about_page_how_we_work"
        ADD CONSTRAINT "site_settings_about_page_how_we_work_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_about_page_focus_areas"
        ADD CONSTRAINT "site_settings_about_page_focus_areas_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_order_idx"     ON "site_settings_about_page_timeline"    USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_parent_idx"    ON "site_settings_about_page_timeline"    USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_order_idx"   ON "site_settings_about_page_page_stats"  USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_parent_idx"  ON "site_settings_about_page_page_stats"  USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_order_idx"  ON "site_settings_about_page_how_we_work" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_parent_idx" ON "site_settings_about_page_how_we_work" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_order_idx"  ON "site_settings_about_page_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_parent_idx" ON "site_settings_about_page_focus_areas" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // no-op — superseded by 20260521_110000 down
}
