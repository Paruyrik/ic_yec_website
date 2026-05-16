import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'hy', 'ru');
  CREATE TYPE "public"."enum_projects_theme" AS ENUM('art', 'sport', 'emotional-intelligence', 'training', 'inclusion', 'digital', 'environment');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('ongoing', 'completed', 'upcoming');
  CREATE TYPE "public"."enum_projects_funding_source" AS ENUM('erasmus-plus', 'other-eu', 'national', 'private');
  CREATE TYPE "public"."enum_open_calls_blocks_heading_field_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_open_calls_type" AS ENUM('youth-exchange', 'training-course', 'esc-volunteering', 'seminar', 'other');
  CREATE TYPE "public"."enum_open_calls_status" AS ENUM('open', 'closed', 'archived');
  CREATE TYPE "public"."enum_registrations_status" AS ENUM('pending', 'reviewing', 'accepted', 'rejected', 'waitlisted');
  CREATE TYPE "public"."enum_partners_type" AS ENUM('partner', 'funder', 'network');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  
  CREATE TABLE "projects_theme" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_theme",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"country" varchar
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_projects_status" NOT NULL,
  	"funding_source" "enum_projects_funding_source",
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer
  );
  
  CREATE TABLE "open_calls_eligibility_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"country" varchar
  );
  
  CREATE TABLE "open_calls_blocks_text_field" (
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
  
  CREATE TABLE "open_calls_blocks_textarea_field" (
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
  
  CREATE TABLE "open_calls_blocks_email_field" (
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
  
  CREATE TABLE "open_calls_blocks_phone_field" (
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
  
  CREATE TABLE "open_calls_blocks_number_field" (
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
  
  CREATE TABLE "open_calls_blocks_date_field" (
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
  
  CREATE TABLE "open_calls_blocks_select_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "open_calls_blocks_select_field" (
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
  
  CREATE TABLE "open_calls_blocks_radio_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "open_calls_blocks_radio_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls_blocks_checkbox_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls_blocks_checkbox_group_field_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "open_calls_blocks_checkbox_group_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"help_text" varchar,
  	"required" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls_blocks_file_field" (
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
  
  CREATE TABLE "open_calls_blocks_url_field" (
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
  
  CREATE TABLE "open_calls_blocks_country_field" (
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
  
  CREATE TABLE "open_calls_blocks_heading_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"level" "enum_open_calls_blocks_heading_field_level" DEFAULT 'h3',
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls_blocks_paragraph_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls_blocks_divider_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "open_calls" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_open_calls_type" NOT NULL,
  	"deadline" timestamp(3) with time zone NOT NULL,
  	"status" "enum_open_calls_status" DEFAULT 'open',
  	"dates_from" timestamp(3) with time zone,
  	"dates_to" timestamp(3) with time zone,
  	"eligibility_age_min" numeric DEFAULT 18,
  	"eligibility_age_max" numeric DEFAULT 30,
  	"eligibility_spots_available" numeric,
  	"cover_image_id" integer,
  	"registration_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "open_calls_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "registrations_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_type" varchar,
  	"field_label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"open_call_id" integer NOT NULL,
  	"applicant_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar NOT NULL,
  	"date_of_birth" timestamp(3) with time zone NOT NULL,
  	"motivation_letter" varchar,
  	"cv_id" integer,
  	"status" "enum_registrations_status" DEFAULT 'pending',
  	"gdpr_consent" boolean DEFAULT false NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"email" varchar,
  	"linkedin" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"website" varchar,
  	"type" "enum_partners_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"open_calls_id" integer,
  	"registrations_id" integer,
  	"team_members_id" integer,
  	"partners_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_theme" ADD CONSTRAINT "projects_theme_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_countries" ADD CONSTRAINT "projects_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_eligibility_countries" ADD CONSTRAINT "open_calls_eligibility_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_text_field" ADD CONSTRAINT "open_calls_blocks_text_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_textarea_field" ADD CONSTRAINT "open_calls_blocks_textarea_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_email_field" ADD CONSTRAINT "open_calls_blocks_email_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_phone_field" ADD CONSTRAINT "open_calls_blocks_phone_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_number_field" ADD CONSTRAINT "open_calls_blocks_number_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_date_field" ADD CONSTRAINT "open_calls_blocks_date_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_select_field_options" ADD CONSTRAINT "open_calls_blocks_select_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls_blocks_select_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_select_field" ADD CONSTRAINT "open_calls_blocks_select_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_radio_field_options" ADD CONSTRAINT "open_calls_blocks_radio_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls_blocks_radio_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_radio_field" ADD CONSTRAINT "open_calls_blocks_radio_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_checkbox_field" ADD CONSTRAINT "open_calls_blocks_checkbox_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_checkbox_group_field_options" ADD CONSTRAINT "open_calls_blocks_checkbox_group_field_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls_blocks_checkbox_group_field"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_checkbox_group_field" ADD CONSTRAINT "open_calls_blocks_checkbox_group_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_file_field" ADD CONSTRAINT "open_calls_blocks_file_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_url_field" ADD CONSTRAINT "open_calls_blocks_url_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_country_field" ADD CONSTRAINT "open_calls_blocks_country_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_heading_field" ADD CONSTRAINT "open_calls_blocks_heading_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_paragraph_field" ADD CONSTRAINT "open_calls_blocks_paragraph_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls_blocks_divider_field" ADD CONSTRAINT "open_calls_blocks_divider_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "open_calls" ADD CONSTRAINT "open_calls_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "open_calls_locales" ADD CONSTRAINT "open_calls_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registrations_answers" ADD CONSTRAINT "registrations_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_open_call_id_open_calls_id_fk" FOREIGN KEY ("open_call_id") REFERENCES "public"."open_calls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_open_calls_fk" FOREIGN KEY ("open_calls_id") REFERENCES "public"."open_calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "projects_theme_order_idx" ON "projects_theme" USING btree ("order");
  CREATE INDEX "projects_theme_parent_idx" ON "projects_theme" USING btree ("parent_id");
  CREATE INDEX "projects_countries_order_idx" ON "projects_countries" USING btree ("_order");
  CREATE INDEX "projects_countries_parent_id_idx" ON "projects_countries" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_partners_id_idx" ON "projects_rels" USING btree ("partners_id");
  CREATE INDEX "open_calls_eligibility_countries_order_idx" ON "open_calls_eligibility_countries" USING btree ("_order");
  CREATE INDEX "open_calls_eligibility_countries_parent_id_idx" ON "open_calls_eligibility_countries" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_text_field_order_idx" ON "open_calls_blocks_text_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_text_field_parent_id_idx" ON "open_calls_blocks_text_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_text_field_path_idx" ON "open_calls_blocks_text_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_textarea_field_order_idx" ON "open_calls_blocks_textarea_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_textarea_field_parent_id_idx" ON "open_calls_blocks_textarea_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_textarea_field_path_idx" ON "open_calls_blocks_textarea_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_email_field_order_idx" ON "open_calls_blocks_email_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_email_field_parent_id_idx" ON "open_calls_blocks_email_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_email_field_path_idx" ON "open_calls_blocks_email_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_phone_field_order_idx" ON "open_calls_blocks_phone_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_phone_field_parent_id_idx" ON "open_calls_blocks_phone_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_phone_field_path_idx" ON "open_calls_blocks_phone_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_number_field_order_idx" ON "open_calls_blocks_number_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_number_field_parent_id_idx" ON "open_calls_blocks_number_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_number_field_path_idx" ON "open_calls_blocks_number_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_date_field_order_idx" ON "open_calls_blocks_date_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_date_field_parent_id_idx" ON "open_calls_blocks_date_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_date_field_path_idx" ON "open_calls_blocks_date_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_select_field_options_order_idx" ON "open_calls_blocks_select_field_options" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_select_field_options_parent_id_idx" ON "open_calls_blocks_select_field_options" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_select_field_order_idx" ON "open_calls_blocks_select_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_select_field_parent_id_idx" ON "open_calls_blocks_select_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_select_field_path_idx" ON "open_calls_blocks_select_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_radio_field_options_order_idx" ON "open_calls_blocks_radio_field_options" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_radio_field_options_parent_id_idx" ON "open_calls_blocks_radio_field_options" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_radio_field_order_idx" ON "open_calls_blocks_radio_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_radio_field_parent_id_idx" ON "open_calls_blocks_radio_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_radio_field_path_idx" ON "open_calls_blocks_radio_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_checkbox_field_order_idx" ON "open_calls_blocks_checkbox_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_checkbox_field_parent_id_idx" ON "open_calls_blocks_checkbox_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_checkbox_field_path_idx" ON "open_calls_blocks_checkbox_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_checkbox_group_field_options_order_idx" ON "open_calls_blocks_checkbox_group_field_options" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_checkbox_group_field_options_parent_id_idx" ON "open_calls_blocks_checkbox_group_field_options" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_checkbox_group_field_order_idx" ON "open_calls_blocks_checkbox_group_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_checkbox_group_field_parent_id_idx" ON "open_calls_blocks_checkbox_group_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_checkbox_group_field_path_idx" ON "open_calls_blocks_checkbox_group_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_file_field_order_idx" ON "open_calls_blocks_file_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_file_field_parent_id_idx" ON "open_calls_blocks_file_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_file_field_path_idx" ON "open_calls_blocks_file_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_url_field_order_idx" ON "open_calls_blocks_url_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_url_field_parent_id_idx" ON "open_calls_blocks_url_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_url_field_path_idx" ON "open_calls_blocks_url_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_country_field_order_idx" ON "open_calls_blocks_country_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_country_field_parent_id_idx" ON "open_calls_blocks_country_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_country_field_path_idx" ON "open_calls_blocks_country_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_heading_field_order_idx" ON "open_calls_blocks_heading_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_heading_field_parent_id_idx" ON "open_calls_blocks_heading_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_heading_field_path_idx" ON "open_calls_blocks_heading_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_paragraph_field_order_idx" ON "open_calls_blocks_paragraph_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_paragraph_field_parent_id_idx" ON "open_calls_blocks_paragraph_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_paragraph_field_path_idx" ON "open_calls_blocks_paragraph_field" USING btree ("_path");
  CREATE INDEX "open_calls_blocks_divider_field_order_idx" ON "open_calls_blocks_divider_field" USING btree ("_order");
  CREATE INDEX "open_calls_blocks_divider_field_parent_id_idx" ON "open_calls_blocks_divider_field" USING btree ("_parent_id");
  CREATE INDEX "open_calls_blocks_divider_field_path_idx" ON "open_calls_blocks_divider_field" USING btree ("_path");
  CREATE UNIQUE INDEX "open_calls_slug_idx" ON "open_calls" USING btree ("slug");
  CREATE INDEX "open_calls_cover_image_idx" ON "open_calls" USING btree ("cover_image_id");
  CREATE INDEX "open_calls_updated_at_idx" ON "open_calls" USING btree ("updated_at");
  CREATE INDEX "open_calls_created_at_idx" ON "open_calls" USING btree ("created_at");
  CREATE UNIQUE INDEX "open_calls_locales_locale_parent_id_unique" ON "open_calls_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "registrations_answers_order_idx" ON "registrations_answers" USING btree ("_order");
  CREATE INDEX "registrations_answers_parent_id_idx" ON "registrations_answers" USING btree ("_parent_id");
  CREATE INDEX "registrations_open_call_idx" ON "registrations" USING btree ("open_call_id");
  CREATE INDEX "registrations_cv_idx" ON "registrations" USING btree ("cv_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_open_calls_id_idx" ON "payload_locked_documents_rels" USING btree ("open_calls_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects_theme" CASCADE;
  DROP TABLE "projects_countries" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "open_calls_eligibility_countries" CASCADE;
  DROP TABLE "open_calls_blocks_text_field" CASCADE;
  DROP TABLE "open_calls_blocks_textarea_field" CASCADE;
  DROP TABLE "open_calls_blocks_email_field" CASCADE;
  DROP TABLE "open_calls_blocks_phone_field" CASCADE;
  DROP TABLE "open_calls_blocks_number_field" CASCADE;
  DROP TABLE "open_calls_blocks_date_field" CASCADE;
  DROP TABLE "open_calls_blocks_select_field_options" CASCADE;
  DROP TABLE "open_calls_blocks_select_field" CASCADE;
  DROP TABLE "open_calls_blocks_radio_field_options" CASCADE;
  DROP TABLE "open_calls_blocks_radio_field" CASCADE;
  DROP TABLE "open_calls_blocks_checkbox_field" CASCADE;
  DROP TABLE "open_calls_blocks_checkbox_group_field_options" CASCADE;
  DROP TABLE "open_calls_blocks_checkbox_group_field" CASCADE;
  DROP TABLE "open_calls_blocks_file_field" CASCADE;
  DROP TABLE "open_calls_blocks_url_field" CASCADE;
  DROP TABLE "open_calls_blocks_country_field" CASCADE;
  DROP TABLE "open_calls_blocks_heading_field" CASCADE;
  DROP TABLE "open_calls_blocks_paragraph_field" CASCADE;
  DROP TABLE "open_calls_blocks_divider_field" CASCADE;
  DROP TABLE "open_calls" CASCADE;
  DROP TABLE "open_calls_locales" CASCADE;
  DROP TABLE "registrations_answers" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_projects_theme";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_projects_funding_source";
  DROP TYPE "public"."enum_open_calls_blocks_heading_field_level";
  DROP TYPE "public"."enum_open_calls_type";
  DROP TYPE "public"."enum_open_calls_status";
  DROP TYPE "public"."enum_registrations_status";
  DROP TYPE "public"."enum_partners_type";`)
}
