import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Scalar columns ──────────────────────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_page_hero_title"      varchar,
      ADD COLUMN IF NOT EXISTS "about_page_hero_subtitle"   varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_heading"   varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_paragraph_1" varchar,
      ADD COLUMN IF NOT EXISTS "about_page_story_paragraph_2" varchar,
      ADD COLUMN IF NOT EXISTS "about_page_mission_body"    varchar,
      ADD COLUMN IF NOT EXISTS "about_page_vision_body"     varchar,
      ADD COLUMN IF NOT EXISTS "about_page_values_body"     varchar,
      ADD COLUMN IF NOT EXISTS "about_page_erasmus_title"   varchar,
      ADD COLUMN IF NOT EXISTS "about_page_erasmus_body"    varchar,
      ADD COLUMN IF NOT EXISTS "about_page_cta_heading"     varchar,
      ADD COLUMN IF NOT EXISTS "about_page_cta_body"        varchar;
  `)

  // ── Array tables ────────────────────────────────────────────────────────────
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

  // Foreign keys + indexes (separate execute to avoid idle-in-transaction risk)
  await db.execute(sql`
    ALTER TABLE "site_settings_about_page_timeline"
      ADD CONSTRAINT "site_settings_about_page_timeline_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_about_page_page_stats"
      ADD CONSTRAINT "site_settings_about_page_page_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_about_page_how_we_work"
      ADD CONSTRAINT "site_settings_about_page_how_we_work_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_about_page_focus_areas"
      ADD CONSTRAINT "site_settings_about_page_focus_areas_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_order_idx"    ON "site_settings_about_page_timeline"    USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_timeline_parent_idx"   ON "site_settings_about_page_timeline"    USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_order_idx"  ON "site_settings_about_page_page_stats"  USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_page_stats_parent_idx" ON "site_settings_about_page_page_stats"  USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_order_idx" ON "site_settings_about_page_how_we_work" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_how_we_work_parent_idx" ON "site_settings_about_page_how_we_work" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_order_idx" ON "site_settings_about_page_focus_areas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_about_page_focus_areas_parent_idx" ON "site_settings_about_page_focus_areas" USING btree ("_parent_id");
  `)

  // ── Seed scalar defaults (COALESCE = only if still NULL) ────────────────────
  await db.execute(sql`
    UPDATE "site_settings" SET
      "about_page_hero_title"      = COALESCE("about_page_hero_title",      'International Center for Youth Empowerment Cooperation'),
      "about_page_hero_subtitle"   = COALESCE("about_page_hero_subtitle",   'We are an Armenian youth NGO dedicated to creating spaces where young people from different countries meet, learn from each other, and return home with the skills and motivation to drive change in their own communities.'),
      "about_page_story_heading"   = COALESCE("about_page_story_heading",   'From a small team in Yerevan to a European network'),
      "about_page_story_paragraph_1" = COALESCE("about_page_story_paragraph_1", 'IC-YEC was founded in 2018 by a group of young Armenians who had participated in Erasmus+ exchanges and came back with a conviction: that non-formal learning across borders is one of the most powerful tools for personal growth that exists. They wanted to make that experience available to more young people in Armenia — and to put Armenian youth on the European map.'),
      "about_page_story_paragraph_2" = COALESCE("about_page_story_paragraph_2", 'Over the following years we built a network of partner organisations across Europe and the South Caucasus, obtained Erasmus+ accreditation, and ran projects on themes ranging from street art and graphic facilitation to sport inclusion and digital literacy. Each project brought together young people who would never otherwise have met, and sent them home with new friends, new skills, and a wider sense of what is possible.'),
      "about_page_mission_body"    = COALESCE("about_page_mission_body",    'To support the personal development of young people through high-quality non-formal education programmes that transcend borders and build European citizenship.'),
      "about_page_vision_body"     = COALESCE("about_page_vision_body",     'A Europe where every young person has access to transformative learning experiences regardless of their background, geography, or financial situation.'),
      "about_page_values_body"     = COALESCE("about_page_values_body",     'Inclusivity · Empathy · Collaboration · Curiosity · Respect for diversity and the environment.'),
      "about_page_erasmus_title"   = COALESCE("about_page_erasmus_title",   'Erasmus+ — what it means for participants'),
      "about_page_erasmus_body"    = COALESCE("about_page_erasmus_body",    'IC-YEC is an active Erasmus+ partner organisation. All of our youth exchanges and training courses are co-funded through Erasmus+ project grants, which means participation costs are fully covered for selected participants — travel, accommodation, meals, and programme activities. No financial barrier should stand between a young person and a life-changing experience.'),
      "about_page_cta_heading"     = COALESCE("about_page_cta_heading",     'Get involved with IC-YEC'),
      "about_page_cta_body"        = COALESCE("about_page_cta_body",        'Whether you''re a young person looking to join a project, an organisation wanting to partner with us, or someone who believes in our work — there''s a place for you here.');
  `)

  // ── Seed array data (only if tables are still empty) ────────────────────────
  const settingsRow = await db.execute(sql`SELECT id FROM "site_settings" LIMIT 1`)
  const parentId = (settingsRow as any).rows?.[0]?.id
  if (!parentId) return

  // Timeline
  const tlCount = await db.execute(sql`SELECT COUNT(*) FROM "site_settings_about_page_timeline"`)
  if (Number((tlCount as any).rows?.[0]?.count ?? 0) === 0) {
    const timeline = [
      { i: 1, year: '2018', label: 'Founded',      desc: 'IC-YEC established in Yerevan with a focus on Erasmus+ youth exchanges.' },
      { i: 2, year: '2019', label: 'First projects', desc: 'Launched our first cross-border youth projects in Armenia and Georgia.' },
      { i: 3, year: '2020', label: 'Adapting',      desc: 'Pivoted to online non-formal education during the global pandemic.' },
      { i: 4, year: '2021', label: 'Accreditation', desc: 'Received Erasmus+ accreditation, unlocking long-term programme access.' },
      { i: 5, year: '2022', label: 'Growing',       desc: 'Expanded partnerships to 15+ European countries; first ESC volunteering project.' },
      { i: 6, year: '2023', label: 'Masterpeace',   desc: 'Became the official representative of Masterpeace in Armenia.' },
      { i: 7, year: '2024', label: 'Impact',        desc: '500+ young participants reached across art, sport, digital, and inclusion themes.' },
    ]
    for (const { i, year, label, desc } of timeline) {
      await db.execute(sql`INSERT INTO "site_settings_about_page_timeline" ("_order","_parent_id","id","year","label","desc") VALUES (${i},${parentId},${`tl-${i}`},${year},${label},${desc})`)
    }
  }

  // Page stats
  const stCount = await db.execute(sql`SELECT COUNT(*) FROM "site_settings_about_page_page_stats"`)
  if (Number((stCount as any).rows?.[0]?.count ?? 0) === 0) {
    const stats = [
      { i: 1, value: '500+', label: 'Young people reached',  icon: '👥', sub: 'across all projects' },
      { i: 2, value: '20+',  label: 'Partner countries',     icon: '🌍', sub: 'in Europe & South Caucasus' },
      { i: 3, value: '15+',  label: 'Projects delivered',    icon: '📋', sub: 'youth exchanges, trainings & ESC' },
      { i: 4, value: '6',    label: 'Core themes',           icon: '🎯', sub: 'art, sport, digital & more' },
      { i: 5, value: '7+',   label: 'Years active',          icon: '🏅', sub: 'continuous operations since 2018' },
      { i: 6, value: '2018', label: 'Founded in Yerevan',    icon: '📅', sub: 'operating continuously since' },
    ]
    for (const { i, value, label, icon, sub } of stats) {
      await db.execute(sql`INSERT INTO "site_settings_about_page_page_stats" ("_order","_parent_id","id","value","label","icon","sub") VALUES (${i},${parentId},${`ps-${i}`},${value},${label},${icon},${sub})`)
    }
  }

  // How we work
  const hwCount = await db.execute(sql`SELECT COUNT(*) FROM "site_settings_about_page_how_we_work"`)
  if (Number((hwCount as any).rows?.[0]?.count ?? 0) === 0) {
    const steps = [
      { i: 1, step: '01', title: 'Identify needs',       desc: 'We listen to youth workers, community leaders, and young people to find where non-formal education can have the most impact.' },
      { i: 2, step: '02', title: 'Build partnerships',   desc: 'Every project connects organisations from multiple countries. We curate partnerships where each side brings unique expertise and perspective.' },
      { i: 3, step: '03', title: 'Design for learning',  desc: 'Our activities are grounded in non-formal education methodology — experiential, participatory, and focused on transferable competences.' },
      { i: 4, step: '04', title: 'Deliver & document',   desc: 'We run intensive residential programmes and follow up with tools that participants can take home and apply in their own communities.' },
    ]
    for (const { i, step, title, desc } of steps) {
      await db.execute(sql`INSERT INTO "site_settings_about_page_how_we_work" ("_order","_parent_id","id","step","title","desc") VALUES (${i},${parentId},${`hw-${i}`},${step},${title},${desc})`)
    }
  }

  // Focus areas
  const faCount = await db.execute(sql`SELECT COUNT(*) FROM "site_settings_about_page_focus_areas"`)
  if (Number((faCount as any).rows?.[0]?.count ?? 0) === 0) {
    const areas = [
      { i: 1, icon: '🎨', label: 'Art & Culture',          desc: 'Visual art, street art, theatre, and creative storytelling as vehicles for self-expression and intercultural dialogue.' },
      { i: 2, icon: '⚽', label: 'Sport & Inclusion',      desc: 'Sport as a universal language — building teamwork, respect, and resilience while breaking down social barriers.' },
      { i: 3, icon: '🧠', label: 'Emotional Intelligence', desc: 'Workshops on empathy, self-awareness, conflict resolution, and mental health literacy for young people and youth workers.' },
      { i: 4, icon: '💻', label: 'Digital Skills',         desc: 'Digital literacy, online safety, creative media, and tools that empower youth in a fast-changing world.' },
      { i: 5, icon: '🌿', label: 'Environment',            desc: 'Eco-activism, climate education, and sustainable living as part of responsible European citizenship.' },
      { i: 6, icon: '🤝', label: 'Social Inclusion',       desc: 'Projects that amplify marginalised voices and build bridges between communities with different backgrounds.' },
    ]
    for (const { i, icon, label, desc } of areas) {
      await db.execute(sql`INSERT INTO "site_settings_about_page_focus_areas" ("_order","_parent_id","id","icon","label","desc") VALUES (${i},${parentId},${`fa-${i}`},${icon},${label},${desc})`)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_about_page_timeline"    CASCADE;
    DROP TABLE IF EXISTS "site_settings_about_page_page_stats"  CASCADE;
    DROP TABLE IF EXISTS "site_settings_about_page_how_we_work" CASCADE;
    DROP TABLE IF EXISTS "site_settings_about_page_focus_areas" CASCADE;
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "about_page_hero_title",
      DROP COLUMN IF EXISTS "about_page_hero_subtitle",
      DROP COLUMN IF EXISTS "about_page_story_heading",
      DROP COLUMN IF EXISTS "about_page_story_paragraph_1",
      DROP COLUMN IF EXISTS "about_page_story_paragraph_2",
      DROP COLUMN IF EXISTS "about_page_mission_body",
      DROP COLUMN IF EXISTS "about_page_vision_body",
      DROP COLUMN IF EXISTS "about_page_values_body",
      DROP COLUMN IF EXISTS "about_page_erasmus_title",
      DROP COLUMN IF EXISTS "about_page_erasmus_body",
      DROP COLUMN IF EXISTS "about_page_cta_heading",
      DROP COLUMN IF EXISTS "about_page_cta_body";
  `)
}
