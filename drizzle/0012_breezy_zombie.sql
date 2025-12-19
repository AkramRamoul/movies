CREATE TABLE "diaryEntries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"movie_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"rewatch" boolean DEFAULT false
);
