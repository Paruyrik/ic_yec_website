import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const DEFAULT_FOCUS_AREAS = [
  { icon: '🎨', label: 'Art & Culture' },
  { icon: '⚽', label: 'Sport & Health' },
  { icon: '🌿', label: 'Environment' },
  { icon: '💻', label: 'Digital Skills' },
  { icon: '🤝', label: 'Social Inclusion' },
  { icon: '🎓', label: 'Non-formal Education' },
]

const DEFAULT_STATS = [
  { value: '2018', label: 'Year founded',       icon: '📅' },
  { value: '20+',  label: 'Partner countries',  icon: '🌍' },
  { value: '500+', label: 'Young participants',  icon: '👥' },
  { value: '15+',  label: 'Projects completed',  icon: '📋' },
  { value: '6',    label: 'Focus themes',        icon: '🎯' },
  { value: '100%', label: 'Non-profit & free',   icon: '🎁' },
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  // 1. Add scalar columns to site_settings
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_section_label"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_heading"   varchar,
      ADD COLUMN IF NOT EXISTS "about_section_intro"     varchar,
      ADD COLUMN IF NOT EXISTS "about_section_body"      varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_label" varchar,
      ADD COLUMN IF NOT EXISTS "about_section_cta_url"   varchar;
  `)

  // 2. Create focus-areas array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_section_focus_areas" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "icon"       varchar,
      "label"      varchar NOT NULL
    );
    ALTER TABLE "site_settings_about_section_focus_areas"
      ADD CONSTRAINT "site_settings_about_section_focus_areas_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_order_idx"
      ON "site_settings_about_section_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_focus_areas_parent_id_idx"
      ON "site_settings_about_section_focus_areas" USING btree ("_parent_id");
  `)

  // 3. Create stats array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_about_section_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar NOT NULL,
      "label"      varchar NOT NULL,
      "icon"       varchar
    );
    ALTER TABLE "site_settings_about_section_stats"
      ADD CONSTRAINT "site_settings_about_section_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_order_idx"
      ON "site_settings_about_section_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_section_stats_parent_id_idx"
      ON "site_settings_about_section_stats" USING btree ("_parent_id");
  `)

  // 4. Seed default data via Payload API (only if not yet set)
  const settings = await payload.findGlobal({ slug: 'site-settings' as any })
  const existing = (settings as any)?.aboutSection
  if (existing?.heading) return

  await payload.updateGlobal({
    slug: 'site-settings' as any,
    data: {
      aboutSection: {
        label: 'Who we are',
        heading: 'More than an NGO — a community of doers',
        intro: 'Founded in 2018 in Yerevan, IC-YEC brings together young people, educators, and organisations around a shared belief: that hands-on, intercultural learning changes lives. From street-art workshops in Armenia to sport-based inclusion projects in Portugal, every initiative we run is designed to leave a lasting impact.',
        body: 'We are accredited by the Erasmus+ programme, but our work goes far beyond it — we run local community projects, national youth initiatives, and long-term strategic partnerships with organisations across Europe and the South Caucasus.',
        ctaLabel: 'Learn more about us →',
        ctaUrl: '/about',
        focusAreas: DEFAULT_FOCUS_AREAS,
        stats: DEFAULT_STATS,
      },
    } as any,
  })
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
