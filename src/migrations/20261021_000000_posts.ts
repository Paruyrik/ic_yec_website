import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * posts collection - news / blog posts shown on /news and the homepage.
 * title, excerpt and content are localized (posts_locales).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_category" AS ENUM('news','event','story','announcement');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts" (
      "id"             serial PRIMARY KEY NOT NULL,
      "slug"           varchar NOT NULL,
      "cover_image_id" integer,
      "published_date" timestamp(3) with time zone NOT NULL,
      "category"       "enum_posts_category" DEFAULT 'news' NOT NULL,
      "author"         varchar,
      "featured"       boolean DEFAULT false,
      "published"      boolean DEFAULT true,
      "updated_at"     timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"     timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "posts_locales" (
      "title"      varchar NOT NULL,
      "excerpt"    varchar,
      "content"    jsonb,
      "id"         serial PRIMARY KEY NOT NULL,
      "_locale"    "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx"           ON "posts" USING btree ("slug");
    CREATE INDEX        IF NOT EXISTS "posts_cover_image_idx"    ON "posts" USING btree ("cover_image_id");
    CREATE INDEX        IF NOT EXISTS "posts_updated_at_idx"     ON "posts" USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "posts_created_at_idx"     ON "posts" USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "posts_published_date_idx" ON "posts" USING btree ("published_date");
    CREATE UNIQUE INDEX IF NOT EXISTS "posts_locales_locale_parent_id_unique"
      ON "posts_locales" USING btree ("_locale","_parent_id");
  `)

  // ── payload_locked_documents_rels: posts_id column ───────────────────────
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "posts_id" integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_posts_fk"
        FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx"
      ON "payload_locked_documents_rels" USING btree ("posts_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "posts_id";
  `)
  await db.execute(sql`DROP TABLE IF EXISTS "posts_locales";`)
  await db.execute(sql`DROP TABLE IF EXISTS "posts";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_posts_category";`)
}
