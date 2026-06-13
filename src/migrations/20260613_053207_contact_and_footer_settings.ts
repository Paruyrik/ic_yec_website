import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "Contact & Social" and "Footer" groups to the site-settings global.
// Only these objects are new; everything else in the config already exists in
// the database from earlier migrations, so this migration is scoped to just the
// contact/footer fields and the footer link-column tables.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "site_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "site_settings_footer_columns_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "site_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"external" boolean DEFAULT false
  );

  CREATE TABLE "site_settings_footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  ALTER TABLE "site_settings" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_social_instagram" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_social_facebook" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_social_linkedin" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_social_youtube" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_social_tiktok" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "contact_address" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_tagline" varchar;

  ALTER TABLE "site_settings_footer_columns" ADD CONSTRAINT "site_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns_locales" ADD CONSTRAINT "site_settings_footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns_links" ADD CONSTRAINT "site_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns_links_locales" ADD CONSTRAINT "site_settings_footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "site_settings_footer_columns_order_idx" ON "site_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_parent_id_idx" ON "site_settings_footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_columns_locales_locale_parent_id_unique" ON "site_settings_footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_footer_columns_links_order_idx" ON "site_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_links_parent_id_idx" ON "site_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_columns_links_locales_locale_parent_id_" ON "site_settings_footer_columns_links_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "site_settings_footer_columns_links_locales" CASCADE;
  DROP TABLE "site_settings_footer_columns_links" CASCADE;
  DROP TABLE "site_settings_footer_columns_locales" CASCADE;
  DROP TABLE "site_settings_footer_columns" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "contact_email";
  ALTER TABLE "site_settings" DROP COLUMN "contact_phone";
  ALTER TABLE "site_settings" DROP COLUMN "contact_social_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "contact_social_facebook";
  ALTER TABLE "site_settings" DROP COLUMN "contact_social_linkedin";
  ALTER TABLE "site_settings" DROP COLUMN "contact_social_youtube";
  ALTER TABLE "site_settings" DROP COLUMN "contact_social_tiktok";
  ALTER TABLE "site_settings_locales" DROP COLUMN "contact_address";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_tagline";`)
}
