import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
   EXCEPTION
    WHEN duplicate_object THEN null;
   END $$;

  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "blogs_populated_authors" ADD COLUMN IF NOT EXISTS "title" varchar;
  ALTER TABLE "blogs_populated_authors" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "_blogs_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "title" varchar;
  ALTER TABLE "_blogs_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "title" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image_id" integer;
  DO $$ BEGIN
    ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  DO $$ BEGIN
    ALTER TABLE "blogs_populated_authors" ADD CONSTRAINT "blogs_populated_authors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_blogs_v_version_populated_authors" ADD CONSTRAINT "_blogs_v_version_populated_authors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "users" ADD CONSTRAINT "users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "blogs_populated_authors_image_idx" ON "blogs_populated_authors" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blogs_v_version_populated_authors_image_idx" ON "_blogs_v_version_populated_authors" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "users_image_idx" ON "users" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  ALTER TABLE "blogs_populated_authors" DROP CONSTRAINT "blogs_populated_authors_image_id_media_id_fk";
  
  ALTER TABLE "_blogs_v_version_populated_authors" DROP CONSTRAINT "_blogs_v_version_populated_authors_image_id_media_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_image_id_media_id_fk";
  
  DROP INDEX "blogs_populated_authors_image_idx";
  DROP INDEX "_blogs_v_version_populated_authors_image_idx";
  DROP INDEX "users_image_idx";
  ALTER TABLE "blogs_populated_authors" DROP COLUMN "title";
  ALTER TABLE "blogs_populated_authors" DROP COLUMN "image_id";
  ALTER TABLE "_blogs_v_version_populated_authors" DROP COLUMN "title";
  ALTER TABLE "_blogs_v_version_populated_authors" DROP COLUMN "image_id";
  ALTER TABLE "users" DROP COLUMN "title";
  ALTER TABLE "users" DROP COLUMN "image_id";
  DROP TYPE "public"."enum_users_roles";`)
}
