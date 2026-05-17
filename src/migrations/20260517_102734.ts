import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_map_points_type" AS ENUM('main-venue', 'partner-org', 'event-location');
  CREATE TYPE "public"."enum_form_templates_blocks_heading_field_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('application-process', 'erasmus-plus', 'esc-volunteering', 'youth-exchanges', 'training-courses', 'general');
  CREATE TYPE "public"."enum_site_settings_theme_impact_themes_theme" AS ENUM('art', 'sport', 'emotional-intelligence', 'training', 'inclusion', 'digital', 'environment');
  ALTER TYPE "public"."enum_partners_type" ADD VALUE 'official-representative';
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"_key" varchar,
  	"prefix" varchar DEFAULT '',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "projects_map_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"description" varchar,
  	"type" "enum_projects_map_points_type" DEFAULT 'main-venue'
  );
  
  CREATE TABLE "projects_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outcome" varchar NOT NULL
  );
  
  CREATE TABLE "projects_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"photo_id" integer,
  	"country" varchar
  );
  
  CREATE TABLE "partners_locales" (
  	"representative_role" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_templates_blocks_text_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"min_length" numeric,
  	"max_length" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_textarea_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"rows" numeric DEFAULT 4,
  	"min_length" numeric,
  	"max_length" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_email_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_phone_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar DEFAULT '+1 234 567 8900',
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"international" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_number_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"min" numeric,
  	"max" numeric,
  	"step" numeric DEFAULT 1,
  	"unit" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_date_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"min_date" timestamp(3) with time zone,
  	"max_date" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_select_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_templates_blocks_select_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_radio_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_templates_blocks_radio_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_checkbox_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_checkbox_group_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_templates_blocks_checkbox_group_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_file_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"accept" varchar DEFAULT '.pdf,.doc,.docx',
  	"max_size_m_b" numeric DEFAULT 5,
  	"multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_url_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar DEFAULT 'https://',
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_country_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_heading_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"level" "enum_form_templates_blocks_heading_field_level" DEFAULT 'h3',
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_paragraph_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates_blocks_divider_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'general' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"age" numeric,
  	"country" varchar NOT NULL,
  	"project_name" varchar,
  	"photo_id" integer,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stories_locales" (
  	"quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"issue_name" varchar,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"preview" varchar NOT NULL,
  	"archive_url" varchar,
  	"cover_image_id" integer,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email_on_accept" boolean DEFAULT true,
  	"email_on_reject" boolean DEFAULT false,
  	"email_on_waitlist" boolean DEFAULT true,
  	"coordinator_email" varchar DEFAULT 'projects.icyec@gmail.com',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_settings_impact_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "projects_settings_impact_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"map_section_enabled" boolean DEFAULT true,
  	"map_section_active_country_color" varchar DEFAULT '#3D3785',
  	"map_section_pin_color" varchar DEFAULT '#E8A0A0',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_settings_locales" (
  	"map_section_title" varchar DEFAULT 'Where we work',
  	"map_section_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"duration" varchar
  );
  
  CREATE TABLE "site_settings_timeline_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_erasmus_explainer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_erasmus_explainer_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_partner_portal_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "site_settings_partner_portal_types_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_partner_portal_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_partner_portal_requirements_locales" (
  	"item" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_map_config_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"is_home" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_theme_impact_themes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_site_settings_theme_impact_themes_theme" NOT NULL,
  	"project_count" varchar,
  	"participant_count" varchar,
  	"countries_count" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"timeline_enabled" boolean DEFAULT true,
  	"erasmus_explainer_enabled" boolean DEFAULT true,
  	"partner_portal_enabled" boolean DEFAULT true,
  	"partner_portal_pif_url" varchar,
  	"partner_portal_contact_email" varchar,
  	"newsletter_enabled" boolean DEFAULT true,
  	"newsletter_signup_url" varchar,
  	"newsletter_show_archive" boolean DEFAULT true,
  	"badge_settings_urgent_days_threshold" numeric DEFAULT 7,
  	"badge_settings_show_live_badge" boolean DEFAULT true,
  	"map_config_active_country_color" varchar DEFAULT '#3D3785',
  	"map_config_home_city_color" varchar DEFAULT '#E8A0A0',
  	"map_config_partner_city_color" varchar DEFAULT '#8B85E8',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"timeline_title" varchar DEFAULT 'What happens after you apply',
  	"erasmus_explainer_title" varchar DEFAULT 'New to Erasmus+?',
  	"erasmus_explainer_subtitle" varchar,
  	"partner_portal_title" varchar DEFAULT 'Partner with IC-YEC',
  	"partner_portal_subtitle" varchar,
  	"newsletter_title" varchar DEFAULT 'Stay in the loop',
  	"newsletter_subtitle" varchar,
  	"newsletter_button_label" varchar DEFAULT 'Subscribe',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "registrations" DROP CONSTRAINT "registrations_cv_id_media_id_fk";
  
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_registrations_status";
  CREATE TYPE "public"."enum_registrations_status" AS ENUM('pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected');
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_registrations_status";
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DATA TYPE "public"."enum_registrations_status" USING "status"::"public"."enum_registrations_status";
  ALTER TABLE "media" ADD COLUMN "_key" varchar;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "projects" ADD COLUMN "participants" numeric;
  ALTER TABLE "projects" ADD COLUMN "video_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "open_calls" ADD COLUMN "apply_template_id" integer;
  ALTER TABLE "registrations" ADD COLUMN "agreement_url" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletters_id" integer;
  ALTER TABLE "projects_map_points" ADD CONSTRAINT "projects_map_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_outcomes" ADD CONSTRAINT "projects_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_testimonials" ADD CONSTRAINT "projects_testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_testimonials" ADD CONSTRAINT "projects_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_text_field" ADD CONSTRAINT "form_templates_blocks_text_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_textarea_field" ADD CONSTRAINT "form_templates_blocks_textarea_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_email_field" ADD CONSTRAINT "form_templates_blocks_email_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_phone_field" ADD CONSTRAINT "form_templates_blocks_phone_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_number_field" ADD CONSTRAINT "form_templates_blocks_number_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_date_field" ADD CONSTRAINT "form_templates_blocks_date_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_select_field_options" ADD CONSTRAINT "form_templates_blocks_select_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates_blocks_select_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_select_field" ADD CONSTRAINT "form_templates_blocks_select_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_radio_field_options" ADD CONSTRAINT "form_templates_blocks_radio_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates_blocks_radio_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_radio_field" ADD CONSTRAINT "form_templates_blocks_radio_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_checkbox_field" ADD CONSTRAINT "form_templates_blocks_checkbox_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_checkbox_group_field_options" ADD CONSTRAINT "form_templates_blocks_checkbox_group_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates_blocks_checkbox_group_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_checkbox_group_field" ADD CONSTRAINT "form_templates_blocks_checkbox_group_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_file_field" ADD CONSTRAINT "form_templates_blocks_file_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_url_field" ADD CONSTRAINT "form_templates_blocks_url_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_country_field" ADD CONSTRAINT "form_templates_blocks_country_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_heading_field" ADD CONSTRAINT "form_templates_blocks_heading_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_paragraph_field" ADD CONSTRAINT "form_templates_blocks_paragraph_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_templates_blocks_divider_field" ADD CONSTRAINT "form_templates_blocks_divider_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_settings_impact_stats_stats" ADD CONSTRAINT "projects_settings_impact_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_settings_impact_stats_stats_locales" ADD CONSTRAINT "projects_settings_impact_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_settings_impact_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_settings_locales" ADD CONSTRAINT "projects_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_timeline_steps" ADD CONSTRAINT "site_settings_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_timeline_steps_locales" ADD CONSTRAINT "site_settings_timeline_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_timeline_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_erasmus_explainer_items" ADD CONSTRAINT "site_settings_erasmus_explainer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_erasmus_explainer_items_locales" ADD CONSTRAINT "site_settings_erasmus_explainer_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_erasmus_explainer_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_partner_portal_types" ADD CONSTRAINT "site_settings_partner_portal_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_partner_portal_types_locales" ADD CONSTRAINT "site_settings_partner_portal_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_partner_portal_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_partner_portal_requirements" ADD CONSTRAINT "site_settings_partner_portal_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_partner_portal_requirements_locales" ADD CONSTRAINT "site_settings_partner_portal_requirements_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_partner_portal_requirements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_map_config_cities" ADD CONSTRAINT "site_settings_map_config_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_theme_impact_themes" ADD CONSTRAINT "site_settings_theme_impact_themes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "projects_map_points_order_idx" ON "projects_map_points" USING btree ("_order");
  CREATE INDEX "projects_map_points_parent_id_idx" ON "projects_map_points" USING btree ("_parent_id");
  CREATE INDEX "projects_outcomes_order_idx" ON "projects_outcomes" USING btree ("_order");
  CREATE INDEX "projects_outcomes_parent_id_idx" ON "projects_outcomes" USING btree ("_parent_id");
  CREATE INDEX "projects_testimonials_order_idx" ON "projects_testimonials" USING btree ("_order");
  CREATE INDEX "projects_testimonials_parent_id_idx" ON "projects_testimonials" USING btree ("_parent_id");
  CREATE INDEX "projects_testimonials_photo_idx" ON "projects_testimonials" USING btree ("photo_id");
  CREATE UNIQUE INDEX "partners_locales_locale_parent_id_unique" ON "partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_templates_blocks_text_field_order_idx" ON "form_templates_blocks_text_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_text_field_parent_id_idx" ON "form_templates_blocks_text_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_text_field_path_idx" ON "form_templates_blocks_text_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_textarea_field_order_idx" ON "form_templates_blocks_textarea_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_textarea_field_parent_id_idx" ON "form_templates_blocks_textarea_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_textarea_field_path_idx" ON "form_templates_blocks_textarea_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_email_field_order_idx" ON "form_templates_blocks_email_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_email_field_parent_id_idx" ON "form_templates_blocks_email_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_email_field_path_idx" ON "form_templates_blocks_email_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_phone_field_order_idx" ON "form_templates_blocks_phone_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_phone_field_parent_id_idx" ON "form_templates_blocks_phone_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_phone_field_path_idx" ON "form_templates_blocks_phone_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_number_field_order_idx" ON "form_templates_blocks_number_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_number_field_parent_id_idx" ON "form_templates_blocks_number_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_number_field_path_idx" ON "form_templates_blocks_number_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_date_field_order_idx" ON "form_templates_blocks_date_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_date_field_parent_id_idx" ON "form_templates_blocks_date_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_date_field_path_idx" ON "form_templates_blocks_date_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_select_field_options_order_idx" ON "form_templates_blocks_select_field_options" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_select_field_options_parent_id_idx" ON "form_templates_blocks_select_field_options" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_select_field_order_idx" ON "form_templates_blocks_select_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_select_field_parent_id_idx" ON "form_templates_blocks_select_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_select_field_path_idx" ON "form_templates_blocks_select_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_radio_field_options_order_idx" ON "form_templates_blocks_radio_field_options" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_radio_field_options_parent_id_idx" ON "form_templates_blocks_radio_field_options" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_radio_field_order_idx" ON "form_templates_blocks_radio_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_radio_field_parent_id_idx" ON "form_templates_blocks_radio_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_radio_field_path_idx" ON "form_templates_blocks_radio_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_checkbox_field_order_idx" ON "form_templates_blocks_checkbox_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_checkbox_field_parent_id_idx" ON "form_templates_blocks_checkbox_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_checkbox_field_path_idx" ON "form_templates_blocks_checkbox_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_checkbox_group_field_options_order_idx" ON "form_templates_blocks_checkbox_group_field_options" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_checkbox_group_field_options_parent_id_idx" ON "form_templates_blocks_checkbox_group_field_options" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_checkbox_group_field_order_idx" ON "form_templates_blocks_checkbox_group_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_checkbox_group_field_parent_id_idx" ON "form_templates_blocks_checkbox_group_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_checkbox_group_field_path_idx" ON "form_templates_blocks_checkbox_group_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_file_field_order_idx" ON "form_templates_blocks_file_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_file_field_parent_id_idx" ON "form_templates_blocks_file_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_file_field_path_idx" ON "form_templates_blocks_file_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_url_field_order_idx" ON "form_templates_blocks_url_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_url_field_parent_id_idx" ON "form_templates_blocks_url_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_url_field_path_idx" ON "form_templates_blocks_url_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_country_field_order_idx" ON "form_templates_blocks_country_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_country_field_parent_id_idx" ON "form_templates_blocks_country_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_country_field_path_idx" ON "form_templates_blocks_country_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_heading_field_order_idx" ON "form_templates_blocks_heading_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_heading_field_parent_id_idx" ON "form_templates_blocks_heading_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_heading_field_path_idx" ON "form_templates_blocks_heading_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_paragraph_field_order_idx" ON "form_templates_blocks_paragraph_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_paragraph_field_parent_id_idx" ON "form_templates_blocks_paragraph_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_paragraph_field_path_idx" ON "form_templates_blocks_paragraph_field" USING btree ("_path");
  CREATE INDEX "form_templates_blocks_divider_field_order_idx" ON "form_templates_blocks_divider_field" USING btree ("_order");
  CREATE INDEX "form_templates_blocks_divider_field_parent_id_idx" ON "form_templates_blocks_divider_field" USING btree ("_parent_id");
  CREATE INDEX "form_templates_blocks_divider_field_path_idx" ON "form_templates_blocks_divider_field" USING btree ("_path");
  CREATE INDEX "form_templates_updated_at_idx" ON "form_templates" USING btree ("updated_at");
  CREATE INDEX "form_templates_created_at_idx" ON "form_templates" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stories_photo_idx" ON "stories" USING btree ("photo_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE UNIQUE INDEX "stories_locales_locale_parent_id_unique" ON "stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "newsletters_cover_image_idx" ON "newsletters" USING btree ("cover_image_id");
  CREATE INDEX "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  CREATE INDEX "projects_settings_impact_stats_stats_order_idx" ON "projects_settings_impact_stats_stats" USING btree ("_order");
  CREATE INDEX "projects_settings_impact_stats_stats_parent_id_idx" ON "projects_settings_impact_stats_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_settings_impact_stats_stats_locales_locale_parent_i" ON "projects_settings_impact_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_settings_locales_locale_parent_id_unique" ON "projects_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_timeline_steps_order_idx" ON "site_settings_timeline_steps" USING btree ("_order");
  CREATE INDEX "site_settings_timeline_steps_parent_id_idx" ON "site_settings_timeline_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_timeline_steps_locales_locale_parent_id_unique" ON "site_settings_timeline_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_erasmus_explainer_items_order_idx" ON "site_settings_erasmus_explainer_items" USING btree ("_order");
  CREATE INDEX "site_settings_erasmus_explainer_items_parent_id_idx" ON "site_settings_erasmus_explainer_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_erasmus_explainer_items_locales_locale_parent_" ON "site_settings_erasmus_explainer_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_partner_portal_types_order_idx" ON "site_settings_partner_portal_types" USING btree ("_order");
  CREATE INDEX "site_settings_partner_portal_types_parent_id_idx" ON "site_settings_partner_portal_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_partner_portal_types_locales_locale_parent_id_" ON "site_settings_partner_portal_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_partner_portal_requirements_order_idx" ON "site_settings_partner_portal_requirements" USING btree ("_order");
  CREATE INDEX "site_settings_partner_portal_requirements_parent_id_idx" ON "site_settings_partner_portal_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_partner_portal_requirements_locales_locale_par" ON "site_settings_partner_portal_requirements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_map_config_cities_order_idx" ON "site_settings_map_config_cities" USING btree ("_order");
  CREATE INDEX "site_settings_map_config_cities_parent_id_idx" ON "site_settings_map_config_cities" USING btree ("_parent_id");
  CREATE INDEX "site_settings_theme_impact_themes_order_idx" ON "site_settings_theme_impact_themes" USING btree ("_order");
  CREATE INDEX "site_settings_theme_impact_themes_parent_id_idx" ON "site_settings_theme_impact_themes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "open_calls" ADD CONSTRAINT "open_calls_apply_template_id_form_templates_id_fk" FOREIGN KEY ("apply_template_id") REFERENCES "public"."form_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_cv_id_documents_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_templates_fk" FOREIGN KEY ("form_templates_id") REFERENCES "public"."form_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "open_calls_apply_template_idx" ON "open_calls" USING btree ("apply_template_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_form_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("form_templates_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");
  ALTER TABLE "registrations" DROP COLUMN "gdpr_consent";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_map_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_text_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_textarea_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_email_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_phone_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_number_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_date_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_select_field_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_select_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_radio_field_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_radio_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_checkbox_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_checkbox_group_field_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_checkbox_group_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_file_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_url_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_country_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_heading_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_paragraph_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates_blocks_divider_field" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_settings_impact_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_settings_impact_stats_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_timeline_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_erasmus_explainer_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_erasmus_explainer_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_partner_portal_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_partner_portal_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_partner_portal_requirements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_partner_portal_requirements_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_map_config_cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_theme_impact_themes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "projects_map_points" CASCADE;
  DROP TABLE "projects_outcomes" CASCADE;
  DROP TABLE "projects_testimonials" CASCADE;
  DROP TABLE "partners_locales" CASCADE;
  DROP TABLE "form_templates_blocks_text_field" CASCADE;
  DROP TABLE "form_templates_blocks_textarea_field" CASCADE;
  DROP TABLE "form_templates_blocks_email_field" CASCADE;
  DROP TABLE "form_templates_blocks_phone_field" CASCADE;
  DROP TABLE "form_templates_blocks_number_field" CASCADE;
  DROP TABLE "form_templates_blocks_date_field" CASCADE;
  DROP TABLE "form_templates_blocks_select_field_options" CASCADE;
  DROP TABLE "form_templates_blocks_select_field" CASCADE;
  DROP TABLE "form_templates_blocks_radio_field_options" CASCADE;
  DROP TABLE "form_templates_blocks_radio_field" CASCADE;
  DROP TABLE "form_templates_blocks_checkbox_field" CASCADE;
  DROP TABLE "form_templates_blocks_checkbox_group_field_options" CASCADE;
  DROP TABLE "form_templates_blocks_checkbox_group_field" CASCADE;
  DROP TABLE "form_templates_blocks_file_field" CASCADE;
  DROP TABLE "form_templates_blocks_url_field" CASCADE;
  DROP TABLE "form_templates_blocks_country_field" CASCADE;
  DROP TABLE "form_templates_blocks_heading_field" CASCADE;
  DROP TABLE "form_templates_blocks_paragraph_field" CASCADE;
  DROP TABLE "form_templates_blocks_divider_field" CASCADE;
  DROP TABLE "form_templates" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_locales" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  DROP TABLE "email_settings" CASCADE;
  DROP TABLE "projects_settings_impact_stats_stats" CASCADE;
  DROP TABLE "projects_settings_impact_stats_stats_locales" CASCADE;
  DROP TABLE "projects_settings" CASCADE;
  DROP TABLE "projects_settings_locales" CASCADE;
  DROP TABLE "site_settings_timeline_steps" CASCADE;
  DROP TABLE "site_settings_timeline_steps_locales" CASCADE;
  DROP TABLE "site_settings_erasmus_explainer_items" CASCADE;
  DROP TABLE "site_settings_erasmus_explainer_items_locales" CASCADE;
  DROP TABLE "site_settings_partner_portal_types" CASCADE;
  DROP TABLE "site_settings_partner_portal_types_locales" CASCADE;
  DROP TABLE "site_settings_partner_portal_requirements" CASCADE;
  DROP TABLE "site_settings_partner_portal_requirements_locales" CASCADE;
  DROP TABLE "site_settings_map_config_cities" CASCADE;
  DROP TABLE "site_settings_theme_impact_themes" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "open_calls" DROP CONSTRAINT "open_calls_apply_template_id_form_templates_id_fk";
  
  ALTER TABLE "registrations" DROP CONSTRAINT "registrations_cv_id_documents_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletters_fk";
  
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_registrations_status";
  CREATE TYPE "public"."enum_registrations_status" AS ENUM('pending', 'reviewing', 'accepted', 'rejected', 'waitlisted');
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_registrations_status";
  ALTER TABLE "registrations" ALTER COLUMN "status" SET DATA TYPE "public"."enum_registrations_status" USING "status"::"public"."enum_registrations_status";
  ALTER TABLE "partners" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_type";
  CREATE TYPE "public"."enum_partners_type" AS ENUM('partner', 'funder', 'network');
  ALTER TABLE "partners" ALTER COLUMN "type" SET DATA TYPE "public"."enum_partners_type" USING "type"::"public"."enum_partners_type";
  DROP INDEX "open_calls_apply_template_idx";
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  DROP INDEX "payload_locked_documents_rels_stories_id_idx";
  DROP INDEX "payload_locked_documents_rels_newsletters_id_idx";
  ALTER TABLE "registrations" ADD COLUMN "gdpr_consent" boolean DEFAULT false NOT NULL;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" DROP COLUMN "_key";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "projects" DROP COLUMN "participants";
  ALTER TABLE "projects" DROP COLUMN "video_url";
  ALTER TABLE "projects" DROP COLUMN "featured";
  ALTER TABLE "open_calls" DROP COLUMN "apply_template_id";
  ALTER TABLE "registrations" DROP COLUMN "agreement_url";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletters_id";
  DROP TYPE "public"."enum_projects_map_points_type";
  DROP TYPE "public"."enum_form_templates_blocks_heading_field_level";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_site_settings_theme_impact_themes_theme";`)
}
