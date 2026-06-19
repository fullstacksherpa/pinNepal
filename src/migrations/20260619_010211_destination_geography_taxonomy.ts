import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_destinations_best_time_to_visit" AS ENUM('Spring', 'Summer/Monsoon', 'Autumn', 'Winter');
  CREATE TYPE "public"."enum_destinations_difficulty" AS ENUM('Easy', 'Moderate', 'Hard', 'Strenuous');
  CREATE TYPE "public"."enum_destinations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__destinations_v_version_best_time_to_visit" AS ENUM('Spring', 'Summer/Monsoon', 'Autumn', 'Winter');
  CREATE TYPE "public"."enum__destinations_v_version_difficulty" AS ENUM('Easy', 'Moderate', 'Hard', 'Strenuous');
  CREATE TYPE "public"."enum__destinations_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "destinations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "destinations_best_time_to_visit" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_destinations_best_time_to_visit",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destinations_things_to_do" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"activity" varchar
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"district_id" integer,
  	"hero_image_id" integer,
  	"recommended_duration" varchar,
  	"difficulty" "enum_destinations_difficulty",
  	"altitude" numeric,
  	"location" geometry(Point),
  	"how_to_get_there" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_destinations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "destinations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destination_categories_id" integer
  );
  
  CREATE TABLE "_destinations_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_destinations_v_version_best_time_to_visit" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__destinations_v_version_best_time_to_visit",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_destinations_v_version_things_to_do" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"activity" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_destinations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_district_id" integer,
  	"version_hero_image_id" integer,
  	"version_recommended_duration" varchar,
  	"version_difficulty" "enum__destinations_v_version_difficulty",
  	"version_altitude" numeric,
  	"version_location" geometry(Point),
  	"version_how_to_get_there" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__destinations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_destinations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destination_categories_id" integer
  );
  
  CREATE TABLE "destination_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "districts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"province_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "provinces" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "redirects_rels" ADD COLUMN "destinations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "destinations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "destination_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "districts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "provinces_id" integer;
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_best_time_to_visit" ADD CONSTRAINT "destinations_best_time_to_visit_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_things_to_do" ADD CONSTRAINT "destinations_things_to_do_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_destination_categories_fk" FOREIGN KEY ("destination_categories_id") REFERENCES "public"."destination_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_gallery" ADD CONSTRAINT "_destinations_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_gallery" ADD CONSTRAINT "_destinations_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_best_time_to_visit" ADD CONSTRAINT "_destinations_v_version_best_time_to_visit_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_things_to_do" ADD CONSTRAINT "_destinations_v_version_things_to_do_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_parent_id_destinations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_version_district_id_districts_id_fk" FOREIGN KEY ("version_district_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v_rels" ADD CONSTRAINT "_destinations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_rels" ADD CONSTRAINT "_destinations_v_rels_destination_categories_fk" FOREIGN KEY ("destination_categories_id") REFERENCES "public"."destination_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "destinations_gallery_order_idx" ON "destinations_gallery" USING btree ("_order");
  CREATE INDEX "destinations_gallery_parent_id_idx" ON "destinations_gallery" USING btree ("_parent_id");
  CREATE INDEX "destinations_gallery_image_idx" ON "destinations_gallery" USING btree ("image_id");
  CREATE INDEX "destinations_best_time_to_visit_order_idx" ON "destinations_best_time_to_visit" USING btree ("order");
  CREATE INDEX "destinations_best_time_to_visit_parent_idx" ON "destinations_best_time_to_visit" USING btree ("parent_id");
  CREATE INDEX "destinations_things_to_do_order_idx" ON "destinations_things_to_do" USING btree ("_order");
  CREATE INDEX "destinations_things_to_do_parent_id_idx" ON "destinations_things_to_do" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_district_idx" ON "destinations" USING btree ("district_id");
  CREATE INDEX "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE INDEX "destinations__status_idx" ON "destinations" USING btree ("_status");
  CREATE INDEX "destinations_rels_order_idx" ON "destinations_rels" USING btree ("order");
  CREATE INDEX "destinations_rels_parent_idx" ON "destinations_rels" USING btree ("parent_id");
  CREATE INDEX "destinations_rels_path_idx" ON "destinations_rels" USING btree ("path");
  CREATE INDEX "destinations_rels_destination_categories_id_idx" ON "destinations_rels" USING btree ("destination_categories_id");
  CREATE INDEX "_destinations_v_version_gallery_order_idx" ON "_destinations_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_destinations_v_version_gallery_parent_id_idx" ON "_destinations_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_destinations_v_version_gallery_image_idx" ON "_destinations_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_destinations_v_version_best_time_to_visit_order_idx" ON "_destinations_v_version_best_time_to_visit" USING btree ("order");
  CREATE INDEX "_destinations_v_version_best_time_to_visit_parent_idx" ON "_destinations_v_version_best_time_to_visit" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_version_things_to_do_order_idx" ON "_destinations_v_version_things_to_do" USING btree ("_order");
  CREATE INDEX "_destinations_v_version_things_to_do_parent_id_idx" ON "_destinations_v_version_things_to_do" USING btree ("_parent_id");
  CREATE INDEX "_destinations_v_parent_idx" ON "_destinations_v" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_version_version_slug_idx" ON "_destinations_v" USING btree ("version_slug");
  CREATE INDEX "_destinations_v_version_version_district_idx" ON "_destinations_v" USING btree ("version_district_id");
  CREATE INDEX "_destinations_v_version_version_hero_image_idx" ON "_destinations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_destinations_v_version_version_updated_at_idx" ON "_destinations_v" USING btree ("version_updated_at");
  CREATE INDEX "_destinations_v_version_version_created_at_idx" ON "_destinations_v" USING btree ("version_created_at");
  CREATE INDEX "_destinations_v_version_version__status_idx" ON "_destinations_v" USING btree ("version__status");
  CREATE INDEX "_destinations_v_created_at_idx" ON "_destinations_v" USING btree ("created_at");
  CREATE INDEX "_destinations_v_updated_at_idx" ON "_destinations_v" USING btree ("updated_at");
  CREATE INDEX "_destinations_v_latest_idx" ON "_destinations_v" USING btree ("latest");
  CREATE INDEX "_destinations_v_autosave_idx" ON "_destinations_v" USING btree ("autosave");
  CREATE INDEX "_destinations_v_rels_order_idx" ON "_destinations_v_rels" USING btree ("order");
  CREATE INDEX "_destinations_v_rels_parent_idx" ON "_destinations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_rels_path_idx" ON "_destinations_v_rels" USING btree ("path");
  CREATE INDEX "_destinations_v_rels_destination_categories_id_idx" ON "_destinations_v_rels" USING btree ("destination_categories_id");
  CREATE UNIQUE INDEX "destination_categories_slug_idx" ON "destination_categories" USING btree ("slug");
  CREATE INDEX "destination_categories_updated_at_idx" ON "destination_categories" USING btree ("updated_at");
  CREATE INDEX "destination_categories_created_at_idx" ON "destination_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "districts_slug_idx" ON "districts" USING btree ("slug");
  CREATE INDEX "districts_province_idx" ON "districts" USING btree ("province_id");
  CREATE INDEX "districts_updated_at_idx" ON "districts" USING btree ("updated_at");
  CREATE INDEX "districts_created_at_idx" ON "districts" USING btree ("created_at");
  CREATE UNIQUE INDEX "provinces_slug_idx" ON "provinces" USING btree ("slug");
  CREATE INDEX "provinces_updated_at_idx" ON "provinces" USING btree ("updated_at");
  CREATE INDEX "provinces_created_at_idx" ON "provinces" USING btree ("created_at");
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destination_categories_fk" FOREIGN KEY ("destination_categories_id") REFERENCES "public"."destination_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_districts_fk" FOREIGN KEY ("districts_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_provinces_fk" FOREIGN KEY ("provinces_id") REFERENCES "public"."provinces"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "redirects_rels_destinations_id_idx" ON "redirects_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_destination_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("destination_categories_id");
  CREATE INDEX "payload_locked_documents_rels_districts_id_idx" ON "payload_locked_documents_rels" USING btree ("districts_id");
  CREATE INDEX "payload_locked_documents_rels_provinces_id_idx" ON "payload_locked_documents_rels" USING btree ("provinces_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "destinations_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_best_time_to_visit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_things_to_do" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_version_best_time_to_visit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_version_things_to_do" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destination_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "districts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provinces" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "destinations_gallery" CASCADE;
  DROP TABLE "destinations_best_time_to_visit" CASCADE;
  DROP TABLE "destinations_things_to_do" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_rels" CASCADE;
  DROP TABLE "_destinations_v_version_gallery" CASCADE;
  DROP TABLE "_destinations_v_version_best_time_to_visit" CASCADE;
  DROP TABLE "_destinations_v_version_things_to_do" CASCADE;
  DROP TABLE "_destinations_v" CASCADE;
  DROP TABLE "_destinations_v_rels" CASCADE;
  DROP TABLE "destination_categories" CASCADE;
  DROP TABLE "districts" CASCADE;
  DROP TABLE "provinces" CASCADE;
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_destinations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_destinations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_destination_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_districts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_provinces_fk";
  
  DROP INDEX "redirects_rels_destinations_id_idx";
  DROP INDEX "payload_locked_documents_rels_destinations_id_idx";
  DROP INDEX "payload_locked_documents_rels_destination_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_districts_id_idx";
  DROP INDEX "payload_locked_documents_rels_provinces_id_idx";
  ALTER TABLE "redirects_rels" DROP COLUMN "destinations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "destinations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "destination_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "districts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "provinces_id";
  DROP TYPE "public"."enum_destinations_best_time_to_visit";
  DROP TYPE "public"."enum_destinations_difficulty";
  DROP TYPE "public"."enum_destinations_status";
  DROP TYPE "public"."enum__destinations_v_version_best_time_to_visit";
  DROP TYPE "public"."enum__destinations_v_version_difficulty";
  DROP TYPE "public"."enum__destinations_v_version_status";`)
}
