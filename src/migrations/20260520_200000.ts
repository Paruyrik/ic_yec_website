import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_projects_project_role" AS ENUM('coordinator', 'partner');
    ALTER TABLE "projects" ADD COLUMN "project_role" "enum_projects_project_role";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" DROP COLUMN "project_role";
    DROP TYPE "public"."enum_projects_project_role";
  `)
}
