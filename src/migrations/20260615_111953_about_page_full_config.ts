import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_about_page_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_about_page_erasmus_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_about_page_cta_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"desc" varchar,
  	"href" varchar NOT NULL,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "about_page_hero_badge" varchar DEFAULT 'Youth NGO · Yerevan, Armenia · Est. 2018';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_story_label" varchar DEFAULT 'Our story';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_story_extra" varchar DEFAULT 'Today IC-YEC is also the official representative of Masterpeace in Armenia - a global NGO using art and sport to build a culture of peace. It is a partnership that reflects everything we believe in.';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_mission_vision_label" varchar DEFAULT 'What drives us';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_mission_vision_title" varchar DEFAULT 'Mission, Vision & Values';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_mission_heading" varchar DEFAULT 'Mission';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_mission_icon" varchar DEFAULT '🎯';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_vision_heading" varchar DEFAULT 'Vision';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_vision_icon" varchar DEFAULT '👁️';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_values_heading" varchar DEFAULT 'Values';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_values_icon" varchar DEFAULT '💛';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_impact_label" varchar DEFAULT 'By the numbers';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_impact_title" varchar DEFAULT 'Our impact since 2018';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_how_we_work_label" varchar DEFAULT 'Our approach';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_how_we_work_title" varchar DEFAULT 'How we work';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_focus_areas_label" varchar DEFAULT 'Our programmes';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_focus_areas_title" varchar DEFAULT 'What we work on';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_erasmus_badge" varchar DEFAULT '🇪🇺 Erasmus+ Partner Organisation';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_affiliations_label" varchar DEFAULT 'Affiliations';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_affiliations_title" varchar DEFAULT 'Official representation';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_partners_label" varchar DEFAULT 'Network';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_partners_title" varchar DEFAULT 'Our partners';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_team_label" varchar DEFAULT 'The people';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_team_title" varchar DEFAULT 'Meet our team';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_team_empty_text" varchar DEFAULT 'Team profiles coming soon.';
  ALTER TABLE "site_settings" ADD COLUMN "about_page_cta_label" varchar DEFAULT 'Join us';
  ALTER TABLE "site_settings_about_page_hero_stats" ADD CONSTRAINT "site_settings_about_page_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_erasmus_benefits" ADD CONSTRAINT "site_settings_about_page_erasmus_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_cta_cards" ADD CONSTRAINT "site_settings_about_page_cta_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_about_page_hero_stats_order_idx" ON "site_settings_about_page_hero_stats" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_hero_stats_parent_id_idx" ON "site_settings_about_page_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_page_erasmus_benefits_order_idx" ON "site_settings_about_page_erasmus_benefits" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_erasmus_benefits_parent_id_idx" ON "site_settings_about_page_erasmus_benefits" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_page_cta_cards_order_idx" ON "site_settings_about_page_cta_cards" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_cta_cards_parent_id_idx" ON "site_settings_about_page_cta_cards" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_about_page_hero_stats" CASCADE;
  DROP TABLE "site_settings_about_page_erasmus_benefits" CASCADE;
  DROP TABLE "site_settings_about_page_cta_cards" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "about_page_hero_badge";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_story_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_story_extra";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_mission_vision_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_mission_vision_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_mission_heading";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_mission_icon";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_vision_heading";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_vision_icon";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_values_heading";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_values_icon";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_impact_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_impact_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_how_we_work_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_how_we_work_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_focus_areas_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_focus_areas_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_erasmus_badge";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_affiliations_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_affiliations_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_partners_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_partners_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_team_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_team_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_team_empty_text";
  ALTER TABLE "site_settings" DROP COLUMN "about_page_cta_label";`)
}
