CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_user_movie_review" UNIQUE("user_id","movie_id")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;