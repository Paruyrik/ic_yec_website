import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Earlier hand-written migrations created these columns as
// "about_page_story_paragraph_1" / "_2", but Payload generates the column
// names without the underscore before the trailing digit
// ("about_page_story_paragraph1" / "2"). That mismatch made every query
// against the site-settings global fail ("column ... does not exist").
// Rename the columns to the names Payload expects.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'about_page_story_paragraph_1') THEN
      ALTER TABLE "site_settings" RENAME COLUMN "about_page_story_paragraph_1" TO "about_page_story_paragraph1";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'about_page_story_paragraph_2') THEN
      ALTER TABLE "site_settings" RENAME COLUMN "about_page_story_paragraph_2" TO "about_page_story_paragraph2";
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'about_page_story_paragraph1') THEN
      ALTER TABLE "site_settings" RENAME COLUMN "about_page_story_paragraph1" TO "about_page_story_paragraph_1";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'about_page_story_paragraph2') THEN
      ALTER TABLE "site_settings" RENAME COLUMN "about_page_story_paragraph2" TO "about_page_story_paragraph_2";
    END IF;
  END $$;`)
}
