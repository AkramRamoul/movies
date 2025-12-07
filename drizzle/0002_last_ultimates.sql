ALTER TABLE "reviews" ALTER COLUMN "movie_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_seeded" boolean DEFAULT false;