import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_partner_applications_org_type" AS ENUM('youth-ngo', 'school', 'youth-centre', 'cultural', 'municipality', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_partner_applications_status" AS ENUM('new', 'reviewing', 'contacted', 'approved', 'declined');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_partner_applications_project_interests" AS ENUM('youth-exchange', 'training-course', 'esc-volunteering', 'seminar', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
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
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partner_applications_project_interests" (
      "order"     integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value"     "enum_partner_applications_project_interests",
      "id"        serial PRIMARY KEY NOT NULL
    );
    ALTER TABLE "partner_applications_project_interests"
      ADD CONSTRAINT "partner_applications_project_interests_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."partner_applications"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "partner_applications_project_interests_order_idx"
      ON "partner_applications_project_interests" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "partner_applications_project_interests_parent_idx"
      ON "partner_applications_project_interests" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "partner_applications_status_idx"
      ON "partner_applications" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "partner_applications_created_at_idx"
      ON "partner_applications" USING btree ("created_at");
  `)

  // Add partner_applications_id to payload_locked_documents_rels (required for every new collection)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "partner_applications_id" integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_partner_applications_fk"
        FOREIGN KEY ("partner_applications_id") REFERENCES "public"."partner_applications"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partner_applications_id_idx"
      ON "payload_locked_documents_rels" USING btree ("partner_applications_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "partner_applications_project_interests" CASCADE;
    DROP TABLE IF EXISTS "partner_applications" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_partner_applications_project_interests";
    DROP TYPE IF EXISTS "public"."enum_partner_applications_status";
    DROP TYPE IF EXISTS "public"."enum_partner_applications_org_type";
  `)
}
