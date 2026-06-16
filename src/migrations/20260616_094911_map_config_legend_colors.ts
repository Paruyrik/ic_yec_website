import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "map_config_inactive_country_color" varchar DEFAULT '#1e1d3a';
  ALTER TABLE "site_settings" ADD COLUMN "map_config_background_color" varchar DEFAULT '#0f0e1a';
  ALTER TABLE "site_settings_locales" ADD COLUMN "map_config_legend_active_label" varchar DEFAULT 'Partner countries';
  ALTER TABLE "site_settings_locales" ADD COLUMN "map_config_legend_home_label" varchar DEFAULT 'IC-YEC headquarters';
  ALTER TABLE "site_settings_locales" ADD COLUMN "map_config_legend_city_label" varchar DEFAULT 'Partner cities';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "map_config_inactive_country_color";
  ALTER TABLE "site_settings" DROP COLUMN "map_config_background_color";
  ALTER TABLE "site_settings_locales" DROP COLUMN "map_config_legend_active_label";
  ALTER TABLE "site_settings_locales" DROP COLUMN "map_config_legend_home_label";
  ALTER TABLE "site_settings_locales" DROP COLUMN "map_config_legend_city_label";`)
}
