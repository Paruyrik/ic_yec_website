import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Minimal Lexical JSON for a single paragraph of text
function lexicalParagraph(text: string) {
  return JSON.stringify({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text,
              version: 1,
            },
          ],
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
    },
  })
}

const BODY_TEXT =
  'We are accredited by the Erasmus+ programme, but our work goes far beyond it — ' +
  'we run local community projects, national youth initiatives, and long-term ' +
  'strategic partnerships with organisations across Europe and the South Caucasus.'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Seed default values into about_section columns (only where still NULL)
  await db.execute(sql`
    UPDATE "site_settings"
    SET
      "about_section_label"     = COALESCE("about_section_label",     'Who we are'),
      "about_section_heading"   = COALESCE("about_section_heading",   'More than an NGO — a community of doers'),
      "about_section_intro"     = COALESCE("about_section_intro",     'Founded in 2018 in Yerevan, IC-YEC brings together young people, educators, and organisations around a shared belief: that hands-on, intercultural learning changes lives. From street-art workshops in Armenia to sport-based inclusion projects in Portugal, every initiative we run is designed to leave a lasting impact.'),
      "about_section_body"      = COALESCE("about_section_body",      ${lexicalParagraph(BODY_TEXT)}::jsonb),
      "about_section_cta_label" = COALESCE("about_section_cta_label", 'Learn more about us →'),
      "about_section_cta_url"   = COALESCE("about_section_cta_url",   '/about');
  `)

  // Seed focus areas (only if none exist yet)
  const existing = await db.execute(sql`SELECT COUNT(*) FROM "site_settings_about_section_focus_areas"`)
  const count = Number((existing as any).rows?.[0]?.count ?? 0)
  if (count > 0) return

  // Get the site_settings id
  const rows = await db.execute(sql`SELECT id FROM "site_settings" LIMIT 1`)
  const parentId = (rows as any).rows?.[0]?.id
  if (!parentId) return

  const focusAreas = [
    { order: 1, icon: '🎨', label: 'Art & Culture' },
    { order: 2, icon: '⚽', label: 'Sport & Health' },
    { order: 3, icon: '🌿', label: 'Environment' },
    { order: 4, icon: '💻', label: 'Digital Skills' },
    { order: 5, icon: '🤝', label: 'Social Inclusion' },
    { order: 6, icon: '🎓', label: 'Non-formal Education' },
  ]

  for (const { order, icon, label } of focusAreas) {
    await db.execute(sql`
      INSERT INTO "site_settings_about_section_focus_areas"
        ("_order", "_parent_id", "id", "icon", "label")
      VALUES
        (${order}, ${parentId}, ${`focus-${order}`}, ${icon}, ${label})
    `)
  }

  const stats = [
    { order: 1, value: '2018', label: 'Year founded',      icon: '📅' },
    { order: 2, value: '20+',  label: 'Partner countries', icon: '🌍' },
    { order: 3, value: '500+', label: 'Young participants', icon: '👥' },
    { order: 4, value: '15+',  label: 'Projects completed', icon: '📋' },
    { order: 5, value: '6',    label: 'Focus themes',       icon: '🎯' },
    { order: 6, value: '100%', label: 'Non-profit & free',  icon: '🎁' },
  ]

  for (const { order, value, label, icon } of stats) {
    await db.execute(sql`
      INSERT INTO "site_settings_about_section_stats"
        ("_order", "_parent_id", "id", "value", "label", "icon")
      VALUES
        (${order}, ${parentId}, ${`stat-${order}`}, ${value}, ${label}, ${icon})
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "site_settings_about_section_focus_areas";
    DELETE FROM "site_settings_about_section_stats";
    UPDATE "site_settings" SET
      "about_section_label"     = NULL,
      "about_section_heading"   = NULL,
      "about_section_intro"     = NULL,
      "about_section_body"      = NULL,
      "about_section_cta_label" = NULL,
      "about_section_cta_url"   = NULL;
  `)
}
