import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Comprehensive recovery migration.
 * Creates every table / column added since 20260521 that may be missing
 * if earlier migrations failed mid-chain. Every statement is idempotent.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── 20260520_210000: aboutSection scalar columns ─────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_section_label"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_heading"   varchar,
      ADD COLUMN IF NOT EXISTS "about_section_intro"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_label" varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_url"   varchar;
  `)

  // ── 20260521_090000: about_section_body varchar → jsonb ──────────────────
  // Only alter if still varchar (skip if already jsonb or missing)
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_settings'
          AND column_name = 'about_section_body'
          AND data_type = 'character varying'
      ) THEN
        ALTER TABLE "site_settings" ALTER COLUMN "about_section_body" TYPE jsonb USING NULL;
      ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_settings' AND column_name = 'about_section_body'
      ) THEN
        ALTER TABLE "site_settings" ADD COLUMN "about_section_body" jsonb;
      END IF;
    END $$;
  `)

  // ── 20260520_210000: aboutSection array tables ───────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_section_focus_areas" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "icon"       varchar,
      "label"      varchar NOT NULL
    );
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
    DO $$ BEGIN
      ALTER TABLE "site_settings_about_section_focus_areas"
        ADD CONSTRAINT "site_settings_about_section_focus_areas_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_settings_about_section_stats"
        ADD CONSTRAINT "site_settings_about_section_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_order_idx" ON "site_settings_about_section_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_parent_id_idx" ON "site_settings_about_section_focus_areas" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_order_idx" ON "site_settings_about_section_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_parent_id_idx" ON "site_settings_about_section_stats" USING btree ("_parent_id");
  `)

  // ── 20260521_110000: aboutPage scalar columns ────────────────────────────
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
      ADD COLUMN IF NOT EXISTS "about_page_cta_body"                varchar;
  `)

  // ── 20260521_120000: showPartnersSection ─────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_page_show_partners_section" boolean DEFAULT false;
  `)

  // ── 20260521_110000: aboutPage array tables ──────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_timeline" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "year" varchar, "label" varchar, "desc" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_page_stats" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL,
      "label" varchar NOT NULL, "icon" varchar, "sub" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_how_we_work" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "step" varchar, "title" varchar, "desc" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_settings_about_page_focus_areas" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "icon" varchar, "label" varchar NOT NULL, "desc" varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN ALTER TABLE "site_settings_about_page_timeline" ADD CONSTRAINT "site_settings_about_page_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN ALTER TABLE "site_settings_about_page_page_stats" ADD CONSTRAINT "site_settings_about_page_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN ALTER TABLE "site_settings_about_page_how_we_work" ADD CONSTRAINT "site_settings_about_page_how_we_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN ALTER TABLE "site_settings_about_page_focus_areas" ADD CONSTRAINT "site_settings_about_page_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_order_idx"     ON "site_settings_about_page_timeline"    USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_parent_idx"    ON "site_settings_about_page_timeline"    USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_order_idx"   ON "site_settings_about_page_page_stats"  USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_parent_idx"  ON "site_settings_about_page_page_stats"  USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_order_idx"  ON "site_settings_about_page_how_we_work" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_parent_idx" ON "site_settings_about_page_how_we_work" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_order_idx"  ON "site_settings_about_page_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_parent_idx" ON "site_settings_about_page_focus_areas" USING btree ("_parent_id");
  `)

  // ── 20260521_140000: partner_applications ───────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_partner_applications_org_type" AS ENUM('youth-ngo','school','youth-centre','cultural','municipality','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_partner_applications_status" AS ENUM('new','reviewing','contacted','approved','declined'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_partner_applications_project_interests" AS ENUM('youth-exchange','training-course','esc-volunteering','seminar','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partner_applications" (
      "id"           serial PRIMARY KEY NOT NULL,
      "org_name"     varchar NOT NULL,
      "org_type"     "enum_partner_applications_org_type" NOT NULL,
      "country"      varchar NOT NULL,
      "website"      varchar,
      "contact_name" varchar NOT NULL,
      "email"        varchar NOT NULL,
      "contact_role" varchar,
      "message"      varchar NOT NULL,
      "how_heard"    varchar,
      "status"       "enum_partner_applications_status" DEFAULT 'new' NOT NULL,
      "admin_notes"  varchar,
      "updated_at"   timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"   timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "partner_applications_project_interests" (
      "order"     integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value"     "enum_partner_applications_project_interests",
      "id"        serial PRIMARY KEY NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN ALTER TABLE "partner_applications_project_interests" ADD CONSTRAINT "partner_applications_project_interests_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "partner_applications_project_interests_order_idx"  ON "partner_applications_project_interests" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "partner_applications_project_interests_parent_idx" ON "partner_applications_project_interests" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "partner_applications_status_idx"     ON "partner_applications" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "partner_applications_created_at_idx" ON "partner_applications" USING btree ("created_at");
  `)

  // ── projects order + projectRole columns (20260520_131726 / 200000) ──────
  await db.execute(sql`
    ALTER TABLE "projects"
      ADD COLUMN IF NOT EXISTS "order" numeric;
  `)

  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_projects_project_role" AS ENUM('coordinator','partner'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "projects"
      ADD COLUMN IF NOT EXISTS "project_role" "enum_projects_project_role";
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // no-op — this is a recovery migration; individual migration downs handle rollback
}
