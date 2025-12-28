CREATE TYPE "public"."activity_type" AS ENUM('reviewed', 'watched', 'liked', 'rewatched');--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "activity_type" SET DATA TYPE "public"."activity_type" USING "activity_type"::"public"."activity_type";--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "review_id" SET DATA TYPE text;