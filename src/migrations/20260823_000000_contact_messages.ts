import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * contact-messages collection - persists website contact-form submissions
 * that were previously only console.logged.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new','read','replied','archived');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_messages" (
      "id"          serial PRIMARY KEY NOT NULL,
      "name"        varchar NOT NULL,
      "email"       varchar NOT NULL,
      "subject"     varchar NOT NULL,
      "message"     varchar NOT NULL,
      "status"      "enum_contact_messages_status" DEFAULT 'new' NOT NULL,
      "admin_notes" varchar,
      "updated_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"  timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "contact_messages_status_idx"     ON "contact_messages" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  `)

  // ── payload_locked_documents_rels: contact_messages_id column ────────────
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "contact_messages_id" integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk"
        FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_messages_id_idx"
      ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "contact_messages_id";
  `)
  await db.execute(sql`DROP TABLE IF EXISTS "contact_messages";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_contact_messages_status";`)
}
