import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tour_pkgs_trip_highlights_category" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'cultural', 'wildlife', 'other');
  CREATE TYPE "public"."enum_tour_pkgs_itinerary_options_difficulty_level" AS ENUM('EASY', 'EASY_MODERATE', 'MODERATE', 'MODERATE_CHALLENGING', 'CHALLENGING', 'EXTREME');
  CREATE TYPE "public"."enum_tour_pkgs_itinerary_options_activity_type" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'driving', 'other');
  CREATE TYPE "public"."enum_tour_pkgs_itinerary_activity_type" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'driving', 'other');
  CREATE TYPE "public"."enum_tour_pkgs_faqs_category" AS ENUM('logistics', 'fitness', 'accommodation', 'activity', 'guides', 'booking', 'preparation', 'other');
  CREATE TYPE "public"."enum_tour_pkgs_difficulty_level" AS ENUM('EASY', 'EASY_MODERATE', 'MODERATE', 'MODERATE_CHALLENGING', 'CHALLENGING', 'EXTREME');
  CREATE TYPE "public"."enum_tour_pkgs_currency" AS ENUM('NPR', 'USD', 'EUR', 'GBP', 'AUD', 'NZD');
  CREATE TYPE "public"."enum_tour_pkgs_availability_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_tour_pkgs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_trip_highlights_category" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'cultural', 'wildlife', 'other');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_itinerary_options_difficulty_level" AS ENUM('EASY', 'EASY_MODERATE', 'MODERATE', 'MODERATE_CHALLENGING', 'CHALLENGING', 'EXTREME');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_itinerary_options_activity_type" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'driving', 'other');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_itinerary_activity_type" AS ENUM('hiking', 'biking', 'kayaking', 'walking', 'cruise', 'driving', 'other');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_faqs_category" AS ENUM('logistics', 'fitness', 'accommodation', 'activity', 'guides', 'booking', 'preparation', 'other');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_difficulty_level" AS ENUM('EASY', 'EASY_MODERATE', 'MODERATE', 'MODERATE_CHALLENGING', 'CHALLENGING', 'EXTREME');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_currency" AS ENUM('NPR', 'USD', 'EUR', 'GBP', 'AUD', 'NZD');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_availability_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum__tour_pkgs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "tour_pkgs_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "tour_pkgs_trip_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_tour_pkgs_trip_highlights_category",
  	"image_id" integer,
  	"short_description" varchar
  );
  
  CREATE TABLE "tour_pkgs_itinerary_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "tour_pkgs_itinerary_optional_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"activity" varchar
  );
  
  CREATE TABLE "tour_pkgs_itinerary_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option_id" varchar,
  	"option_label" varchar,
  	"option_title" varchar,
  	"difficulty_level" "enum_tour_pkgs_itinerary_options_difficulty_level",
  	"description" varchar,
  	"accommodation" varchar,
  	"activity_type" "enum_tour_pkgs_itinerary_options_activity_type",
  	"activity_duration_hours_min" numeric,
  	"activity_duration_hours_max" numeric,
  	"activity_distance_km" numeric,
  	"activity_elevation_gain_m" numeric,
  	"activity_elevation_loss_m" numeric
  );
  
  CREATE TABLE "tour_pkgs_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" numeric,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"accommodation" varchar,
  	"meals_breakfast" boolean DEFAULT false,
  	"meals_lunch" boolean DEFAULT false,
  	"meals_dinner" boolean DEFAULT false,
  	"activity_type" "enum_tour_pkgs_itinerary_activity_type",
  	"activity_duration_hours_min" numeric,
  	"activity_duration_hours_max" numeric,
  	"activity_distance_km" numeric,
  	"activity_elevation_gain_m" numeric,
  	"activity_elevation_loss_m" numeric,
  	"is_free_day" boolean DEFAULT false,
  	"has_options" boolean DEFAULT false
  );
  
  CREATE TABLE "tour_pkgs_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tour_pkgs_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "tour_pkgs_licences_and_permits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"issued_by" varchar,
  	"included_in_price" boolean DEFAULT true,
  	"notes" varchar
  );
  
  CREATE TABLE "tour_pkgs_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"category" "enum_tour_pkgs_faqs_category"
  );
  
  CREATE TABLE "tour_pkgs_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "tour_pkgs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"tagline" varchar,
  	"description" jsonb,
  	"cover_image_id" integer,
  	"start_location" varchar,
  	"end_location" varchar,
  	"total_days" numeric,
  	"total_nights" numeric,
  	"average_group_size" numeric,
  	"min_group_size" numeric,
  	"max_group_size" numeric,
  	"difficulty_level" "enum_tour_pkgs_difficulty_level",
  	"difficulty_label" varchar,
  	"difficulty_description" varchar,
  	"currency" "enum_tour_pkgs_currency" DEFAULT 'NPR',
  	"price_per_person" numeric,
  	"taxes_included" boolean DEFAULT true,
  	"single_supplement" numeric,
  	"deposit_amount" numeric,
  	"whatsapp_number" varchar,
  	"whatsapp_prefill_message" varchar,
  	"rating" numeric,
  	"review_count" numeric,
  	"region_id" integer,
  	"availability_status" "enum_tour_pkgs_availability_status" DEFAULT 'active',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tour_pkgs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tour_pkgs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tour_pkg_cats_id" integer,
  	"tour_pkgs_id" integer
  );
  
  CREATE TABLE "_tour_pkgs_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_trip_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum__tour_pkgs_v_version_trip_highlights_category",
  	"image_id" integer,
  	"short_description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_itinerary_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_itinerary_optional_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"activity" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_itinerary_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"option_id" varchar,
  	"option_label" varchar,
  	"option_title" varchar,
  	"difficulty_level" "enum__tour_pkgs_v_version_itinerary_options_difficulty_level",
  	"description" varchar,
  	"accommodation" varchar,
  	"activity_type" "enum__tour_pkgs_v_version_itinerary_options_activity_type",
  	"activity_duration_hours_min" numeric,
  	"activity_duration_hours_max" numeric,
  	"activity_distance_km" numeric,
  	"activity_elevation_gain_m" numeric,
  	"activity_elevation_loss_m" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" numeric,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"accommodation" varchar,
  	"meals_breakfast" boolean DEFAULT false,
  	"meals_lunch" boolean DEFAULT false,
  	"meals_dinner" boolean DEFAULT false,
  	"activity_type" "enum__tour_pkgs_v_version_itinerary_activity_type",
  	"activity_duration_hours_min" numeric,
  	"activity_duration_hours_max" numeric,
  	"activity_distance_km" numeric,
  	"activity_elevation_gain_m" numeric,
  	"activity_elevation_loss_m" numeric,
  	"is_free_day" boolean DEFAULT false,
  	"has_options" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_licences_and_permits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"issued_by" varchar,
  	"included_in_price" boolean DEFAULT true,
  	"notes" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"category" "enum__tour_pkgs_v_version_faqs_category",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tour_pkgs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_description" jsonb,
  	"version_cover_image_id" integer,
  	"version_start_location" varchar,
  	"version_end_location" varchar,
  	"version_total_days" numeric,
  	"version_total_nights" numeric,
  	"version_average_group_size" numeric,
  	"version_min_group_size" numeric,
  	"version_max_group_size" numeric,
  	"version_difficulty_level" "enum__tour_pkgs_v_version_difficulty_level",
  	"version_difficulty_label" varchar,
  	"version_difficulty_description" varchar,
  	"version_currency" "enum__tour_pkgs_v_version_currency" DEFAULT 'NPR',
  	"version_price_per_person" numeric,
  	"version_taxes_included" boolean DEFAULT true,
  	"version_single_supplement" numeric,
  	"version_deposit_amount" numeric,
  	"version_whatsapp_number" varchar,
  	"version_whatsapp_prefill_message" varchar,
  	"version_rating" numeric,
  	"version_review_count" numeric,
  	"version_region_id" integer,
  	"version_availability_status" "enum__tour_pkgs_v_version_availability_status" DEFAULT 'active',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tour_pkgs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_tour_pkgs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tour_pkg_cats_id" integer,
  	"tour_pkgs_id" integer
  );
  
  CREATE TABLE "tour_pkg_cats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tour_pkgs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tour_pkg_cats_id" integer;
  ALTER TABLE "tour_pkgs_gallery" ADD CONSTRAINT "tour_pkgs_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs_gallery" ADD CONSTRAINT "tour_pkgs_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_trip_highlights" ADD CONSTRAINT "tour_pkgs_trip_highlights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs_trip_highlights" ADD CONSTRAINT "tour_pkgs_trip_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_itinerary_highlights" ADD CONSTRAINT "tour_pkgs_itinerary_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_itinerary_optional_activities" ADD CONSTRAINT "tour_pkgs_itinerary_optional_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_itinerary_options" ADD CONSTRAINT "tour_pkgs_itinerary_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_itinerary" ADD CONSTRAINT "tour_pkgs_itinerary_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs_itinerary" ADD CONSTRAINT "tour_pkgs_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_inclusions" ADD CONSTRAINT "tour_pkgs_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_exclusions" ADD CONSTRAINT "tour_pkgs_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_licences_and_permits" ADD CONSTRAINT "tour_pkgs_licences_and_permits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_faqs" ADD CONSTRAINT "tour_pkgs_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_tags" ADD CONSTRAINT "tour_pkgs_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs" ADD CONSTRAINT "tour_pkgs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs" ADD CONSTRAINT "tour_pkgs_region_id_districts_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs" ADD CONSTRAINT "tour_pkgs_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_pkgs_rels" ADD CONSTRAINT "tour_pkgs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_rels" ADD CONSTRAINT "tour_pkgs_rels_tour_package_categories_fk" FOREIGN KEY ("tour_pkg_cats_id") REFERENCES "public"."tour_pkg_cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_pkgs_rels" ADD CONSTRAINT "tour_pkgs_rels_tour_packages_fk" FOREIGN KEY ("tour_pkgs_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_gallery" ADD CONSTRAINT "_tour_pkgs_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_gallery" ADD CONSTRAINT "_tour_pkgs_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_trip_highlights" ADD CONSTRAINT "_tour_pkgs_v_version_trip_highlights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_trip_highlights" ADD CONSTRAINT "_tour_pkgs_v_version_trip_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_highlights" ADD CONSTRAINT "_tour_pkgs_v_version_itinerary_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v_version_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_optional_activities" ADD CONSTRAINT "_tour_pkgs_v_version_itinerary_optional_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v_version_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_options" ADD CONSTRAINT "_tour_pkgs_v_version_itinerary_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v_version_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_itinerary" ADD CONSTRAINT "_tour_pkgs_v_version_itinerary_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_itinerary" ADD CONSTRAINT "_tour_pkgs_v_version_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_inclusions" ADD CONSTRAINT "_tour_pkgs_v_version_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_exclusions" ADD CONSTRAINT "_tour_pkgs_v_version_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_licences_and_permits" ADD CONSTRAINT "_tour_pkgs_v_version_licences_and_permits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_faqs" ADD CONSTRAINT "_tour_pkgs_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_version_tags" ADD CONSTRAINT "_tour_pkgs_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v" ADD CONSTRAINT "_tour_pkgs_v_parent_id_tour_pkgs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v" ADD CONSTRAINT "_tour_pkgs_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v" ADD CONSTRAINT "_tour_pkgs_v_version_region_id_districts_id_fk" FOREIGN KEY ("version_region_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v" ADD CONSTRAINT "_tour_pkgs_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_rels" ADD CONSTRAINT "_tour_pkgs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tour_pkgs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_rels" ADD CONSTRAINT "_tour_pkgs_v_rels_tour_package_categories_fk" FOREIGN KEY ("tour_pkg_cats_id") REFERENCES "public"."tour_pkg_cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_pkgs_v_rels" ADD CONSTRAINT "_tour_pkgs_v_rels_tour_packages_fk" FOREIGN KEY ("tour_pkgs_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tour_pkgs_gallery_order_idx" ON "tour_pkgs_gallery" USING btree ("_order");
  CREATE INDEX "tour_pkgs_gallery_parent_id_idx" ON "tour_pkgs_gallery" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_gallery_image_idx" ON "tour_pkgs_gallery" USING btree ("image_id");
  CREATE INDEX "tour_pkgs_trip_highlights_order_idx" ON "tour_pkgs_trip_highlights" USING btree ("_order");
  CREATE INDEX "tour_pkgs_trip_highlights_parent_id_idx" ON "tour_pkgs_trip_highlights" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_trip_highlights_image_idx" ON "tour_pkgs_trip_highlights" USING btree ("image_id");
  CREATE INDEX "tour_pkgs_itinerary_highlights_order_idx" ON "tour_pkgs_itinerary_highlights" USING btree ("_order");
  CREATE INDEX "tour_pkgs_itinerary_highlights_parent_id_idx" ON "tour_pkgs_itinerary_highlights" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_itinerary_optional_activities_order_idx" ON "tour_pkgs_itinerary_optional_activities" USING btree ("_order");
  CREATE INDEX "tour_pkgs_itinerary_optional_activities_parent_id_idx" ON "tour_pkgs_itinerary_optional_activities" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_itinerary_options_order_idx" ON "tour_pkgs_itinerary_options" USING btree ("_order");
  CREATE INDEX "tour_pkgs_itinerary_options_parent_id_idx" ON "tour_pkgs_itinerary_options" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_itinerary_order_idx" ON "tour_pkgs_itinerary" USING btree ("_order");
  CREATE INDEX "tour_pkgs_itinerary_parent_id_idx" ON "tour_pkgs_itinerary" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_itinerary_image_idx" ON "tour_pkgs_itinerary" USING btree ("image_id");
  CREATE INDEX "tour_pkgs_inclusions_order_idx" ON "tour_pkgs_inclusions" USING btree ("_order");
  CREATE INDEX "tour_pkgs_inclusions_parent_id_idx" ON "tour_pkgs_inclusions" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_exclusions_order_idx" ON "tour_pkgs_exclusions" USING btree ("_order");
  CREATE INDEX "tour_pkgs_exclusions_parent_id_idx" ON "tour_pkgs_exclusions" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_licences_and_permits_order_idx" ON "tour_pkgs_licences_and_permits" USING btree ("_order");
  CREATE INDEX "tour_pkgs_licences_and_permits_parent_id_idx" ON "tour_pkgs_licences_and_permits" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_faqs_order_idx" ON "tour_pkgs_faqs" USING btree ("_order");
  CREATE INDEX "tour_pkgs_faqs_parent_id_idx" ON "tour_pkgs_faqs" USING btree ("_parent_id");
  CREATE INDEX "tour_pkgs_tags_order_idx" ON "tour_pkgs_tags" USING btree ("_order");
  CREATE INDEX "tour_pkgs_tags_parent_id_idx" ON "tour_pkgs_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tour_pkgs_slug_idx" ON "tour_pkgs" USING btree ("slug");
  CREATE INDEX "tour_pkgs_cover_image_idx" ON "tour_pkgs" USING btree ("cover_image_id");
  CREATE INDEX "tour_pkgs_region_idx" ON "tour_pkgs" USING btree ("region_id");
  CREATE INDEX "tour_pkgs_seo_seo_og_image_idx" ON "tour_pkgs" USING btree ("seo_og_image_id");
  CREATE INDEX "tour_pkgs_updated_at_idx" ON "tour_pkgs" USING btree ("updated_at");
  CREATE INDEX "tour_pkgs_created_at_idx" ON "tour_pkgs" USING btree ("created_at");
  CREATE INDEX "tour_pkgs__status_idx" ON "tour_pkgs" USING btree ("_status");
  CREATE INDEX "tour_pkgs_rels_order_idx" ON "tour_pkgs_rels" USING btree ("order");
  CREATE INDEX "tour_pkgs_rels_parent_idx" ON "tour_pkgs_rels" USING btree ("parent_id");
  CREATE INDEX "tour_pkgs_rels_path_idx" ON "tour_pkgs_rels" USING btree ("path");
  CREATE INDEX "tour_pkgs_rels_tour_pkg_cats_id_idx" ON "tour_pkgs_rels" USING btree ("tour_pkg_cats_id");
  CREATE INDEX "tour_pkgs_rels_tour_pkgs_id_idx" ON "tour_pkgs_rels" USING btree ("tour_pkgs_id");
  CREATE INDEX "_tour_pkgs_v_version_gallery_order_idx" ON "_tour_pkgs_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_gallery_parent_id_idx" ON "_tour_pkgs_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_gallery_image_idx" ON "_tour_pkgs_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_tour_pkgs_v_version_trip_highlights_order_idx" ON "_tour_pkgs_v_version_trip_highlights" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_trip_highlights_parent_id_idx" ON "_tour_pkgs_v_version_trip_highlights" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_trip_highlights_image_idx" ON "_tour_pkgs_v_version_trip_highlights" USING btree ("image_id");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_highlights_order_idx" ON "_tour_pkgs_v_version_itinerary_highlights" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_highlights_parent_id_idx" ON "_tour_pkgs_v_version_itinerary_highlights" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_optional_activities_order_idx" ON "_tour_pkgs_v_version_itinerary_optional_activities" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_optional_activities_parent_id_idx" ON "_tour_pkgs_v_version_itinerary_optional_activities" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_options_order_idx" ON "_tour_pkgs_v_version_itinerary_options" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_options_parent_id_idx" ON "_tour_pkgs_v_version_itinerary_options" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_order_idx" ON "_tour_pkgs_v_version_itinerary" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_parent_id_idx" ON "_tour_pkgs_v_version_itinerary" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_itinerary_image_idx" ON "_tour_pkgs_v_version_itinerary" USING btree ("image_id");
  CREATE INDEX "_tour_pkgs_v_version_inclusions_order_idx" ON "_tour_pkgs_v_version_inclusions" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_inclusions_parent_id_idx" ON "_tour_pkgs_v_version_inclusions" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_exclusions_order_idx" ON "_tour_pkgs_v_version_exclusions" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_exclusions_parent_id_idx" ON "_tour_pkgs_v_version_exclusions" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_licences_and_permits_order_idx" ON "_tour_pkgs_v_version_licences_and_permits" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_licences_and_permits_parent_id_idx" ON "_tour_pkgs_v_version_licences_and_permits" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_faqs_order_idx" ON "_tour_pkgs_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_faqs_parent_id_idx" ON "_tour_pkgs_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_version_tags_order_idx" ON "_tour_pkgs_v_version_tags" USING btree ("_order");
  CREATE INDEX "_tour_pkgs_v_version_tags_parent_id_idx" ON "_tour_pkgs_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_tour_pkgs_v_parent_idx" ON "_tour_pkgs_v" USING btree ("parent_id");
  CREATE INDEX "_tour_pkgs_v_version_version_slug_idx" ON "_tour_pkgs_v" USING btree ("version_slug");
  CREATE INDEX "_tour_pkgs_v_version_version_cover_image_idx" ON "_tour_pkgs_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_tour_pkgs_v_version_version_region_idx" ON "_tour_pkgs_v" USING btree ("version_region_id");
  CREATE INDEX "_tour_pkgs_v_version_seo_version_seo_og_image_idx" ON "_tour_pkgs_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_tour_pkgs_v_version_version_updated_at_idx" ON "_tour_pkgs_v" USING btree ("version_updated_at");
  CREATE INDEX "_tour_pkgs_v_version_version_created_at_idx" ON "_tour_pkgs_v" USING btree ("version_created_at");
  CREATE INDEX "_tour_pkgs_v_version_version__status_idx" ON "_tour_pkgs_v" USING btree ("version__status");
  CREATE INDEX "_tour_pkgs_v_created_at_idx" ON "_tour_pkgs_v" USING btree ("created_at");
  CREATE INDEX "_tour_pkgs_v_updated_at_idx" ON "_tour_pkgs_v" USING btree ("updated_at");
  CREATE INDEX "_tour_pkgs_v_latest_idx" ON "_tour_pkgs_v" USING btree ("latest");
  CREATE INDEX "_tour_pkgs_v_autosave_idx" ON "_tour_pkgs_v" USING btree ("autosave");
  CREATE INDEX "_tour_pkgs_v_rels_order_idx" ON "_tour_pkgs_v_rels" USING btree ("order");
  CREATE INDEX "_tour_pkgs_v_rels_parent_idx" ON "_tour_pkgs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tour_pkgs_v_rels_path_idx" ON "_tour_pkgs_v_rels" USING btree ("path");
  CREATE INDEX "_tour_pkgs_v_rels_tour_pkg_cats_id_idx" ON "_tour_pkgs_v_rels" USING btree ("tour_pkg_cats_id");
  CREATE INDEX "_tour_pkgs_v_rels_tour_pkgs_id_idx" ON "_tour_pkgs_v_rels" USING btree ("tour_pkgs_id");
  CREATE UNIQUE INDEX "tour_pkg_cats_slug_idx" ON "tour_pkg_cats" USING btree ("slug");
  CREATE INDEX "tour_pkg_cats_updated_at_idx" ON "tour_pkg_cats" USING btree ("updated_at");
  CREATE INDEX "tour_pkg_cats_created_at_idx" ON "tour_pkg_cats" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tour_packages_fk" FOREIGN KEY ("tour_pkgs_id") REFERENCES "public"."tour_pkgs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tour_package_categories_fk" FOREIGN KEY ("tour_pkg_cats_id") REFERENCES "public"."tour_pkg_cats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tour_pkgs_id_idx" ON "payload_locked_documents_rels" USING btree ("tour_pkgs_id");
  CREATE INDEX "payload_locked_documents_rels_tour_pkg_cats_id_idx" ON "payload_locked_documents_rels" USING btree ("tour_pkg_cats_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tour_pkgs_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_trip_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_itinerary_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_itinerary_optional_activities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_itinerary_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_itinerary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_inclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_exclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_licences_and_permits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkgs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_trip_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_optional_activities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_itinerary_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_itinerary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_inclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_exclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_licences_and_permits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_pkgs_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_pkg_cats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tour_pkgs_gallery" CASCADE;
  DROP TABLE "tour_pkgs_trip_highlights" CASCADE;
  DROP TABLE "tour_pkgs_itinerary_highlights" CASCADE;
  DROP TABLE "tour_pkgs_itinerary_optional_activities" CASCADE;
  DROP TABLE "tour_pkgs_itinerary_options" CASCADE;
  DROP TABLE "tour_pkgs_itinerary" CASCADE;
  DROP TABLE "tour_pkgs_inclusions" CASCADE;
  DROP TABLE "tour_pkgs_exclusions" CASCADE;
  DROP TABLE "tour_pkgs_licences_and_permits" CASCADE;
  DROP TABLE "tour_pkgs_faqs" CASCADE;
  DROP TABLE "tour_pkgs_tags" CASCADE;
  DROP TABLE "tour_pkgs" CASCADE;
  DROP TABLE "tour_pkgs_rels" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_gallery" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_trip_highlights" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_itinerary_highlights" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_itinerary_optional_activities" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_itinerary_options" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_itinerary" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_inclusions" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_exclusions" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_licences_and_permits" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_faqs" CASCADE;
  DROP TABLE "_tour_pkgs_v_version_tags" CASCADE;
  DROP TABLE "_tour_pkgs_v" CASCADE;
  DROP TABLE "_tour_pkgs_v_rels" CASCADE;
  DROP TABLE "tour_pkg_cats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tour_packages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tour_package_categories_fk";
  
  DROP INDEX "payload_locked_documents_rels_tour_pkgs_id_idx";
  DROP INDEX "payload_locked_documents_rels_tour_pkg_cats_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tour_pkgs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tour_pkg_cats_id";
  DROP TYPE "public"."enum_tour_pkgs_trip_highlights_category";
  DROP TYPE "public"."enum_tour_pkgs_itinerary_options_difficulty_level";
  DROP TYPE "public"."enum_tour_pkgs_itinerary_options_activity_type";
  DROP TYPE "public"."enum_tour_pkgs_itinerary_activity_type";
  DROP TYPE "public"."enum_tour_pkgs_faqs_category";
  DROP TYPE "public"."enum_tour_pkgs_difficulty_level";
  DROP TYPE "public"."enum_tour_pkgs_currency";
  DROP TYPE "public"."enum_tour_pkgs_availability_status";
  DROP TYPE "public"."enum_tour_pkgs_status";
  DROP TYPE "public"."enum__tour_pkgs_v_version_trip_highlights_category";
  DROP TYPE "public"."enum__tour_pkgs_v_version_itinerary_options_difficulty_level";
  DROP TYPE "public"."enum__tour_pkgs_v_version_itinerary_options_activity_type";
  DROP TYPE "public"."enum__tour_pkgs_v_version_itinerary_activity_type";
  DROP TYPE "public"."enum__tour_pkgs_v_version_faqs_category";
  DROP TYPE "public"."enum__tour_pkgs_v_version_difficulty_level";
  DROP TYPE "public"."enum__tour_pkgs_v_version_currency";
  DROP TYPE "public"."enum__tour_pkgs_v_version_availability_status";
  DROP TYPE "public"."enum__tour_pkgs_v_version_status";`)
}
