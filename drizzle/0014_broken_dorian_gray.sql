CREATE TABLE "activity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"activity_type" text NOT NULL,
	"movie_id" text,
	"list_id" integer,
	"created_at" timestamp DEFAULT now()
);
